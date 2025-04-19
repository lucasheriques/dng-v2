import { DismissableBanner } from "@/components/ui/banner";
import { headers } from "next/headers";
import Link from "next/link";
import Balancer from "react-wrap-balancer";

export default async function GeneralHeaderBanner() {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") || "";

  if (pathname.includes("/guias")) {
    return null;
  }

  return (
    <DismissableBanner
      intent="info"
      className="py-0 rounded-none items-center flex justify-center"
      containerClassName="justify-center"
    >
      <Link href={"/como-virar-um-dev-na-gringa"} className="py-3">
        <Balancer>
          Como virar um Dev na Gringa: compilado de informações e dicas
        </Balancer>
      </Link>
    </DismissableBanner>
  );
}
