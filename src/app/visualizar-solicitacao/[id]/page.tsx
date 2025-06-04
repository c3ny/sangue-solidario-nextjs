import Image from "next/image";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import blogApi from "@/service/api/blog.api";
import ListOfPosts from "@/features/Blog/ListOfPosts";
import donationsService from "@/app/services/donations.service";
import styles from "./styles.module.scss";

export default async function VisualizarSolicitacao({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [posts, solicitation] = await Promise.all([
    await blogApi.getPostList(),
    await donationsService.getDonation(Number(id)),
  ]);

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="row flex-lg-row-reverse align-items-center g-5 py-5 mt-5 mb-3">
          <div className="col-lg-6 col-12 col-sm-12">
            <h1 className="display-5 fw-bold mb-3">
              Ajude <span className="text-danger">{solicitation.name}</span>
            </h1>
            <p className="lead text-justify">
              Olá, me chamo {solicitation.name}, tenho leucemia e dependo de
              transfusões de <strong>sangue {solicitation.bloodType}</strong>{" "}
              para continuar meu tratamento. Os estoques estão baixos, e sua
              doação pode fazer toda a diferença para mim e muitos outros. Doar
              é rápido, seguro e salva vidas. Procure um hemocentro e ajude a
              dar esperança a quem mais precisa. Obrigado! ❤️
            </p>
            <p>
              Confira as informações abaixo e registre seu interesse em ajudar o{" "}
              {solicitation.name}.
              <br />
              <strong>
                Para entrar em contato, ligue para (15) 99999-9999.
              </strong>
            </p>
          </div>
          <div className="col-12 col-sm-12 col-lg-6">
            <img
              src={solicitation.image}
              alt={solicitation.name}
              width={500}
              height={300}
              className={styles.solicitationImage}
            />
          </div>
        </div>

        {/* Sessão do Mapa */}
        <div className="row g-5 row mb-5 d-none d-lg-flex py-5 mb-5">
          <div className="col-6">
            <h2 className="display-8 mb-1">
              Para doar, dirija-se para o seguinte endereço{" "}
              <strong>
                Av. Comendador Pereira Inácio, 564 - Jardim Vergueiro,
                Sorocaba/SP
              </strong>
            </h2>
            <p className="lead">
              Horário de Funcionamento: Segunda a Sexta, das 8h às 17h.
            </p>
            <ul>
              <li>
                <strong className="text-danger">
                  Sangue solicitado: {solicitation.bloodType}.
                </strong>
              </li>
              <li>
                <strong>Quantidade de bolsas:</strong> {solicitation.quantity}{" "}
                bolsas.
              </li>
              <li>
                <strong>Data para a doação:</strong> de 25/02/2025 a 28/02/2025.
              </li>
            </ul>
          </div>
          <div className="col-6">
            <Image
              src="/assets/images/map-placeholder.jpg"
              alt="Mapa"
              width={600}
              height={400}
              className="img-fluid"
            />
          </div>
        </div>

        {/* Div do mapa para resoluções menores que 1006px */}
        <div className="row d-lg-none mb-5">
          <div className="col-12">
            <h4 className="mb-4">
              Para doar, dirija-se para o seguinte endereço{" "}
              <strong>
                Av. Comendador Pereira Inácio, 564 - Jardim Vergueiro,
                Sorocaba/SP
              </strong>
              <p className="lead">
                Horário de Funcionamento: Segunda a Sexta, das 8h às 17h.
              </p>
              <ul>
                <li>
                  <strong className="text-danger">
                    Sangue solicitado: A+.
                  </strong>
                </li>
                <li>
                  <strong>Quantidade de bolsas:</strong> 5 bolsas.
                </li>
                <li>
                  <strong>Data para a doação:</strong> de 25/02/2025 a
                  28/02/2025.
                </li>
              </ul>
            </h4>
            <Image
              src="/assets/images/map-placeholder.jpg"
              alt="Mapa"
              width={400}
              height={300}
              className="img-fluid"
            />
          </div>
        </div>

        <ListOfPosts posts={posts} />
      </div>
    </>
  );
}
