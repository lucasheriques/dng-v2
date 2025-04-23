import { MagicCard } from "@/components/magicui/magic-card";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Article } from "@/lib/types";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const { title, description, canonical_url, views } = article;

  return (
    <a href={canonical_url} target="_blank" className="ring-none outline-none">
      <Card className="p-0 max-w-sm shadow-none border-none">
        <MagicCard
          gradientTo="var(--accent-secondary)"
          className="p-0 border border-slate-800"
        >
          <CardHeader className="border-b border-border p-4 [.border-b]:pb-4">
            <CardTitle className="text-lg">{title}</CardTitle>
          </CardHeader>
          <CardContent className="p-4">{description}</CardContent>

          <CardFooter className="flex gap-2 flex-col">
            {views && (
              <span className="text-primary text-xs">
                +{views} visualizações
              </span>
            )}
          </CardFooter>
        </MagicCard>
      </Card>
    </a>
  );
}
