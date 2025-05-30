"use client";
import { PayWithCardButton } from "@/components/pay-with-card-button";
import { PayWithPixButton } from "@/components/pay-with-pix-button";
import { SUBSCRIBE_LINK } from "@/lib/constants";
import { useAuth } from "@/use-cases/use-auth";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex-helpers/react/cache/hooks";
import Link from "next/link";

export default function BookPage() {
  const query = useQuery(api.products.getProductAndAccess, {
    slug: "guia-dev-na-gringa",
  });
  const { user, hasPaidSubscription } = useAuth();

  if (!query) {
    return <div>Loading...</div>;
  }

  const { product, hasAccess } = query;

  if (!user?._id || !product?._id) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Produto não encontrado</h1>
        <p>Desculpe, o livro solicitado não foi encontrado.</p>
        <Link
          href="/"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          Voltar para a página inicial
        </Link>
      </div>
    );
  }

  if (!hasAccess && !hasPaidSubscription) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">{product.name}</h1>
        <div className="p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Acesso Necessário</h2>
          <p className="mb-4">
            Este conteúdo está disponível para assinantes pagos ou como uma
            compra única.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <a
              href={SUBSCRIBE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 px-6 py-2 rounded-md hover:bg-blue-700 transition-colors text-center"
            >
              Assinar no Substack
            </a>
            <PayWithCardButton productId={product._id} userId={user._id} />
            <PayWithPixButton productId={product._id} userId={user._id} />
          </div>
        </div>

        {/* Preview section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Prévia</h2>
          <p className="mb-4">
            Aqui está uma prévia do que você obterá com este livro:
          </p>
          <div className="prose prose-slate max-w-none">
            {/* This would be the first chapter content */}
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis
              aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam
              ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis
              nisl.
            </p>
            <PayWithCardButton productId={product._id} userId={user._id} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {product.previewAvailable && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
          <p className="text-yellow-700">
            Você está visualizando a versão de prévia deste conteúdo.
            <Link href={`/checkout/${product.slug}`} className="ml-2 underline">
              Compre para acessar o livro completo
            </Link>
          </p>
        </div>
      )}

      {hasPaidSubscription && (
        <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-6">
          <p className="text-green-700">
            Você está acessando este conteúdo como assinante pago. Obrigado pelo
            seu apoio!
          </p>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">{product.name}</h1>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        {/* This would be the actual book content */}
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis
          aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam
          ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.
        </p>
        <h2>Capítulo 1: Introdução</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis
          aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam
          ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.
        </p>
        <h2>Capítulo 2: Primeiros Passos</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis
          aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam
          ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.
        </p>
      </div>
    </div>
  );
}
