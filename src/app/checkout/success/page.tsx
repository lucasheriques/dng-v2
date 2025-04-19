import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white border border-gray-200 p-8 rounded-lg text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-2">Pagamento Confirmado!</h1>
        <p className="mb-6">
          Seu pagamento foi processado com sucesso. Você já tem acesso ao
          conteúdo adquirido.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/guia-completo"
            className="bg-blue-600 px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Acessar o Conteúdo
          </Link>
          <Link
            href="/"
            className="bg-gray-100 px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            Voltar para a Página Inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
