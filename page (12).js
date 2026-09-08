import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WaveformBars } from "@/components/waveform";

export const metadata = { title: "Team — SPIS Lab" };
export const revalidate = 0;

export default async function TimPage() {
  const supabase = createClient();
  const { data: members } = await supabase
    .from("members")
    .select("*")
    .order("order_index", { ascending: true });

  const dosen = members?.filter((m) => m.category === "dosen") ?? [];
  const asisten = members?.filter((m) => m.category === "asisten") ?? [];

  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-white">
          <div className="container-lab py-20 md:py-24">
            <p className="eyebrow mb-4">Team</p>
            <h1 className="max-w-2xl font-display text-3xl font-semibold text-spis md:text-5xl">
              Dosen &amp; Asisten Laboratorium
            </h1>
          </div>
        </section>

        <section className="border-t-4 border-spis bg-white py-16 md:py-20">
          <div className="container-lab">
            <p className="eyebrow mb-8">Dosen Pembina</p>
            {dosen.length === 0 ? (
              <EmptyState text="Profil dosen belum ditambahkan." />
            ) : (
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                {dosen.map((m) => (
                  <MemberCard key={m.id} member={m} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="border-t-4 border-spis bg-white py-16 md:py-20">
          <div className="container-lab">
            <p className="eyebrow mb-8">Asisten Laboratorium</p>
            {asisten.length === 0 ? (
              <EmptyState text="Profil asisten belum ditambahkan." />
            ) : (
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                {asisten.map((m) => (
                  <MemberCard key={m.id} member={m} />
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

function MemberCard({ member }) {
  return (
    <Link href={`/tim/${member.id}`} className="group block">
      <div className="aspect-[3/4] w-full overflow-hidden rounded-lg border border-spis bg-paper-2">
        {member.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.photo_url}
            alt={member.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <WaveformBars className="h-8 w-16" />
          </div>
        )}
      </div>
      <p className="mt-3 font-display text-sm font-semibold text-ink">
        {member.name}
      </p>
      {member.position && (
        <p className="font-mono text-[11px] uppercase tracking-wider text-spis">
          {member.position}
        </p>
      )}
      {member.bio && (
        <p className="mt-2 text-xs leading-relaxed text-slate">{member.bio}</p>
      )}
    </Link>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-lg border border-dashed border-line py-16 text-center">
      <p className="text-sm text-slate">{text}</p>
    </div>
  );
}
