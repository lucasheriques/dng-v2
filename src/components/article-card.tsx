interface ArticleCardProps {
  title: string;
  description: string;
  link: string;
  readingTime?: string;
  views?: string;
}

export function ArticleCard({
  title,
  description,
  link,
  readingTime,
  views,
}: ArticleCardProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="p-6 rounded-lg hover:bg-white/10 transition-all focus:outline-primary"
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-secondary-text text-sm mb-4">{description}</p>
      )}
      <div className="flex items-center gap-3">
        {views && (
          <span className="text-primary text-xs">+{views} visualizações</span>
        )}
        {readingTime && (
          <>
            <span className="text-secondary-text">•</span>
            <span className="text-primary text-xs">
              {readingTime} de leitura
            </span>
          </>
        )}
      </div>
    </a>
  );
}
