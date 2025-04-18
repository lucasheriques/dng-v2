"use client";

import { PayWithCardButton } from "@/components/pay-with-card-button";
import { PayWithPixButton } from "@/components/pay-with-pix-button";
import { SUBSCRIBE_LINK } from "@/lib/constants";
import { useAuth } from "@/use-cases/use-auth";
import { Id } from "@convex/_generated/dataModel";

interface AccessGateProps {
  productId: Id<"products">;
  hasAccess: boolean;
  children: React.ReactNode;
}

export function AccessGate({
  productId,
  hasAccess,
  children,
}: AccessGateProps) {
  const { user } = useAuth();

  if (!hasAccess) {
    return (
      <div className="p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Acesso Necessário</h2>
        <p className="mb-4">
          Este conteúdo está disponível para assinantes ou como compra única.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={SUBSCRIBE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 px-6 py-2 rounded-md hover:bg-blue-700 transition-colors text-center"
          >
            Assinar no Substack
          </a>
          {user?._id && (
            <>
              <PayWithCardButton productId={productId} userId={user._id} />
              <PayWithPixButton productId={productId} userId={user._id} />
            </>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
