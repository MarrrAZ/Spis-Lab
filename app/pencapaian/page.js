import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata = { title: "Achievement — SPIS Lab" };
export const revalidate = 0;

export default async function PencapaianPage() {
  const supabase = createClient();
  const { data: achievements } = await supabase
    .from("achievements")
    .select("*")
    .order("year", { ascending: false });

  const publikasi = achievements?.filter((a) => a.type === "publikasi") ?? [];
  const pendanaan = achievements?.filter((a) => a.type === "pendanaan") ?? [];

  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-spis-deep text-white">
          <div className="container-lab py-20 md:py-24">
            <p className="eyebrow-light mb-4">Achievement</p>
            <h1 className="max-w-2xl font-display text-3xl font-semibold md:text-5xl">
              Publikasi &amp; Pendanaan Riset
            </h1>
          </div>
        </section>

        <section className="border-t-4 border-spis bg-spis-bright py-16 md:py-20">
          <div className="container-lab">
            <p className="eyebrow-light mb-6">Publikasi ({publikasi.length})</p>
            {publikasi.length === 0 ? (
              <EmptyState text="Belum ada publikasi yang ditambahkan." />
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {publikasi.map((item) => (
                  <div key={item.id} className="rounded-lg border border-spis bg-white p-6">
                    <span className="font-mono text-xs uppercase tracking-wider text-spis-bright">
                      {item.year ?? "—"}
                    </span>
                    <p className="mt-2 font-display text-base font-semibold text-ink">
                      {item.title}
                    </p>
                    {item.authors && (
                      <p className="mt-1 text-sm text-slate">{item.authors}</p>
                    )}
                    {item.venue && (
                      <p className="mt-0.5 text-sm italic text-slate-light">
                        {item.venue}
                      </p>
                    )}
                    {item.description && (
                      <p className="mt-2 text-sm leading-relaxed text-slate">
                        {item.description}
                      </p>
                    )}
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block font-mono text-xs uppercase tracking-wider text-spis-bright underline underline-offset-4"
                      >
                        Tautan →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="border-t-4 border-spis bg-spis-bright py-16 md:py-20">
          <div className="container-lab">
            <p className="eyebrow-light mb-6">Pendanaan Riset ({pendanaan.length})</p>
            {pendanaan.length === 0 ? (
              <EmptyState text="Belum ada data pendanaan riset yang ditambahkan." />
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {pendanaan.map((item) => (
                  <div key={item.id} className="rounded-lg border border-spis bg-white p-6">
                    <span className="font-mono text-xs uppercase tracking-wider text-spis-bright">
                      {item.year ?? ""}
                    </span>
                    <p className="mt-2 font-display text-base font-semibold text-ink">
                      {item.title}
                    </p>
                    {item.venue && (
                      <p className="mt-1 text-sm text-slate">Sumber: {item.venue}</p>
                    )}
                    {item.description && (
                      <p className="mt-2 text-sm leading-relaxed text-slate">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-lg border border-dashed border-white/30 py-16 text-center">
      <p className="text-sm text-white/70">{text}</p>
    </div>
  );
}
