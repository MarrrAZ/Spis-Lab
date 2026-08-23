import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WaveformBars } from "@/components/waveform";

export const metadata = { title: "Organigram — SPIS Lab" };
export const revalidate = 0;

const LEVEL_LABELS = { "1": "Dosen", "2": "Asisten" };

export default async function OrganigramPage() {
  const supabase = createClient();
  const { data: entries } = await supabase
    .from("organigram")
    .select("*, members(*)")
    .order("level", { ascending: true })
    .order("order_index", { ascending: true });

  const levels = {};
  (entries ?? []).forEach((e) => {
    levels[e.level] = levels[e.level] || [];
    levels[e.level].push(e);
  });
  const levelKeys = Object.keys(levels).sort((a, b) => Number(a) - Number(b));

  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-spis-deep text-white">
          <div className="container-lab py-20 md:py-24">
            <p className="eyebrow-light mb-4">Organigram</p>
            <h1 className="max-w-2xl font-display text-3xl font-semibold md:text-5xl">
              Struktur Organisasi Laboratorium
            </h1>
          </div>
        </section>

        <section className="border-t-4 border-spis bg-spis-bright py-16 md:py-24">
          <div className="container-lab">
            {levelKeys.length === 0 ? (
              <div className="rounded-lg border border-dashed border-white/30 py-16 text-center">
                <p className="text-sm text-white/70">
                  Struktur organisasi belum ditambahkan.
                </p>
              </div>
            ) : (
              <div className="space-y-16">
                {levelKeys.map((level, idx) => (
                  <div key={level}>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs uppercase tracking-wider text-white/70">
                        {LEVEL_LABELS[level] ?? `Tingkat ${level}`}
                      </span>
                      <span className="h-px flex-1 bg-white/20" />
                    </div>
                    <div className="mt-6 flex flex-wrap justify-center gap-8">
                      {levels[level].map((entry) => (
                        <div key={entry.id} className="w-40 text-center">
                          <div className="mx-auto aspect-square w-24 overflow-hidden rounded-full border-2 border-spis bg-white">
                            {entry.members?.photo_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={entry.members.photo_url}
                                alt={entry.members?.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <WaveformBars className="h-6 w-10" />
                              </div>
                            )}
                          </div>
                          <p className="mt-3 font-display text-sm font-semibold text-white">
                            {entry.members?.name ?? "—"}
                          </p>
                          <p className="font-mono text-[10px] uppercase tracking-wider text-spis">
                            {entry.position_label}
                          </p>
                        </div>
                      ))}
                    </div>
                    {idx < levelKeys.length - 1 && (
                      <div className="mx-auto mt-8 h-8 w-px bg-white/20" />
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
