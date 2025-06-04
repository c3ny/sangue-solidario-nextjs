"use client";
import Image from "next/image";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";

export default function VisualizarSolicitacao() {
  useEffect(() => {
    // Removendo a dependência do Bootstrap JS
    // require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="row flex-lg-row-reverse align-items-center g-5 py-5 mt-5 mb-3">
          <div className="col-lg-6 col-12 col-sm-12">
            <h1 className="display-5 fw-bold mb-3">
              Ajude <span className="text-danger">Mario Luiz da Silva</span>
            </h1>
            <p className="lead text-justify">
              Olá, me chamo Mario Luiz, tenho leucemia e dependo de transfusões
              de <strong>sangue A+</strong> para continuar meu tratamento. Os
              estoques estão baixos, e sua doação pode fazer toda a diferença
              para mim e muitos outros. Doar é rápido, seguro e salva vidas.
              Procure um hemocentro e ajude a dar esperança a quem mais precisa.
              Obrigado! ❤️
            </p>
            <p>
              Confira as informações abaixo e registre seu interesse em ajudar o
              Mario Luiz.
              <br />
              <strong>
                Para entrar em contato, ligue para (15) 99999-9999.
              </strong>
            </p>
          </div>
          <div className="col-12 col-sm-12 col-lg-6">
            <Image
              src="/assets/images/users/marioluiz.jpg"
              alt="Mario Luiz"
              width={500}
              height={300}
              className="d-block mx-lg-auto img-fluid"
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
                <strong className="text-danger">Sangue solicitado: A+.</strong>
              </li>
              <li>
                <strong>Quantidade de bolsas:</strong> 5 bolsas.
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

        {/* Sessão do Blog */}
        <div className="row">
          <h2 className="display-7 fw-bold mb-3">Se mantenha informado</h2>
        </div>
        <div
          id="blogCarousel"
          className="carousel slide mb-5 position-relative"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            {/* Grupo 1 de três cards */}
            <div className="carousel-item active">
              <div className="row">
                <div className="col-12 col-md-4 mb-3">
                  <div className="card shadow-sm">
                    <Image
                      src="/assets/images/blog/01.jpg"
                      alt="Importância da doação"
                      width={400}
                      height={200}
                      className="card-img-top"
                    />
                    <div className="card-body">
                      <h6 className="fw-bold mb-1">A importância da doação</h6>
                      <p className="card-text previa-blog">
                        A doação de sangue é um ato essencial de solidariedade
                        que pode salvar inúmeras vidas, especialmente em
                        situações de emergência, cirurgias e tratamentos para
                        doenças graves. Com uma única doação, é possível ajudar
                        até quatro pessoas.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-6 col-md-4 mb-3">
                  <div className="card shadow-sm">
                    <Image
                      src="/assets/images/blog/02.jpg"
                      alt="Quem pode doar"
                      width={400}
                      height={200}
                      className="card-img-top"
                    />
                    <div className="card-body">
                      <h6 className="fw-bold mb-1">Quem pode doar?</h6>
                      <p className="card-text previa-blog">
                        Para doar sangue, é necessário atender a alguns
                        critérios que garantem a segurança do doador e do
                        receptor. Podem doar pessoas com boas condições de
                        saúde, entre 16 e 69 anos.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-6 col-md-4 mb-3">
                  <div className="card shadow-sm">
                    <Image
                      src="/assets/images/blog/03.jpg"
                      alt="Doação no Brasil"
                      width={400}
                      height={200}
                      className="card-img-top"
                    />
                    <div className="card-body">
                      <h6 className="fw-bold mb-1">A doação no Brasil</h6>
                      <p className="card-text previa-blog">
                        No Brasil, as doações de sangue representam uma
                        importante ação de saúde pública e solidariedade,
                        atendendo milhares de pessoas que dependem desse recurso
                        em casos de emergência.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Grupo 2 de três cards */}
            <div className="carousel-item">
              <div className="row">
                <div className="col-12 col-md-4 mb-3">
                  <div className="card shadow-sm">
                    <Image
                      src="/assets/images/blog/04.jpg"
                      alt="Impacto das Doações"
                      width={400}
                      height={200}
                      className="card-img-top"
                    />
                    <div className="card-body">
                      <h6 className="fw-bold mb-1">Impacto das Doações</h6>
                      <p className="card-text previa-blog">
                        A cada dia, o sangue doado é essencial para diversas
                        situações médicas, como cirurgias de emergência e
                        tratamentos para doenças crônicas. Doe sangue e faça a
                        diferença!
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-6 col-md-4 mb-3">
                  <div className="card shadow-sm">
                    <Image
                      src="/assets/images/blog/05.jpg"
                      alt="Doação Regular"
                      width={400}
                      height={200}
                      className="card-img-top"
                    />
                    <div className="card-body">
                      <h6 className="fw-bold mb-1">Doação Regular</h6>
                      <p className="card-text previa-blog">
                        A doação regular é fundamental para manter os estoques
                        dos hemocentros. Este ato simples e seguro pode ser
                        realizado a cada dois ou três meses.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-6 col-md-4 mb-3">
                  <div className="card shadow-sm">
                    <Image
                      src="/assets/images/blog/06.jpg"
                      alt="Tipos Raros"
                      width={400}
                      height={200}
                      className="card-img-top"
                    />
                    <div className="card-body">
                      <h6 className="fw-bold mb-1">Tipos Raros</h6>
                      <p className="card-text previa-blog">
                        Pessoas com tipos sanguíneos raros são essenciais para
                        manter os estoques de sangue diversificados. Cada doação
                        é uma esperança a mais para quem precisa.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botões de navegação */}
          <button
            className="carousel-control-prev position-absolute top-50 translate-middle-y rounded-circle bg-danger"
            style={{ left: "-60px", width: "50px", height: "50px" }}
            type="button"
            data-bs-target="#blogCarousel"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Voltar</span>
          </button>
          <button
            className="carousel-control-next position-absolute top-50 translate-middle-y rounded-circle bg-danger"
            style={{ right: "-60px", width: "50px", height: "50px" }}
            type="button"
            data-bs-target="#blogCarousel"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Avançar</span>
          </button>
        </div>
      </div>
    </>
  );
}
