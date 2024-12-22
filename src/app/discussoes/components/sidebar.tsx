import { mockFilters } from "@/app/discussoes/mock-posts";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export function Sidebar() {
  return (
    <div className="w-64 pr-4 border-r border-border nice-scrollbar overflow-y-auto h-full md:h-screen md:sticky md:top-0">
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Filtros</h2>
            <Button
              variant="link"
              className="text-primary hover:text-primary/80 h-auto p-0"
            >
              Limpar tudo
            </Button>
          </div>
          <div className="relative">
            <Input
              placeholder="Pesquisar filtros"
              className="ml-1 bg-input border-input"
            />
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Nível</h3>
          <div className="space-y-2">
            {mockFilters.levels.map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <Checkbox id={`level-${level}`} />
                <label
                  htmlFor={`level-${level}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {level}
                </label>
              </div>
            ))}
          </div>
          <Button
            variant="link"
            className="text-primary hover:text-primary/80 h-auto p-0 mt-2"
          >
            Ver mais
          </Button>
        </div>

        <div>
          <h3 className="font-medium mb-3">Empresa</h3>
          <div className="space-y-2">
            {mockFilters.companies.slice(0, 5).map((company) => (
              <div key={company} className="flex items-center space-x-2">
                <Checkbox id={`company-${company}`} />
                <label
                  htmlFor={`company-${company}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {company}
                </label>
              </div>
            ))}
          </div>
          <Button
            variant="link"
            className="text-primary hover:text-primary/80 h-auto p-0 mt-2"
          >
            Ver mais
          </Button>
        </div>

        <div>
          <h3 className="font-medium mb-3">Tags</h3>
          <div className="space-y-2">
            {mockFilters.tags.slice(0, 5).map((tag) => (
              <div key={tag} className="flex items-center space-x-2">
                <Checkbox id={`tag-${tag}`} />
                <label
                  htmlFor={`tag-${tag}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {tag}
                </label>
              </div>
            ))}
          </div>
          <Button
            variant="link"
            className="text-primary hover:text-primary/80 h-auto p-0 mt-2"
          >
            Ver mais
          </Button>
        </div>
      </div>
    </div>
  );
}
