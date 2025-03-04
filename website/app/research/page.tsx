import Link from "next/link";
import React from "react";
import { allProjects } from "contentlayer/generated";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import { Article } from "./article";
import { topProjectSlugs } from "../../constants/constants";
// import { Eye } from "lucide-react";

export const revalidate = 60;

// Type Guard Function to help TypeScript understand that value is defined
function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

export default async function ProjectsPage() {
  // Fetch the projects if they exist
  const featured = allProjects
    .filter((p) => p.published)
    .find((project) => project.slug === topProjectSlugs.featured);
  const top2 = allProjects
    .filter((p) => p.published)
    .find((project) => project.slug === topProjectSlugs.top2);
  const top3 = allProjects
    .filter((p) => p.published)
    .find((project) => project.slug === topProjectSlugs.top3);

  // Exclude the featured, top2, and top3 projects from the sorted list
  const excludedSlugs = [featured?.slug, top2?.slug, top3?.slug].filter(
    isDefined,
  );

  const sorted = allProjects
    .filter((p) => p.published)
    .filter((project) => !excludedSlugs.includes(project.slug))
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime(),
    );

  return (
    <div className="relative pb-16">
      <Navigation />
      <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Research/Blogs
          </h2>
          <p className="mt-4 text-zinc-400">
            A collection of research and blogs that we have written. We hope you
            find them interesting and informative.
          </p>
        </div>
        <div className="min-h-full w-full h-px bg-zinc-800" />

        {/* Featured and Top Projects */}
        {featured ? (
          <div className="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2 h-fit">
            {/* Featured Project */}
            <Card>
              <Link href={`/research/${featured.slug}`}>
                <article className="relative w-full h-full p-4 md:p-8 transform transition duration-300 hover:scale-105">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs text-zinc-100">
                      {featured.date ? (
                        <time dateTime={new Date(featured.date).toISOString()}>
                          {Intl.DateTimeFormat(undefined, {
                            dateStyle: "medium",
                          }).format(new Date(featured.date))}
                        </time>
                      ) : (
                        <span>SOON</span>
                      )}
                    </div>
                  </div>

                  <h2
                    id="featured-post"
                    className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display"
                  >
                    {featured.title}
                  </h2>
                  <p className="mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300">
                    {featured.description}
                  </p>
                  <div className="absolute bottom-4 md:bottom-8">
                    <p className="hidden text-zinc-200 hover:text-zinc-50 lg:block">
                      Read more <span aria-hidden="true">&rarr;</span>
                    </p>
                  </div>
                </article>
              </Link>
            </Card>

            {/* Top 2 and Top 3 Projects */}
            <div className="flex flex-col w-full gap-8 mx-auto border-t border-gray-900/10 lg:mx-0 lg:border-t-0 ">
              {[top2, top3]
                .filter(isDefined) // Use type guard here
                .map((project) => (
                  <Card key={project.slug}>
                    <Article project={project} />
                  </Card>
                ))}
            </div>
          </div>
        ) : (
          // If no featured project, display a placeholder or message
          <div>
            <p className="text-center text-zinc-400">Coming Soon</p>
          </div>
        )}

        {/* Divider */}
        <div className="hidden w-full h-px md:block bg-zinc-800" />

        {/* Sorted Projects */}
        {sorted.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
            {[0, 1, 2].map((colIndex) => (
              <div key={colIndex} className="grid grid-cols-1 gap-4">
                {sorted
                  .filter((_, i) => i % 3 === colIndex)
                  .map((project) => (
                    <Card key={project.slug}>
                      <Article project={project} />
                    </Card>
                  ))}
              </div>
            ))}
          </div>
        ) : (
          // If no sorted projects and no featured project, display a message
          !featured && (
            <div className="mt-8">
              <p className="text-center text-zinc-400">
                No projects yet. Coming Soon.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
