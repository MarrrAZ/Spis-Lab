import SitePage from "@/components/site-page";
import * as D from "@/lib/site/data";
import * as P from "@/lib/site/pages";

export const revalidate = 0;

export const metadata = { title: "Kegiatan & Fasilitas" };
export default async function Page() {
  const [c, lab] = await Promise.all([D.loadContent(), D.labPhotos()]);
  return <SitePage html={P.pLab(c, { lab })} />;
}
