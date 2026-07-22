/**
 * Phase 2A access + entitlement provider.
 *
 * This is a typed LOCAL MOCK. It holds state in memory for the lifetime of the
 * app process. There is deliberately no persistence, no network, and no
 * billing.
 *
 * Replacement boundary — later phases swap the internals of this file only:
 *   • `createAccount` / `signIn` / `signOut` -> Supabase Auth.
 *   • `entitlement` -> derived from RevenueCat + the PYPER membership record,
 *     read through a secure backend with Row Level Security enabled.
 *   • `confirmTrial` -> Apple StoreKit (iOS) / Google Play Billing (Android).
 *   • `events` -> a first-party, non-behavioural audit sink. Never an ad or
 *     session-replay SDK, and never carrying health data.
 *
 * Screens must consume `useAccess()` / `useCapabilities()` and never reach for
 * an entitlement string directly, so none of the above requires a screen
 * rewrite.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';

import {
  getCapabilities,
  type Capabilities,
  type EntitlementState,
} from './entitlements';
import { DEFAULT_PLAN_ID, TRIAL_DAYS, type PlanId } from './plans';

export interface AccessAccount {
  name: string;
  email: string;
}

/** Local, non-behavioural event record. Never leaves the device in Phase 2A. */
export interface AccessEvent {
  name:
    | 'plan_viewed'
    | 'preview_started'
    | 'account_created'
    | 'signed_in'
    | 'trial_started'
    | 'purchase_abandoned';
  at: string;
  plan?: PlanId;
}

export interface AccessState {
  /** `null` means signed out — the public routes are the only reachable ones. */
  entitlement: EntitlementState | null;
  account: AccessAccount | null;
  /** The plan highlighted in the plan picker. Annual by default. */
  selectedPlan: PlanId;
  /** A trial purchase is waiting on account creation or sign-in. */
  purchasePending: boolean;
  /** The plan preserved across the account-creation / sign-in detour. */
  pendingPlan: PlanId | null;
  /** Drives the visible disabled / busy state on the confirm button. */
  confirmProcessing: boolean;
  trialEndsAt: string | null;
  events: AccessEvent[];
}

type Action =
  | { type: 'SELECT_PLAN'; plan: PlanId }
  | { type: 'PLAN_VIEWED'; at: string }
  | { type: 'BEGIN_PENDING_PURCHASE'; plan: PlanId }
  | { type: 'ABANDON_PURCHASE'; at: string }
  | { type: 'ENTER_PREVIEW'; at: string }
  | { type: 'CREATE_ACCOUNT'; account: AccessAccount; at: string }
  | { type: 'SIGN_IN'; account: AccessAccount; at: string }
  | { type: 'START_TRIAL'; plan: PlanId; trialEndsAt: string; at: string }
  | { type: 'SET_ENTITLEMENT'; entitlement: EntitlementState }
  | { type: 'SIGN_OUT' };

const INITIAL_STATE: AccessState = {
  entitlement: null,
  account: null,
  selectedPlan: DEFAULT_PLAN_ID,
  purchasePending: false,
  pendingPlan: null,
  confirmProcessing: false,
  trialEndsAt: null,
  events: [],
};

function addDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

/**
 * The one centralized abandon transition (Phase 2A brief §10). Clears the
 * pending plan, the pending-purchase flag and the visible processing state.
 * The synchronous confirm latch is reset alongside it in `abandonPurchase`.
 *
 * NOT used when moving Create Account -> Sign In: that detour must preserve
 * the pending purchase.
 */
function clearPurchase(state: AccessState): AccessState {
  return {
    ...state,
    purchasePending: false,
    pendingPlan: null,
    confirmProcessing: false,
  };
}

function reducer(state: AccessState, action: Action): AccessState {
  switch (action.type) {
    case 'SELECT_PLAN':
      return { ...state, selectedPlan: action.plan };

    case 'PLAN_VIEWED':
      return {
        ...state,
        events: [...state.events, { name: 'plan_viewed', at: action.at }],
      };

    case 'BEGIN_PENDING_PURCHASE':
      return {
        ...state,
        selectedPlan: action.plan,
        pendingPlan: action.plan,
        purchasePending: true,
        confirmProcessing: false,
      };

    case 'ABANDON_PURCHASE':
      if (!state.purchasePending && !state.confirmProcessing) {
        return clearPurchase(state);
      }
      return {
        ...clearPurchase(state),
        events: [
          ...state.events,
          { name: 'purchase_abandoned', at: action.at },
        ],
      };

    case 'ENTER_PREVIEW':
      return {
        ...clearPurchase(state),
        entitlement: 'preview',
        events: [...state.events, { name: 'preview_started', at: action.at }],
      };

    case 'CREATE_ACCOUNT':
      return {
        ...state,
        account: action.account,
        // A new account always starts in preview. A pending purchase upgrades
        // it only after the member confirms on the purchase screen.
        entitlement: 'preview',
        events: [...state.events, { name: 'account_created', at: action.at }],
      };

    case 'SIGN_IN':
      return {
        ...state,
        account: action.account,
        // Mock sign-in loads a blank preview account. A pending purchase is
        // deliberately preserved so the member returns to confirmation.
        entitlement: 'preview',
        events: [...state.events, { name: 'signed_in', at: action.at }],
      };

    case 'START_TRIAL':
      // Idempotent by construction, on top of the synchronous ref latch: a
      // second dispatch cannot add a second event or move the trial-end date.
      if (state.entitlement === 'trialing') return state;
      return {
        ...state,
        entitlement: 'trialing',
        selectedPlan: action.plan,
        pendingPlan: null,
        purchasePending: false,
        confirmProcessing: true,
        trialEndsAt: action.trialEndsAt,
        events: [
          ...state.events,
          { name: 'trial_started', at: action.at, plan: action.plan },
        ],
      };

    case 'SET_ENTITLEMENT':
      return { ...state, entitlement: action.entitlement };

    case 'SIGN_OUT':
      return { ...INITIAL_STATE };

    default:
      return state;
  }
}

