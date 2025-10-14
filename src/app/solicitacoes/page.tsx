import Link from "next/link";
import donationsService from "../../features/Solicitations/services/donations.service";
import SolicitationsComponent from "./_components";

export default async function Solicitations() {
  const data = await donationsService.getDonations();

  if (!data.length) {
    return <div>Não há solicitações</div>;
  }

  return (
    <main className="container mt-5 py-5">
      <section className="mt-5">
        <div className="row align-items-center mb-2">
          <div className="col-lg-6">
            <h3>Solicitações ao seu redor</h3>
          </div>
          <div className="col-lg-6 d-flex justify-content-end">
            <Link href="/criar-solicitacao" className="btn btn-danger px-4">
              Solicitar
            </Link>
          </div>
        </div>
        <SolicitationsComponent data={data} />
      </section>
    </main>
  );
}
