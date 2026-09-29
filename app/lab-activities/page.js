import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata = { title: "Lab Activities — SPIS Lab" };
export const revalidate = 0;

function PhotoCard({ item }) {
  return (
    <div className="overflow-hidden rounded-lg border border-spis bg-white">
      <div className="aspect-square w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.photo_url} alt={item.title || ""} className="h-full w-full object-cover" />
      </div>
      {(item.title || item.description) && (
        <div className="p-4">
          {item.title && (
            <p className="font-display text-sm font-semibold text-ink">{item.title}</p>
          )}
          {item.description && (
            <p className="mt-1 text-sm leading-relaxed text-slate">{item.description}</p>
          )}
        </div>
      )}
    </div>
  );
}

function PhotoGrid({ items }) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-line py-16 text-center">
        <p className="text-sm text-slate-light">Belum ada foto ditambahkan.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
      {items.map((item) => (
        <PhotoCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default async function LabActivitiesPage() {
  const supabase = createClient();
  const { data: photos } = await supabase
    .from("lab_photos")
    .select("*")
    .order("order_index", { ascending: true });

  const kegiatan = (photos ?? []).filter((p) => p.category === "kegiatan");
  const fasilitas = (photos ?? []).filter((p) => p.category === "fasilitas");

  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-paper">
          <div className="container-lab py-20 md:py-24">
            <p className="eyebrow mb-4">Lab Activities</p>
            <h1 className="max-w-2xl font-display text-3xl font-semibold text-spis md:text-5xl">
              Kegiatan Lab dan Fasilitas Lab
            </h1>
          </div>
        </section>

        <section className="border-t-4 border-line bg-paper py-16 md:py-20">
          <div className="container-lab">
            <p className="eyebrow mb-6">Kegiatan Lab</p>
            <PhotoGrid items={kegiatan} />
          </div>
        </section>

        <section className="border-t-4 border-line bg-paper py-16 md:py-20">
          <div className="container-lab">
            <p className="eyebrow mb-6">Fasilitas Lab</p>
            <PhotoGrid items={fasilitas} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
