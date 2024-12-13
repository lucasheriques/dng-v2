import { getLastArticle } from "@/use-cases/get-articles";
import Link from "next/link";
import Balancer from "react-wrap-balancer";

export default function LastArticleBanner() {
  const lastArticle = getLastArticle();

  return (
    <Link
      href={`https://newsletter.nagringa.dev/p/${lastArticle.slug}`}
      className="px-4 z-20 flex w-full bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 text-white text-center py-2 items-center justify-center relative group overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-emerald-700 to-teal-800 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out transform group-hover:scale-105" />
      <Balancer>
        <span className="text-sm font-medium line-clamp-2 md:line-clamp-1 relative z-10 group-hover:scale-[1.02] transition-transform duration-300 ease-in-out">
          📚 Último artigo: {lastArticle.title}
        </span>
      </Balancer>
    </Link>
  );
}
