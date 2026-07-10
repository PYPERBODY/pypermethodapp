import { useState } from "react";
import { PageHeader, Surface } from "./Shell";
import { CHAPTERS, PILLARS } from "./data";
import { HealthContextChapter } from "./HealthContextChapter";
import { HealthContextPanel } from "./HealthContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Bookmark, CheckCircle2, Lock, MessageSquarePlus } from "lucide-react";

export function Method() {
  const [openChapter, setOpenChapter] = useState<string | null>(null);

  if (openChapter === "health-context-profile") {
    return (
      <HealthContextPanel
        embedded
        onBack={() => setOpenChapter("health-context")}
      />
    );
  }

  if (openChapter === "health-context") {
    return (
      <HealthContextChapter
        onBack={() => setOpenChapter(null)}
        onOpenProfile={() => setOpenChapter("health-context-profile")}
      />
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="The PYPER Method"
        title="Foundation, framework, refinement."
        subtitle="Education designed for the medication window. Read at your pace — save sections, mark chapters complete, and add questions for your clinician."
      />

      {/* Featured chapter: Seven Pillars */}
      <Surface className="p-6 lg:p-8 mb-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div>
            <div className="mono-label mb-2">Chapter 04 · Foundation</div>
            <h2>Seven PYPER Pillars</h2>
          </div>
          <div className="flex gap-2 flex-wrap">
            <ChapterAction icon={<Bookmark size={14} />} label="Save section" />
            <ChapterAction icon={<MessageSquarePlus size={14} />} label="Add to provider questions" />
            <ChapterAction icon={<CheckCircle2 size={14} />} label="Mark complete" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PILLARS.map((p) => (
            <div
              key={p.n}
              className="border border-[var(--border)] bg-[var(--porcelain)] rounded-md p-5"
            >
              <div className="mono-label mb-3">Pillar {p.n}</div>
              <h4 className="mb-2">{p.title}</h4>
              <p className="text-sm">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="rule my-6" />

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="window">
            <AccordionTrigger className="text-left">
              <span style={{ fontFamily: "var(--font-serif)" }} className="text-base">
                The medication window — why timing matters
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm">
                The medication window is the period in which your prescribed GLP-1 exerts its
                strongest appetite, satiety, and metabolic effects. PYPER protocols protect protein
                intake, hydration, and tolerance during this window so the result is composition
                change — not deconditioning.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="phases">
            <AccordionTrigger>
              <span style={{ fontFamily: "var(--font-serif)" }} className="text-base">
                Three-phase standard — Starting, Transformation, Lifestyle
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm">
                Starting establishes safety and tolerance. Active Transformation prioritizes lean
                mass, hydration, and skin integrity. Lifestyle Phase translates discipline into
                long-term identity. Maintenance is where the brand of the work shows.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="related">
            <AccordionTrigger>
              <span style={{ fontFamily: "var(--font-serif)" }} className="text-base">
                Related trackers & reminders
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2 text-xs">
                {["Tolerance Tracker", "Protein + Hydration", "Medication Rhythm", "Body-Care Routine"].map(
                  (t) => (
                    <span
                      key={t}
                      className="px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--porcelain)]"
                    >
                      {t}
                    </span>
                  )
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Surface>

      {/* Featured: Health Context chapter */}
      <Surface className="p-6 mb-10 border-l-4 border-l-[var(--med-blue)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="mono-label mb-2 inline-flex items-center gap-2">
              <Lock size={12} /> Chapter 08 · After Body Composition
            </div>
            <h2 className="mb-2">Health, Hormonal & Metabolic Context</h2>
            <p className="text-sm max-w-xl">
              Private chapter plus interactive Health Context onboarding — module selection, body
              metrics with neutral BMI screening, and conditional health modules. No diagnosis
              logic.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setOpenChapter("health-context")}
              className="self-start inline-flex items-center gap-2 border border-[var(--border)] px-5 py-3 rounded-md text-sm hover:bg-[var(--ivory)]"
            >
              Read chapter
            </button>
            <button
              type="button"
              onClick={() => setOpenChapter("health-context-profile")}
              className="self-start inline-flex items-center gap-2 bg-[var(--graphite)] text-[var(--porcelain)] px-5 py-3 rounded-md text-sm"
            >
              Open Health Context
            </button>
          </div>
        </div>
      </Surface>

      {/* Chapter list — order from CHAPTERS (health-context after composition) */}
      <div className="mono-label mb-3">All chapters</div>
      <Surface className="divide-y divide-[var(--border)] overflow-hidden">
        {CHAPTERS.map((c, i) => {
          const isHealth = c.id === "health-context";
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                if (isHealth) setOpenChapter("health-context");
              }}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-[var(--ivory)] transition-colors text-left"
            >
              <div className="flex items-center gap-5 min-w-0">
                <span className="mono-label w-10 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <div
                    className="truncate flex items-center gap-2"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {isHealth && <Lock size={14} className="text-[var(--steel)] shrink-0" />}
                    {c.title}
                  </div>
                  <div className="mono-label mt-0.5">
                    {c.tag} · {c.time}
                  </div>
                </div>
              </div>
              <span className="text-[var(--steel)] hidden sm:inline">→</span>
            </button>
          );
        })}
      </Surface>
    </>
  );
}

function ChapterAction({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border border-[var(--border)] rounded-md hover:bg-[var(--ivory)]"
    >
      {icon} {label}
    </button>
  );
}
