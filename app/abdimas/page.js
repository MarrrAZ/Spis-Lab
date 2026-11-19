import SitePage from "@/components/site-page";
import * as D from "@/lib/site/data";
import * as P from "@/lib/site/pages";

export const revalidate = 0;

export const metadata = { title: "Abdimas" };
export default async function Page() {
  const [c, abdimas] = await Promise.all([D.loadContent(), D.abdimas()]);
  return <SitePage html={P.pAbd(c, { abdimas })} />;
}
