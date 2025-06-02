import { Banner } from "@/components/ui/banner";
import { Card } from "@/components/ui/card";
import { LinkCard } from "@/components/ui/link-card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { api } from "@convex/_generated/api";
import { fetchAction } from "convex/nextjs";
import { CalendarIcon, Loader2Icon, VideoIcon } from "lucide-react";

function EventsSectionSkeleton() {
  return (
    <section className="space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-pink-500" />
          Eventos do mês
          <Loader2Icon className="w-3 h-3 text-slate-400 animate-spin ml-2" />
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {[...Array(3)].map((_, i) => (
          <LinkCard
            key={i}
            href="#"
            variant="outline"
            size="sm"
            icon={VideoIcon}
            cardTitle={<Skeleton className="h-4 w-32" />}
            subtitle={<Skeleton className="h-3 w-20 mt-1" />}
          />
        ))}
      </div>
    </section>
  );
}

export async function EventsSection() {
  const { events, error } = await fetchAction(api.calendar.getEvents);

  return (
    <section className="space-y-2">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-pink-500" />
          Eventos do mês
        </h2>
      </div>

      {error && (
        <Banner intent="warning">
          <p className="text-amber-400/80">
            {`Não foi possível conectar à API do Google Calendar: ${error}`}
          </p>
        </Banner>
      )}

      {events.length === 0 && (
        <Card className="p-3 text-center border border-slate-800 bg-slate-900/50 rounded">
          <p className="text-sm">Não há eventos programados no momento.</p>
        </Card>
      )}

      {events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {events.map((event) => {
            const formattedDate = new Date(event.startTime).toLocaleDateString(
              "pt-BR",
              {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              }
            );

            return (
              <LinkCard
                key={event.id}
                href={
                  event.isPast
                    ? (event.link ?? "#")
                    : (event.meetLink ?? event.link ?? "#")
                }
                variant="outline"
                size="sm"
                icon={VideoIcon}
                cardTitle={event.title}
                subtitle={formattedDate}
                showExternalIcon={!!event.meetLink || !!event.link}
                target="_blank"
                className={cn(event.isPast && "opacity-70 line-through")}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

export { EventsSectionSkeleton };
