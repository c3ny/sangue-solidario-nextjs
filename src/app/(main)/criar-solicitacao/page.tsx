import { ServerAuthWrapper } from "@/components/ServerAuthWrapper";
import CriarSolicitacao from "./_components/CriarSolicitacao";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Criar Solicitação - Sangue Solidário",
  description: "Crie uma nova solicitação de doação de sangue",
};

export default function Page() {
  return (
    <ServerAuthWrapper>
      <CriarSolicitacao />
    </ServerAuthWrapper>
  );
}
