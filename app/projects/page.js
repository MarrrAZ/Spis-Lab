import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProjectsGrid } from "@/components/projects-grid";

export const metadata = { title: "Projects — SPIS Lab" };
export const revalidate = 0;

export default async function ProjectsPage() {
  const supabase = createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("order_index", { ascending: true });

  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-paper">
          <div className="container-lab py-20 md:py-24">
            <p className="eyebrow mb-4">Projects</p>
            <h1 className="max-w-2xl font-display text-3xl font-semibold text-spis md:text-5xl">
              Alat &amp; Teknologi SPIS Lab
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate md:text-base">
              Katalog alat, instrumen, dan sistem yang telah dikembangkan oleh
              SPIS Laboratory.
            </p>
          </div>
        </section>

        <section className="border-t-4 border-line bg-paper py-16 md:py-20">
          <div className="container-lab">
            <ProjectsGrid projects={projects ?? []} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
