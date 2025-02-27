import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Área do Assinante | Dev na Gringa",
  description:
    "Acesse conteúdos exclusivos, eventos e recursos premium para assinantes da newsletter Na Gringa.",
};

export default function AssinantesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
