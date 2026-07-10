import { PageHeader, Surface } from "./Shell";
import {
  HEALTH_CONTEXT_INTRO,
  HEALTH_CONTEXT_SCOPE,
  HEALTH_CONTEXT_SECTIONS,
} from "./healthContextGuideContent";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { ArrowLeft, Lock } from "lucide-react";

/**
 * Phase 1 readable chapter + Phase 2 entry to interactive Health Context profile.
 */
export function HealthContextChapter({
  onBack,
  onOpenProfile,
}: {
  onBack: () => void;
  onOpenProfile: () => void;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--steel)] hover:text-[var(--graphite)]"
      >
        <ArrowLeft size={16} /> Back to Method chapters
      </button>

      <PageHeader
        eyebrow="Chapter 08 · Private profile"
        title="Health, Hormonal & Metabolic Context"
        subtitle="A private educational chapter for health, hormonal, reproductive, endocrine, and metabolic context — with optional interactive Health Context recording."
      />

      <Surface className="p-5 mb-6 flex items-start gap-3 bg-[var(--ivory)]">
        <Lock size={16} className="mt-0.5 shrink-0 text-[var(--steel)]" />
        <div className="text-sm space-y-2">
          {HEALTH_CONTEXT_SCOPE.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </Surface>

      <Surface className="p-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="mono-label mb-2">Phase 2 · Interactive profile</div>
          <h3 className="mb-2">Open Health Context</h3>
          <p className="text-sm max-w-xl text-[var(--soft-text)]">
            Choose health modules, record body metrics with neutral BMI screening, and complete
            only the conditional sections that apply. Prototype state only — production requires
            secure storage.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenProfile}
          className="self-start inline-flex items-center gap-2 bg-[var(--graphite)] text-[var(--porcelain)] px-5 py-3 rounded-md text-sm"
        >
          Open Health Context
        </button>
      </Surface>

      <Surface className="p-6 lg:p-8 mb-8">
        <div className="mono-label mb-2">Introduction</div>
        <h2 className="mb-4">{HEALTH_CONTEXT_INTRO.title}</h2>
        <div className="space-y-3 max-w-2xl">
          {HEALTH_CONTEXT_INTRO.paragraphs.map((p) => (
            <p key={p} className="text-sm">
              {p}
            </p>
          ))}
        </div>
      </Surface>

      <div className="mono-label mb-3">Chapter sections</div>
      <Surface className="p-2 sm:p-4">
        <Accordion type="multiple" className="w-full">
          {HEALTH_CONTEXT_SECTIONS.map((section) => (
            <AccordionItem key={section.id} value={section.id}>
              <AccordionTrigger className="text-left px-3">
                <span style={{ fontFamily: "var(--font-serif)" }} className="text-base">
                  {section.title}
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-3">
                <div className="space-y-3 pb-2">
                  {section.paragraphs.map((p) => (
                    <p key={p} className="text-sm">
                      {p}
                    </p>
                  ))}
                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="text-sm space-y-1.5 text-[var(--soft-text)] list-disc pl-5">
                      {section.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  )}
                  {section.note && (
                    <p className="text-sm border-l-2 border-[var(--med-blue)] pl-3 text-[var(--soft-text)]">
                      {section.note}
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Surface>
    </>
  );
}
