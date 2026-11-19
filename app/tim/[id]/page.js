import SitePage from "@/components/site-page";
import * as D from "@/lib/site/data";
import * as P from "@/lib/site/pages";

export const revalidate = 0;

import { notFound } from "next/navigation";
export async function generateMetadata({ params }) { const m = await D.member(params.id); return { title: m ? m.name : "Profil" }; }
export default async function Page({ params }) {
  const [c, member, pubs] = await Promise.all([D.loadContent(), D.member(params.id), D.pubsOf(params.id)]);
  if (!member) notFound();
  return <SitePage html={P.pProfile(c, { member, pubs })} />;
}
