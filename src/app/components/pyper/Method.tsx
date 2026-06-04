import { PageHeader, Surface } from "./Shell";
import { CHAPTERS, PILLARS } from "./data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Bookmark, CheckCircle2, MessageSquarePlus } from "lucide-react";

export function Method() {
  return (
    <>
      <PageHeader
        eyebrow="The PYPER Method"
        title="Foundation, framework, refinement."
        subtitle="The primary installable PWA and responsive digital replacement for the static PYPER Method GLP-1 guide. Read at your pace — save sections, mark chapters complete, and keep the Guide at the center."
      />

      <Surface className="p-5 mb-8 grid gap-4 md:grid-cols-[1.2fr_1fr] md:items-center">
        <div>
          <div className="mono-label mb-2">Approved delivery system</div>
          <h3 className="mb-2">Interactive Guide + installable PWA</h3>
          <p className="text-sm text-[var(--soft-text)]">
            The Guide is the primary responsive experience for web, mobile phones, tablets,
            and desktop. Companion Goodnotes and Printable PDF editions should be generated
            from the same approved PYPER Method content source.
          </p>
        </div>
        <div className="grid gap-2 text-sm">
          <div className="border border-[var(--border)] rounded-md p-3">Primary: The PYPER Method Interactive Guide + PWA</div>
          <div className="border border-[var(--border)] rounded-md p-3">Companion: The PYPER Method Goodnotes Edition</div>
          <div className="border border-[var(--border)] rounded-md p-3">Companion: The PYPER Method Printable PDF Edition</div>
        </div>
      </Surface>

      {/* Featured chapter: Seven Pillars */}
      <Surface className="p-6 lg:p-8 mb-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div>
            <div className="mono-label mb-2">Chapter 04 · Foundation</div>
            <h2>Seven PYPER Pillars</h2>
          </div>
          <div className="flex gap-2">
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
                {["Tolerance Tracker", "Protein + Hydration", "Medication Rhythm", "PYPER Body-Care Plan"].map(
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

      {/* Chapter list */}
      <div className="mono-label mb-3">All chapters</div>
      <Surface className="divide-y divide-[var(--border)] overflow-hidden">
        {CHAPTERS.map((c, i) => (
          <div
            key={c.id}
            className="flex items-center justify-between px-5 py-4 hover:bg-[var(--ivory)] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-5 min-w-0">
              <span className="mono-label w-10 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <div className="truncate" style={{ fontFamily: "var(--font-serif)" }}>
                  {c.title}
                </div>
                <div className="mono-label mt-0.5">{c.tag} · {c.time}</div>
              </div>
            </div>
            <span className="text-[var(--steel)] hidden sm:inline">→</span>
          </div>
        ))}
      </Surface>
    </>
  );
}

function ChapterAction({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border border-[var(--border)] rounded-md hover:bg-[var(--ivory)]">
      {icon} {label}
    </button>
  );
}
