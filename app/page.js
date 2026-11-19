import SitePage from "@/components/site-page";
import * as D from "@/lib/site/data";
import * as P from "@/lib/site/pages";

export const revalidate = 0;

export default async function Page() {
  const [c, members, pubs, lab, rec] = await Promise.all([D.loadContent(), D.members(), D.achievements(), D.labPhotos(), D.recruitment()]);
  const n = Math.max(0, parseInt(c("home.pubs.count"), 10) || 3);
  const html = P.pHome(c, { members, pubs: pubs.slice(0, n), pubCount: pubs.length, lab, rec });
  return <SitePage html={html} intro={!!c("intro.enabled")} />;
}
