import SitePage from "@/components/site-page";
import * as D from "@/lib/site/data";
import * as P from "@/lib/site/pages";

export const revalidate = 0;

export const metadata = { title: "Achievement" };
export default async function Page() {
  const [c, members, pubs] = await Promise.all([D.loadContent(), D.members(), D.achievements()]);
  return <SitePage html={P.pAch(c, { members, pubs })} />;
}
