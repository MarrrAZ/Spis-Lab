import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata = { title: "Achievement — SPIS Lab" };
export const revalidate = 0;

const PAGE_SIZE = 12;

export default async function PencapaianPage({ searchParams }) {
  const supabase = createClient();

  const pubPage = Math.max(1, Number(searchParams?.pub_page) || 1);
  const fundPage = Math.max(1, Number(searchParams?.fund_page) || 1);

  const pubFrom = (pubPage - 1) * PAGE_SIZE;
  const fundFrom = (fundPage - 1) * PAGE_SIZE;

  const [{ data: publikasi, count: pubCount }, { data: pendanaan, count: fundCount }] =
    await Promise.all([
      supabase
        .from("achievements")
        .select("*", { count: "exact" })
        .eq("type", "publikasi")
        .order("year", { ascending: false })
        .range(pubFrom, pubFrom + PAGE_SIZE - 1),
      supabase
        .from("achievements")
        .select("*", { count: "exact" })
        .eq("type", "pendanaan")
        .order("year", { ascending: false })
        .range(fundFrom, fundFrom + PAGE_SIZE - 1),
    ]);

  const pubTotalPages = Math.max(1, Math.ceil((pubCount ?? 0) / PAGE_SIZE));
  const fundTotalPages = Math.max(1, Math.ceil((fundCount ?? 0) / PAGE_SIZE));

  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-paper">
          <div className="container-lab py-20 md:py-24">
            <p className="eyebrow mb-4">Achievement</p>
            <h1 className="max-w-2xl font-display text-3xl font-semibold text-spis md:text-5xl">
              Publikasi &amp; Pendanaan Riset
            </h1>
          </div>
        </section>

        <section className="border-t-4 border-line bg-paper py-16 md:py-20">
          <div className="container-lab">
            <p className="eyebrow mb-6">Publikasi ({pubCount ?? 0})</p>
            {!publikasi || publikasi.length === 0 ? (
              <EmptyState text="Belum ada publikasi yang ditambahkan." />
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2">
                  {publikasi.map((item) => (
                    <AchievementCard key={item.id} item={item} kind="publikasi" />
                  ))}
                </div>
                <Pager
                  page={pubPage}
                  totalPages={pubTotalPages}
                  paramName="pub_page"
                  otherParams={{ fund_page: fundPage }}
                />
              </>
            )}
          </div>
        </section>

        <section className="border-t-4 border-line bg-paper py-16 md:py-20">
          <div className="container-lab">
            <p className="eyebrow mb-6">Pendanaan Riset ({fundCount ?? 0})</p>
            {!pendanaan || pendanaan.length === 0 ? (
              <EmptyState text="Belum ada data pendanaan riset yang ditambahkan." />
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2">
                  {pendanaan.map((item) => (
                    <AchievementCard key={item.id} item={item} kind="pendanaan" />
                  ))}
                </div>
                <Pager
                  page={fundPage}
                  totalPages={fundTotalPages}
                  paramName="fund_page"
                  otherParams={{ pub_page: pubPage }}
                />
              </>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function AchievementCard({ item, kind }) {
  return (
    <div className="rounded-lg border border-spis bg-white p-6">
      <span className="font-mono text-xs uppercase tracking-wider text-spis-bright">
        {item.year ?? "—"}
      </span>
      <p className="mt-2 font-display text-base font-semibold text-ink">
        {item.title}
      </p>
      {kind === "publikasi" && item.authors && (
        <p className="mt-1 text-sm text-slate">{item.authors}</p>
      )}
      {item.venue && (
        <p className="mt-0.5 text-sm italic text-slate-light">
          {kind === "pendanaan" ? `Sumber: ${item.venue}` : item.venue}
        </p>
      )}
      {item.description && (
        <p className="mt-2 text-sm leading-relaxed text-slate">
          {item.description}
        </p>
      )}
      {kind === "publikasi" && item.link && (
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
  );
}

function Pager({ page, totalPages, paramName, otherParams }) {
  if (totalPages <= 1) return null;

  const buildHref = (p) => {
    const params = new URLSearchParams();
    Object.entries(otherParams).forEach(([k, v]) => params.set(k, String(v)));
    params.set(paramName, String(p));
    return `?${params.toString()}#${paramName}`;
  };

  return (
    <div
      id={paramName}
      className="mt-6 flex items-center justify-between font-mono text-xs uppercase tracking-wider text-slate-light"
    >
      <span>Halaman {page} dari {totalPages}</span>
      <div className="flex gap-4">
        <a
          href={page > 1 ? buildHref(page - 1) : undefined}
          aria-disabled={page <= 1}
          className={page <= 1 ? "pointer-events-none opacity-30" : "text-spis hover:underline"}
        >
          ← Sebelumnya
        </a>
        <a
          href={page < totalPages ? buildHref(page + 1) : undefined}
          aria-disabled={page >= totalPages}
          className={page >= totalPages ? "pointer-events-none opacity-30" : "text-spis hover:underline"}
        >
          Berikutnya →
        </a>
      </div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-lg border border-dashed border-line py-16 text-center">
      <p className="text-sm text-slate-light">{text}</p>
    </div>
  );
}
