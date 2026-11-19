import SitePage from "@/components/site-page";
import * as D from "@/lib/site/data";
import * as P from "@/lib/site/pages";

export const revalidate = 0;

export const metadata = { title: "Projects" };
export default async function Page() {
  const [c, projects] = await Promise.all([D.loadContent(), D.projects()]);
  return <SitePage html={P.pProjects(c, { projects })} />;
}
