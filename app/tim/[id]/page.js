import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const revalidate = 0;

export default async function MemberDetailPage({ params }) {
  const supabase = createClient();

  const { data: member } = await supabase
    .from("members")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!member) notFound();

  const { data: achievements } = await supabase
    .from("achievements")
    .select("*")
    .order("year", { ascending: false });

  return (
    <>
      <SiteHeader />
      <main>
        <section className="border-b border-spis bg-white">
          <div className="container-lab py-14">
            <Link href="/tim" className="font-mono text-xs uppercase tracking-wider text-slate hover:text-spis">
              ← Kembali ke Tim
            </Link>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="container-lab grid gap-10 md:grid-cols-[320px_1fr]">
            <div>
              <div className="aspect-[4/5] w-full overflow-hidden rounded-lg bg-paper-2">
                {member.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={member.photo_url} alt={member.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-display text-5xl font-bold text-spis-soft">
                    {member.name?.[0]}
                  </div>
                )}
              </div>
              <h1 className="mt-5 font-display text-2xl font-bold text-ink">{member.name}</h1>
              <p className="mt-1 font-mono text-xs uppercase tracking-wider text-spis-bright">
                {member.position || member.category}
              </p>
              {(member.angkatan || member.jurusan) && (
                <p className="mt-2 text-sm text-slate">
                  {[member.angkatan, member.jurusan].filter(Boolean).join(" · ")}
                </p>
              )}
              {member.email && (
                <p className="mt-2 text-sm text-slate-light">{member.email}</p>
              )}
            </div>

            <div>
              {member.bio && (
                <>
                  <p className="eyebrow mb-3">Tentang</p>
                  <p className="max-w-2xl whitespace-pre-line text-sm leading-relaxed text-slate md:text-base">
                    {member.bio}
                  </p>
                </>
              )}

              <p className="eyebrow mb-3 mt-10">Pencapaian di SPIS Lab</p>
              {achievements && achievements.length > 0 ? (
                <div className="space-y-4">
                  {achievements.slice(0, 6).map((a) => (
                    <div key={a.id} className="card-lab p-5">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-spis-bright">
                        {a.type === "publikasi" ? "Publikasi" : "Pendanaan Riset"}
                        {a.year ? ` · ${a.year}` : ""}
                      </span>
                      <h3 className="mt-2 font-heading text-sm font-semibold text-ink">{a.title}</h3>
                      {a.venue && <p className="mt-1 text-xs text-slate-light">{a.venue}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-light">Belum ada catatan pencapaian.</p>
              )}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
