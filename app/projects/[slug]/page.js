import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const revalidate = 0;

export async function generateMetadata({ params }) {
  const supabase = createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("name, short_description")
    .eq("slug", params.slug)
    .maybeSingle();
  return {
    title: project ? `${project.name} — Projects — SPIS Lab` : "Project — SPIS Lab",
    description: project?.short_description || undefined,
  };
}

function Section({ title, children }) {
  if (!children) return null;
  return (
    <div className="border-t border-line pt-8 first:border-0 first:pt-0">
      <p className="eyebrow mb-3">{title}</p>
      {children}
    </div>
  );
}

export default async function ProjectDetailPage({ params }) {
  const supabase = createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", params.slug)
    .maybeSingle();

  if (!project) notFound();

  const specs = Array.isArray(project.specifications) ? project.specifications : [];
  const outputs = Array.isArray(project.outputs) ? project.outputs : [];
  const publications = Array.isArray(project.related_publications) ? project.related_publications : [];
  const gallery = Array.isArray(project.gallery) ? project.gallery : [];

  const devInfo = [
    project.year && { label: "Year", value: String(project.year) },
    project.status && { label: "Status", value: project.status },
    project.developers && { label: "Developer / Researcher", value: project.developers },
    project.supervisor && { label: "Dosen Pembimbing", value: project.supervisor },
  ].filter(Boolean);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-spis-deep text-white">
          <div className="container-lab py-8">
            <Link href="/projects" className="font-mono text-xs uppercase tracking-wider text-white/60 hover:text-white">
              ← Kembali ke Projects
            </Link>
          </div>
        </section>

        <section className="border-t-4 border-line bg-paper py-16 md:py-20">
          <div className="container-lab grid gap-10 md:grid-cols-[1fr_1fr]">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-lg border border-spis bg-paper-2">
              {project.cover_image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.cover_image} alt={project.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-heading text-2xl font-bold text-slate-light">
                  {project.name?.[0]}
                </div>
              )}
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-spis-bright">
                {[project.category, project.year].filter(Boolean).join(" · ") || "—"}
              </p>
              <h1 className="mt-2 font-display text-2xl font-bold text-ink md:text-3xl">
                {project.name}
              </h1>
              {project.short_description && (
                <p className="mt-4 text-sm leading-relaxed text-slate md:text-base">
                  {project.short_description}
                </p>
              )}

              {devInfo.length > 0 && (
                <dl className="mt-6 space-y-2 border-t border-line pt-6">
                  {devInfo.map((d) => (
                    <div key={d.label} className="flex gap-3 text-sm">
                      <dt className="w-40 shrink-0 font-mono text-[11px] uppercase tracking-wider text-slate-light">
                        {d.label}
                      </dt>
                      <dd className="text-ink">{d.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {outputs.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {outputs.map((o) => (
                    <span
                      key={o}
                      className="border border-spis px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-spis"
                    >
                      {o}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="border-t-4 border-line bg-paper py-16 md:py-20">
          <div className="container-lab max-w-3xl space-y-8">
            <Section title="Overview">
              {project.overview && (
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate md:text-base">
                  {project.overview}
                </p>
              )}
            </Section>

            <Section title="Purpose / Function">
              {project.purpose && (
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate md:text-base">
                  {project.purpose}
                </p>
              )}
            </Section>

            <Section title="How It Works">
              {project.how_it_works && (
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate md:text-base">
                  {project.how_it_works}
                </p>
              )}
            </Section>

            {specs.length > 0 && (
              <Section title="Specifications">
                <div className="overflow-hidden rounded-lg border border-spis">
                  {specs.map((s, i) => (
                    <div
                      key={i}
                      className={`flex gap-4 px-4 py-3 text-sm ${i % 2 === 1 ? "bg-paper-2" : "bg-white"}`}
                    >
                      <span className="w-40 shrink-0 font-mono text-[11px] uppercase tracking-wider text-slate-light">
                        {s.label}
                      </span>
                      <span className="text-ink">{s.value}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            <Section title="Applications">
              {project.applications && (
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate md:text-base">
                  {project.applications}
                </p>
              )}
            </Section>

            {publications.length > 0 && (
              <Section title="Related Publications">
                <ul className="space-y-2">
                  {publications.map((p, i) => (
                    <li key={i} className="text-sm">
                      {p.link ? (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-spis underline underline-offset-4 hover:text-spis-bright"
                        >
                          {p.title}
                        </a>
                      ) : (
                        <span className="text-ink">{p.title}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {gallery.length > 0 && (
              <Section title="Documentation">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {gallery.map((url, i) => (
                    <div key={i} className="aspect-square overflow-hidden rounded-lg border border-spis bg-paper-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`${project.name} — dokumentasi ${i + 1}`} className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
