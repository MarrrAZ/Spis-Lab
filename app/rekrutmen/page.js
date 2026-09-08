import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata = { title: "Recruitment — SPIS Lab" };
export const revalidate = 0;

export default async function RekrutmenPage() {
  const supabase = createClient();
  const { data: recruitment } = await supabase
    .from("recruitment")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-paper">
          <div className="container-lab py-20 md:py-24">
            <p className="eyebrow mb-4">Recruitment</p>
            <h1 className="max-w-2xl font-display text-3xl font-semibold md:text-5xl">
              Informasi Open Recruitment Asisten Lab
            </h1>
            <p className="mt-4 max-w-xl text-slate">
              Kesempatan bagi mahasiswa untuk terlibat langsung dalam riset
              dan aktivitas laboratorium SPIS.
            </p>
          </div>
        </section>

        <section className="border-t-4 border-spis bg-paper py-16 md:py-20">
          <div className="container-lab">
            {!recruitment || recruitment.length === 0 ? (
              <div className="rounded-lg border border-dashed border-line py-16 text-center">
                <p className="text-sm text-slate-light">
                  Belum ada informasi rekrutmen. Nantikan pengumuman
                  selanjutnya.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {recruitment.map((item) => (
                  <article
                    key={item.id}
                    className={`rounded-lg border border-spis bg-white p-8 ${
                      !item.is_open ? "opacity-70" : ""
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span
                        className={`font-mono text-xs uppercase tracking-wider px-3 py-1 ${
                          item.is_open
                            ? "bg-spis-bright text-white"
                            : "bg-paper-2 text-slate-light"
                        }`}
                      >
                        {item.is_open ? "Dibuka" : "Ditutup"}
                      </span>
                      {item.deadline && (
                        <span className="font-mono text-xs text-slate-light">
                          Batas: {new Date(item.deadline).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>

                    <h2 className="mt-4 font-display text-xl font-semibold text-ink">
                      {item.title}
                    </h2>

                    {item.description && (
                      <p className="mt-3 text-sm leading-relaxed text-slate">
                        {item.description}
                      </p>
                    )}

                    {item.requirements && (
                      <div className="mt-4">
                        <p className="font-mono text-xs uppercase tracking-wider text-spis-bright">
                          Persyaratan
                        </p>
                        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate">
                          {item.requirements}
                        </p>
                      </div>
                    )}

                    {item.link && item.is_open && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-block bg-spis-bright px-6 py-3 font-mono text-xs uppercase tracking-wider text-white transition-colors hover:bg-spis"
                      >
                        Daftar Sekarang →
                      </a>
                    )}
                  </article>
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
