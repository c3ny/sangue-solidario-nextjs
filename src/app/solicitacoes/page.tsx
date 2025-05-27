import Image from "next/image";
import Link from "next/link";
import donationsService from "../services/donations.service";
import { SolicitationCard } from "@/components/SolicitationCard";
import { Header } from "@/components/Header";
import { Solicitation } from "@/interfaces/Solicitations.interface";
import { Footer } from "@/components/Footer";

export default async function Solicitations() {
  const data = (await donationsService.getDonations()).data;

  return (
    <>
      <Header />

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

          <div className="row">
            <div className="col">
              <input
                type="text"
                className="form-control"
                id="nomeCompleto"
                placeholder="Nome completo"
                required
              />
            </div>
          </div>

          <div className="row flex-lg-row g-5 py-5 mb-5">
            <div
              id="solicitationsCards"
              className="col-lg-6 justify-content-start"
            >
              {data.map((donation, index) => (
                <SolicitationCard
                  key={index}
                  name={donation.name}
                  image={donation.image}
                  bloodType={donation.bloodType}
                />
              ))}
            </div>
            <div className="col-lg-6 d-flex justify-content-center align-items-center">
              <Image
                src="/assets/images/map-placeholder.jpg"
                alt="Mapa de solicitações"
                width={500}
                height={400}
                className="img-fluid shadow rounded"
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
