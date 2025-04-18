"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface SearchParams {
  jobTitles: string[];
  skills: string[];
  experienceLevel: "Junior" | "Mid-level" | "Senior" | "";
}

export default function JobQueryBuilder() {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    jobTitles: [],
    skills: [],
    experienceLevel: "",
  });

  const buildSearchQuery = () => {
    const titleString = searchParams.jobTitles.join(" OR ");
    const skillsString = searchParams.skills.join(" AND ");
    const locationString =
      'remote OR remoto OR LATAM OR "Latin America" OR "América Latina"';
    const baseQuery = `(${titleString}) AND (${skillsString}) AND (${locationString})`;

    return searchParams.experienceLevel
      ? `${baseQuery} AND (${searchParams.experienceLevel})`
      : baseQuery;
  };

  const searchUrls = {
    google: (query: string) =>
      `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    linkedin: (query: string) =>
      `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}`,
    indeed: (query: string) =>
      `https://www.indeed.com/jobs?q=${encodeURIComponent(query)}`,
    glassdoor: (query: string) =>
      `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${encodeURIComponent(query)}`,
  };

  const handleSearch = (platform: keyof typeof searchUrls) => {
    const query = buildSearchQuery();
    window.open(searchUrls[platform](query), "_blank");
  };

  return (
    <div className="py-24 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Construtor de Busca de Vagas Internacionais
      </h1>

      <div className="space-y-6">
        <div>
          <label className="block mb-2">
            Cargos Desejados (separados por vírgula)
          </label>
          <Input
            placeholder="Software Engineer, Developer, Frontend Developer"
            onChange={(e) =>
              setSearchParams({
                ...searchParams,
                jobTitles: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
          />
        </div>

        <div>
          <label className="block mb-2">
            Habilidades (separadas por vírgula)
          </label>
          <Input
            placeholder="React, Node.js, TypeScript"
            onChange={(e) =>
              setSearchParams({
                ...searchParams,
                skills: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
          />
        </div>

        <div>
          <label className="block mb-2">Nível de Experiência</label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            onChange={(e) =>
              setSearchParams({
                ...searchParams,
                experienceLevel: e.target
                  .value as SearchParams["experienceLevel"],
              })
            }
          >
            <option value="">Qualquer Nível</option>
            <option value="Junior">Junior</option>
            <option value="Mid-level">Pleno</option>
            <option value="Senior">Sênior</option>
          </select>
        </div>

        <div className="pt-4">
          <h2 className="text-xl font-semibold mb-4">Buscar em:</h2>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => handleSearch("google")}>Google</Button>
            <Button onClick={() => handleSearch("linkedin")}>LinkedIn</Button>
            <Button onClick={() => handleSearch("indeed")}>Indeed</Button>
            <Button onClick={() => handleSearch("glassdoor")}>Glassdoor</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
