import { useState } from "react";
import { PageHeader, Surface } from "./Shell";
import { OFFERS } from "./data";
import { ExternalLink, Lock, Bookmark } from "lucide-react";

const CATEGORIES = [
  "All",
  "Protein",
  "Hydration",
  "Supplements",
  "Pilates",
  "Skin + Body Care",
  "Meal Prep",
  "Travel",
];

export function Edit() {
  const [cat, setCat] = useState("All");
  const filtered = cat === "All" ? OFFERS : OFFERS.filter((o) => o.category === cat);

  return (
    <>
      <PageHeader
        eyebrow="The PYPER Edit"
        title="Curated for the protocol."
        subtitle="Member-only partner offers and curated products that support the PYPER Method. Available exclusively inside the private PYPER Member Portal."
      />

      <Surface className="p-5 mb-6 text-sm bg-[var(--ivory)]">
        PYPER may earn commission, referral fees, sponsorship fees, or other compensation from some
        products and partner offers featured inside The PYPER Edit. Member Partner Offers are
        available exclusively to PYPER members inside the private PYPER Member Portal. These
        recommendations do not replace medical advice, diagnosis, treatment, or clinician guidance.
        Health Context and other member health data are never passed to affiliate or partner links.
      </Surface>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`mono-label whitespace-nowrap px-3 py-1.5 rounded-full border ${
              cat === c
                ? "bg-[var(--graphite)] text-[var(--porcelain)] border-[var(--graphite)]"
                : "border-[var(--border)] hover:bg-[var(--ivory)]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((o) => (
          <Surface key={o.brand + o.title} className="p-5 flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <span className="mono-label">{o.category}</span>
              <span
                className={`mono-label px-2 py-0.5 rounded-full border ${
                  o.type === "Affiliate Link"
                    ? "border-[var(--border)] text-[var(--steel)]"
                    : "border-[var(--med-blue)] text-[var(--med-blue)]"
                }`}
              >
                {o.type === "Portal Exclusive" && <Lock size={10} className="inline -mt-0.5 mr-1" />}
                {o.type}
              </span>
            </div>
            <div className="text-xs text-[var(--steel)] mb-1">{o.brand}</div>
            <h4 className="mb-2" style={{ fontFamily: "var(--font-serif)" }}>
              {o.title}
            </h4>
            <p className="text-sm mb-3">{o.reason}</p>
            <div className="text-sm bg-[var(--porcelain)] border border-[var(--border)] rounded-md px-3 py-2 mb-3">
              {o.benefit}
            </div>
            <div className="mono-label mb-4">{o.disclosure}</div>

            <div className="mt-auto flex gap-2">
              <a
                href="#"
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[var(--graphite)] text-[var(--porcelain)] px-3 py-2 rounded-md text-sm"
              >
                Open <ExternalLink size={12} />
              </a>
              <button className="w-10 h-10 inline-flex items-center justify-center border border-[var(--border)] rounded-md hover:bg-[var(--ivory)]">
                <Bookmark size={14} />
              </button>
            </div>
          </Surface>
        ))}
      </div>
    </>
  );
}
