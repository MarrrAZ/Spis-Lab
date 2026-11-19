import SitePage from "@/components/site-page";
import * as D from "@/lib/site/data";
import * as P from "@/lib/site/pages";

export const revalidate = 0;

export const metadata = { title: "Formulir pendaftaran asisten" };
export default async function Page() {
  const [c, rec, form] = await Promise.all([D.loadContent(), D.recruitment(), D.recruitmentForm()]);
  return <SitePage html={P.pDaftar(c, { rec, form })} />;
}
