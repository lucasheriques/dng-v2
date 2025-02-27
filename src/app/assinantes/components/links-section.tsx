import { LinkCard } from "@/components/ui/link-card";
import { MENTORSHIP_LINKS } from "@/lib/constants";
import { ExternalLinkIcon } from "lucide-react";

export function LinksSection() {
  return (
    <section className="space-y-2">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <ExternalLinkIcon className="w-5 h-5 text-pink-500" />
          Links Úteis
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {Object.values(MENTORSHIP_LINKS).map((link) => (
          <LinkCard
            key={link.title}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            icon={link.icon}
            cardTitle={link.title}
            variant="outline"
            size="sm"
          />
        ))}
      </div>
    </section>
  );
}
