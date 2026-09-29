import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata = { title: "Organigram — SPIS Lab" };
export const revalidate = 0;

// Posisi yang dianggap "pemimpin" dan wajib tampil paling atas di
// kelompoknya masing-masing. Cocok dicek dengan substring, tidak peka
// huruf besar/kecil, supaya "Kepala Laboratorium" atau "kepala lab"
// dsb. tetap terdeteksi.
const LEADER_KEYWORDS = {
  dosen: "kepala laboratorium",
  asisten: "koordinator asisten",
};

function sortWithLeaderFirst(list, keyword) {
  return [...list].sort((a, b) => {
    const aLeader = (a.position || "").toLowerCase().includes(keyword);
    const bLeader = (b.position || "").toLowerCase().includes(keyword);
    if (aLeader && !bLeader) return -1;
    if (!aLeader && bLeader) return 1;
    return (a.order_index ?? 0) - (b.order_index ?? 0);
  });
}

function PersonCard({ member }) {
  return (
    <Link href={`/tim/${member.id}`} className="group w-40 text-center">
      <div className="mx-auto aspect-square w-24 overflow-hidden rounded-full border-2 border-spis bg-paper-2">
        {member.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.photo_url}
            alt={member.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-heading text-lg font-bold text-slate-light">
            {member.name?.[0]}
          </div>
        )}
      </div>
      <p className="mt-3 font-display text-sm font-semibold text-ink">
        {member.name}
      </p>
      <p className="font-mono text-[10px] uppercase tracking-wider text-spis">
        {member.position || "—"}
      </p>
    </Link>
  );
}

export default async function OrganigramPage() {
  const supabase = createClient();
  const { data: members } = await supabase
    .from("members")
    .select("*")
    .order("order_index", { ascending: true });

  const dosen = sortWithLeaderFirst(
    (members ?? []).filter((m) => m.category === "dosen"),
    LEADER_KEYWORDS.dosen
  );
  const asisten = sortWithLeaderFirst(
    (members ?? []).filter((m) => m.category === "asisten"),
    LEADER_KEYWORDS.asisten
  );

  const groups = [
    { key: "dosen", label: "Dosen", people: dosen },
    { key: "asisten", label: "Asisten", people: asisten },
  ].filter((g) => g.people.length > 0);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-paper">
          <div className="container-lab py-20 md:py-24">
            <p className="eyebrow mb-4">Organigram</p>
            <h1 className="max-w-2xl font-display text-3xl font-semibold text-spis md:text-5xl">
              Struktur Organisasi Laboratorium
            </h1>
          </div>
        </section>

        <section className="border-t-4 border-line bg-paper py-16 md:py-24">
          <div className="container-lab">
            {groups.length === 0 ? (
              <div className="rounded-lg border border-dashed border-line py-16 text-center">
                <p className="text-sm text-slate-light">
                  Struktur organisasi belum ditambahkan.
                </p>
              </div>
            ) : (
              <div className="space-y-16">
                {groups.map((group, idx) => (
                  <div key={group.key}>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs uppercase tracking-wider text-slate-light">
                        {group.label}
                      </span>
                      <span className="h-px flex-1 bg-line" />
                    </div>
                    <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-10">
                      {group.people.map((member) => (
                        <PersonCard key={member.id} member={member} />
                      ))}
                    </div>
                    {idx < groups.length - 1 && (
                      <div className="mx-auto mt-8 h-8 w-px bg-line" />
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
