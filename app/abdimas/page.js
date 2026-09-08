import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata = { title: "Abdimas — SPIS Lab" };
export const revalidate = 0;

export default async function AbdimasPage() {
  const supabase = createClient();
  const { data: abdimas } = await supabase
    .from("abdimas")
    .select("*")
    .order("activity_date", { ascending: false });

  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-white">
          <div className="container-lab py-20 md:py-24">
            <p className="eyebrow mb-4">Abdimas</p>
            <h1 className="max-w-2xl font-display text-3xl font-semibold text-spis md:text-5xl">
              Pengabdian Kepada Masyarakat
            </h1>
            <p className="mt-4 max-w-xl text-slate">
              Penerapan hasil riset SPIS Lab untuk memberi manfaat langsung
              bagi masyarakat.
            </p>
          </div>
        </section>

        <section className="border-t-4 border-spis bg-white py-16 md:py-20">
          <div className="container-lab">
            {!abdimas || abdimas.length === 0 ? (
              <div className="rounded-lg border border-dashed border-line py-16 text-center">
                <p className="text-sm text-slate">
                  Belum ada kegiatan abdimas yang ditambahkan.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {abdimas.map((item) => (
                  <article key={item.id} className="rounded-lg border border-spis bg-white p-7">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs uppercase tracking-wider text-spis-bright">
                        {item.activity_date
                          ? new Date(item.activity_date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : ""}
                      </span>
                    </div>
                    <h2 className="mt-3 font-display text-lg font-semibold text-ink">
                      {item.title}
                    </h2>
                    {item.location && (
                      <p className="mt-1 text-sm text-slate">📍 {item.location}</p>
                    )}
                    {item.description && (
                      <p className="mt-3 text-sm leading-relaxed text-slate">
                        {item.description}
                      </p>
                    )}
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block font-mono text-xs uppercase tracking-wider text-spis-bright underline underline-offset-4"
                      >
                        Selengkapnya →
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
