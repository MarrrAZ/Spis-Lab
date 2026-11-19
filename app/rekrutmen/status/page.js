import SitePage from "@/components/site-page";
import * as D from "@/lib/site/data";
import * as P from "@/lib/site/pages";

export const revalidate = 0;

export const metadata = { title: "Cek status pendaftaran" };
export default async function Page() {
  const c = await D.loadContent();
  return <SitePage html={P.pStatus(c)} />;
}
