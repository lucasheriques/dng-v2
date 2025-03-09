import { Button } from "@/components/ui/button";
import { SUBSCRIBE_LINK } from "@/lib/constants";
import { LockIcon } from "lucide-react";
import Link from "next/link";

export function NonSubscriberView() {
  return (
    <div className="relative">
      {/* Blurred background - just for visual effect */}
      <div className="absolute inset-0 filter blur-md opacity-20">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-48 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900"
            />
          ))}
        </div>
      </div>

      {/* Overlay message */}
      <div className="relative z-10 flex flex-col items-center justify-center py-24 px-4 text-center">
        <LockIcon className="w-16 h-16 text-pink-500 mb-4" />
        <h2 className="text-3xl font-bold mb-3">
          Conteúdo Exclusivo para Assinantes
        </h2>
        <p className="text-slate-300 mb-8 max-w-lg text-lg">
          Esta página contém recursos exclusivos para assinantes pagos da
          newsletter Dev na Gringa, incluindo eventos, recursos premium e
          conteúdo exclusivo.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href={SUBSCRIBE_LINK} target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              Tornar-se Assinante
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="lg">
              Voltar para Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
