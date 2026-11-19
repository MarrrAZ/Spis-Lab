import SitePage from "@/components/site-page";
import * as D from "@/lib/site/data";
import * as P from "@/lib/site/pages";

export const revalidate = 0;

export default async function NotFound() {
  const c = await D.loadContent();
  return <SitePage html={P.pNotFound(c)} />;
}
