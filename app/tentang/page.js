import SitePage from "@/components/site-page";
import * as D from "@/lib/site/data";
import * as P from "@/lib/site/pages";

export const revalidate = 0;

export const metadata = { title: "About" };
export default async function Page() {
  const [c, about, lab] = await Promise.all([D.loadContent(), D.about(), D.labPhotos()]);
  return <SitePage html={P.pAbout(c, { about, lab })} />;
}
