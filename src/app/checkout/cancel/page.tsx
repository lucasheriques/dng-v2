import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white border border-gray-200 p-8 rounded-lg text-center">
        <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Pagamento Cancelado
        </h1>
        <p className="text-gray-600 mb-6">
          Seu pagamento foi cancelado. Nenhum valor foi cobrado.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/checkout/guia-completo"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Tentar Novamente
          </Link>
          <Link
            href="/"
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            Voltar para a Página Inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
