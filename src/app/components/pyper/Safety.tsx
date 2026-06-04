import { PageHeader, Surface } from "./Shell";
import { SAFETY_ITEMS } from "./data";
import { ShieldAlert, PhoneCall } from "lucide-react";

export function Safety() {
  return (
    <>
      <PageHeader
        eyebrow="Safety"
        title="Boundaries that protect the protocol."
        subtitle="This portal does not provide diagnosis, treatment, dose recommendations, or emergency care. It supports your work with your clinician."
      />

      <Surface className="p-6 mb-6 border-l-4 border-l-[#8a2a2a] bg-[#fdf4f4]">
        <div className="flex items-start gap-3">
          <ShieldAlert size={20} className="text-[#8a2a2a] mt-0.5 shrink-0" />
          <div>
            <h3 className="mb-1" style={{ color: "#8a2a2a" }}>
              In an emergency
            </h3>
            <p className="text-sm">
              If you are experiencing a medical or mental health emergency, call your local
              emergency number or go to the nearest emergency department. Do not rely on this
              portal for urgent medical decisions.
            </p>
          </div>
        </div>
      </Surface>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {SAFETY_ITEMS.map((s) => (
          <Surface key={s.title} className="p-6">
            <div className="mono-label mb-2">Boundary</div>
            <h3 className="mb-2">{s.title}</h3>
            <p className="text-sm">{s.body}</p>
          </Surface>
        ))}
      </div>

      <Surface className="p-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <PhoneCall size={18} className="text-[var(--steel)]" />
          <div>
            <div className="text-sm">Contact your prescribing clinician</div>
            <div className="mono-label">For dose, medication, and symptom decisions</div>
          </div>
        </div>
        <button className="border border-[var(--graphite)] px-4 py-2 rounded-md text-sm hover:bg-[var(--graphite)] hover:text-[var(--porcelain)]">
          Open clinician details
        </button>
      </Surface>
    </>
  );
}
