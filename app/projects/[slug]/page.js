import SitePage from "@/components/site-page";
import * as D from "@/lib/site/data";
import * as P from "@/lib/site/pages";

export const revalidate = 0;

import { notFound } from "next/navigation";
export async function generateMetadata({ params }) { const p = await D.project(params.slug); return { title: p ? p.name : "Project" }; }
export default async function Page({ params }) {
  const [c, project] = await Promise.all([D.loadContent(), D.project(params.slug)]);
  if (!project) notFound();
  return <SitePage html={P.pProject(c, { project })} />;
}
