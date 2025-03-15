"use client";

interface BookViewerProps {
  bookSlug: string;
  hasFullAccess: boolean;
}

export function BookViewer({ hasFullAccess }: BookViewerProps) {
  return (
    <div className="prose max-w-none">
      {!hasFullAccess && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
          <p className="text-yellow-700">
            Você está visualizando a versão gratuita deste conteúdo.
          </p>
        </div>
      )}

      <h2>Parte I: Fundamentos</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod,
        nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl
        nunc quis nisl.
      </p>

      {/* We'll replace this with MDX content later */}
      <div className="mt-8">
        <h3>Capítulo 1: Por Que Ser um Dev na Gringa?</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis
          aliquam nisl nunc quis nisl.
        </p>
      </div>

      {!hasFullAccess && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">
            Acesse o conteúdo completo
          </h3>
          <p>
            Para continuar lendo, você precisa ter acesso ao conteúdo completo.
            Assine ou compre o livro para continuar.
          </p>
        </div>
      )}
    </div>
  );
}
