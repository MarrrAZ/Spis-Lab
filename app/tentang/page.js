import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WaveformBars } from "@/components/waveform";

export const metadata = { title: "About — SPIS Lab" };
export const revalidate = 0;

export default async function TentangPage() {
  const supabase = createClient();
  const { data: content } = await supabase
    .from("about_content")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  const intro = [content?.intro_1, content?.intro_2, content?.intro_3].filter(Boolean);
  const nilai = [1, 2, 3]
    .map((n) => ({
      label: content?.[`nilai_${n}_label`],
      desc: content?.[`nilai_${n}_desc`],
    }))
    .filter((n) => n.label || n.desc);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-paper">
          <div className="container-lab py-20 md:py-28">
            <p className="eyebrow mb-4">About</p>
            <h1 className="max-w-2xl font-display text-3xl font-semibold leading-tight text-spis md:text-5xl">
              Apa itu SPIS Laboratory?
            </h1>
          </div>
        </section>

        <section className="border-t-4 border-line bg-paper">
          <div className="container-lab grid gap-12 py-20 md:grid-cols-[1.3fr_1fr] md:py-28">
            <div className="space-y-6 text-slate">
              {intro.length > 0 ? (
                intro.map((p, i) => (
                  <p
                    key={i}
                    className={i === 0 ? "text-lg leading-relaxed text-ink" : "leading-relaxed"}
                  >
                    {p}
                  </p>
                ))
              ) : (
                <p className="text-sm text-slate-light">
                  Konten halaman ini akan tampil di sini setelah diisi lewat dashboard admin.
                </p>
              )}
            </div>

            {nilai.length > 0 && (
              <div className="rounded-lg border border-spis bg-white p-8">
                <p className="eyebrow mb-4">Nilai Laboratorium</p>
                <div className="space-y-6">
                  {nilai.map((n) => (
                    <div key={n.label} className="border-t border-line pt-4 first:border-0 first:pt-0">
                      <p className="font-display text-sm font-semibold text-ink">{n.label}</p>
                      <p className="mt-1 text-sm leading-relaxed text-slate">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {(content?.naungan_title || content?.naungan_text) && (
          <section className="border-t-4 border-line bg-paper py-16">
            <div className="container-lab flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div>
                <p className="eyebrow mb-3">Naungan</p>
                {content?.naungan_title && (
                  <p className="font-display text-lg font-semibold text-ink">
                    {content.naungan_title}
                  </p>
                )}
                {content?.naungan_text && (
                  <p className="mt-1 max-w-md text-sm text-slate">{content.naungan_text}</p>
                )}
              </div>
              <WaveformBars className="h-14 w-48" />
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
