"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export function ProjectsGrid({ projects }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");

  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        String(p.year || "").includes(q) ||
        p.short_description?.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [projects, activeCategory, query]);

  const showFilters = projects.length > 4;

  return (
    <div>
      {showFilters && (
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                  activeCategory === cat
                    ? "bg-spis text-white"
                    : "border border-spis text-spis hover:bg-spis hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects…"
            className="w-full max-w-xs border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-spis md:w-64"
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line py-16 text-center">
          <p className="text-sm text-slate-light">
            {projects.length === 0
              ? "Belum ada project ditambahkan."
              : "Tidak ada project yang cocok dengan pencarian."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block overflow-hidden rounded-lg border border-spis bg-white transition-colors hover:border-spis-bright"
    >
      <div className="aspect-[4/3] w-full overflow-hidden border-b border-spis bg-paper-2">
        {project.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.cover_image}
            alt={project.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-heading text-lg font-bold text-slate-light">
            {project.name?.[0]}
          </div>
        )}
      </div>
      <div className="p-5">
        <p className="font-mono text-[11px] uppercase tracking-wider text-spis-bright">
          {[project.category, project.year].filter(Boolean).join(" · ") || "—"}
        </p>
        <p className="mt-2 font-display text-base font-semibold text-ink">{project.name}</p>
        {project.short_description && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate">
            {project.short_description}
          </p>
        )}
        <span className="mt-3 inline-block font-mono text-xs uppercase tracking-wider text-spis underline underline-offset-4">
          View Project →
        </span>
      </div>
    </Link>
  );
}