export type ConfirmTrialResult =
  /** No account yet: the plan was preserved and Create Account is next. */
  | { status: 'needs-account'; plan: PlanId }
  /** The simulated trial started exactly once. */
  | { status: 'started'; plan: PlanId }
  /** A duplicate activation was swallowed by the synchronous latch. */
  | { status: 'ignored'; plan: PlanId };

export interface AccessContextValue extends AccessState {
  capabilities: Capabilities;
  isSignedIn: boolean;
  selectPlan: (plan: PlanId) => void;
  recordPlanViewed: () => void;
  enterPreview: () => void;
  createAccount: (account: AccessAccount) => void;
  signIn: (account: AccessAccount) => void;
  /**
   * DEVELOPMENT SIMULATION ONLY — not a payment. Production must call Apple
   * StoreKit / Google Play Billing and derive entitlement from the receipt.
   */
  confirmTrial: () => ConfirmTrialResult;
  abandonPurchase: () => void;
  /** Development simulation only: jump to an entitlement state for testing. */
  setEntitlement: (entitlement: EntitlementState) => void;
  signOut: () => void;
}

const AccessContext = createContext<AccessContextValue | null>(null);

/**
 * Capabilities for a signed-out visitor. A signed-out visitor can never write
 * health data, follow affiliate links, or redeem a protected PYPER Perk.
 */
const SIGNED_OUT_CAPABILITIES: Capabilities = {
  canBrowse: false,
  canWriteHealthData: false,
  canUseAffiliateLinks: false,
  canUseProtectedPyperPerks: false,
  isReadOnly: true,
};

export function AccessProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  /**
   * Synchronous idempotency latch. React state updates are asynchronous, so a
   * second tap can arrive before the disabled state renders. This ref blocks
   * it in the same tick. `abandonPurchase` is the only thing that clears it.
   */
  const confirmLockRef = useRef(false);

  /**
   * Mirror of the committed state, readable synchronously inside callbacks.
   * Synced in an effect rather than during render so the React Compiler and
   * the `react-hooks/refs` rule stay satisfied; every reader is an event
   * handler, which runs after the effect has flushed.
   */
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const selectPlan = useCallback((plan: PlanId) => {
    dispatch({ type: 'SELECT_PLAN', plan });
  }, []);

  const recordPlanViewed = useCallback(() => {
    dispatch({ type: 'PLAN_VIEWED', at: new Date().toISOString() });
  }, []);

  const abandonPurchase = useCallback(() => {
    confirmLockRef.current = false;
    dispatch({ type: 'ABANDON_PURCHASE', at: new Date().toISOString() });
  }, []);

  const enterPreview = useCallback(() => {
    confirmLockRef.current = false;
    dispatch({ type: 'ENTER_PREVIEW', at: new Date().toISOString() });
  }, []);

  const createAccount = useCallback((account: AccessAccount) => {
    dispatch({ type: 'CREATE_ACCOUNT', account, at: new Date().toISOString() });
  }, []);

  const signIn = useCallback((account: AccessAccount) => {
    dispatch({ type: 'SIGN_IN', account, at: new Date().toISOString() });
  }, []);

  const confirmTrial = useCallback((): ConfirmTrialResult => {
    const current = stateRef.current;
    const plan = current.selectedPlan;

    // 1. The no-account branch runs BEFORE the latch is set, so a member who
    //    detours through Create Account can return and confirm for real.
    if (!current.account) {
      dispatch({ type: 'BEGIN_PENDING_PURCHASE', plan });
      return { status: 'needs-account', plan };
    }

    // 2. An account exists: a duplicate activation returns immediately.
    if (confirmLockRef.current) return { status: 'ignored', plan };

    // 3. Latch synchronously, before any await or state update.
    confirmLockRef.current = true;

    // 4-9. One event, one entitlement transition, one trial-end date.
    dispatch({
      type: 'START_TRIAL',
      plan,
      trialEndsAt: addDays(TRIAL_DAYS),
      at: new Date().toISOString(),
    });

    return { status: 'started', plan };
  }, []);

  const setEntitlement = useCallback((entitlement: EntitlementState) => {
    dispatch({ type: 'SET_ENTITLEMENT', entitlement });
  }, []);

  const signOut = useCallback(() => {
    confirmLockRef.current = false;
    dispatch({ type: 'SIGN_OUT' });
  }, []);

  const value = useMemo<AccessContextValue>(
    () => ({
      ...state,
      capabilities: state.entitlement
        ? getCapabilities(state.entitlement)
        : SIGNED_OUT_CAPABILITIES,
      isSignedIn: state.entitlement !== null,
      selectPlan,
      recordPlanViewed,
      enterPreview,
      createAccount,
      signIn,
      confirmTrial,
      abandonPurchase,
      setEntitlement,
      signOut,
    }),
    [
      state,
      selectPlan,
      recordPlanViewed,
      enterPreview,
      createAccount,
      signIn,
      confirmTrial,
      abandonPurchase,
      setEntitlement,
      signOut,
    ]
  );

  return (
    <AccessContext.Provider value={value}>{children}</AccessContext.Provider>
  );
}

export function useAccess(): AccessContextValue {
  const value = useContext(AccessContext);
  if (!value) {
    throw new Error('useAccess must be used inside an AccessProvider');
  }
  return value;
}

/** Convenience hook — the only thing screens should gate on. */
export function useCapabilities(): Capabilities {
  return useAccess().capabilities;
}
