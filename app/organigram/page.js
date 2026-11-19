import SitePage from "@/components/site-page";
import * as D from "@/lib/site/data";
import * as P from "@/lib/site/pages";

export const revalidate = 0;

export const metadata = { title: "Organigram" };
export default async function Page() {
  const [c, members] = await Promise.all([D.loadContent(), D.members()]);
  return <SitePage html={P.pOrg(c, { members })} />;
}
