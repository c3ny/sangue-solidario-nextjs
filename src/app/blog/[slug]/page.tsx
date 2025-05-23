import Image from "next/image";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Post() {
  return (
    <>
      <Header />
      <div className="container-fluid py-5 px-0 mb-3">
        <Image
          className="imgdestaque"
          src="/assets/images/blog/topimage.jpeg"
          alt="Destaque Blog"
          width={1200}
          height={400}
        />
      </div>

      <div className="container mb-4 py-4">
        <h2 className="mb-3 fw-bold">
          A doação é simples e rápida. Confira alguns pontos importantes para
          salvar vidas.
        </h2>
        <p>
          A doação de sangue é um gesto de solidariedade e humanidade que salva
          milhões de vidas ao redor do mundo. É um ato voluntário em que uma
          pequena quantidade de sangue é coletada para ajudar pessoas que passam
          por situações de emergência, como acidentes, complicações durante o
          parto, cirurgias complexas e tratamentos de doenças graves, incluindo
          câncer, anemia severa e doenças do sangue. A importância da doação
          regular não pode ser subestimada, pois muitos hospitais e clínicas
          dependem de doações constantes para manter seus bancos de sangue
          abastecidos e prontos para atender qualquer emergência.
        </p>
        <p className="lead">
          Para doar sangue, é necessário atender a alguns requisitos básicos,
          como ter entre 16 e 69 anos, estar em boas condições de saúde e pesar
          no mínimo 50 kg. As condições de saúde e estilo de vida dos doadores
          são verificadas em uma triagem inicial, garantindo que o sangue
          coletado seja seguro tanto para o receptor quanto para o próprio
          doador. Além disso, o processo é totalmente seguro, com o uso de
          materiais descartáveis e esterilizados, o que elimina qualquer risco
          de contaminação.
        </p>
        <p>
          A coleta de sangue é rápida e dura em média de 10 a 15 minutos, embora
          o tempo total de permanência na unidade, incluindo a triagem e o
          repouso após a doação, possa chegar a 30 minutos. Em cada doação, é
          coletado um volume de sangue que representa apenas uma pequena parte
          do total que circula pelo corpo humano, sendo facilmente reposto pelo
          organismo em poucos dias. Os principais componentes do sangue — como
          as plaquetas, o plasma e as hemácias — são separados para atender
          diferentes necessidades dos pacientes. Por exemplo, as plaquetas são
          fundamentais para pessoas que enfrentam tratamentos de quimioterapia,
          enquanto o plasma é amplamente utilizado em casos de queimaduras e
          problemas de coagulação.
        </p>
        <p>
          Uma única doação de sangue pode beneficiar até quatro pessoas, o que
          significa que o impacto positivo desse gesto é multiplicado. A
          constância nas doações é especialmente importante, pois os componentes
          sanguíneos possuem um prazo de validade, tornando necessária uma
          reposição contínua para que não haja falta em momentos críticos. Por
          exemplo, as plaquetas têm validade de apenas cinco dias, enquanto as
          hemácias duram até 42 dias. Dessa forma, cada doação representa um
          esforço coletivo que ajuda a manter o sistema de saúde preparado e os
          estoques de sangue em níveis seguros.
        </p>
        <p>
          A conscientização sobre a doação de sangue também é fundamental.
          Muitas pessoas ainda têm receio de doar por medo de agulhas, por falta
          de informação ou até mesmo por acreditar em mitos sobre o processo.
          Por isso, é importante compartilhar informações sobre o impacto
          positivo da doação e esclarecer dúvidas, para que mais pessoas se
          sintam seguras e motivadas a contribuir. Doe regularmente e incentive
          amigos e familiares a fazerem o mesmo, pois a necessidade de sangue é
          contínua e uma atitude simples pode salvar vidas, contribuindo para um
          futuro mais saudável e seguro para todos.
        </p>
      </div>

      <div className="container mt-4 mb-4 py-4">
        <div className="row">
          <h3 className="display-7 fw-bold mb-3">Se mantenha informado</h3>
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
                      alt=""
                      className="card-img-top"
                      width={400}
                      height={250}
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
                      alt=""
                      className="card-img-top"
                      width={400}
                      height={250}
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
                      alt=""
                      className="card-img-top"
                      width={400}
                      height={250}
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
                      alt=""
                      className="card-img-top"
                      width={400}
                      height={250}
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
                      alt=""
                      className="card-img-top"
                      width={400}
                      height={250}
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
                      alt=""
                      className="card-img-top"
                      width={400}
                      height={250}
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

      <Footer />

      <div
        className="modal fade"
        id="loginModal"
        aria-labelledby="loginModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body text-center">
              <img
                src="./assets/images/logo/sangue-main.svg"
                alt="Login Icon"
                width="250"
                className="mb-4"
              />
              <h3 className="h4 mb-3 fw-normal">Faça seu login</h3>

              <form method="get" action="perfil.html">
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingEmail"
                    placeholder="name@example.com"
                    required
                  />
                  <label htmlFor="floatingEmail">Email</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    required
                  />
                  <label htmlFor="floatingPassword">Senha</label>
                </div>
                <button type="submit" className="btn btn-danger w-100 py-2">
                  Entrar
                </button>
              </form>

              <hr className="my-4" />
              <p className="text-muted">
                <a
                  href="#"
                  className="text-decoration-none text-danger"
                  data-bs-toggle="modal"
                  data-bs-target="#signupModal"
                  data-bs-dismiss="modal"
                >
                  Ainda não possui uma conta? Cadastre-se agora!
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="signupModal"
        tabIndex={-1}
        aria-labelledby="signupModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body text-center">
              <img
                src="./assets/images/logo/sangue-main.svg"
                alt="Signup Icon"
                width="250"
                className="mb-4"
              />
              <h3 className="h4 mb-3 fw-normal">Cadastre-se</h3>

              <div className="form-floating mb-3">
                <select
                  className="form-select"
                  id="userType"
                  aria-label="Tipo de Usuário"
                  required
                >
                  <option selected disabled value="">
                    Selecione o tipo de usuário
                  </option>
                  <option value="fisica">Pessoa Física</option>
                  <option value="juridica">Pessoa Jurídica</option>
                </select>
                <label htmlFor="userType">Tipo de Usuário</label>
              </div>

              <form id="signupForm">
                <div id="fisicaFields" className="d-none">
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="nomeCompleto"
                      placeholder="Nome completo"
                      required
                    />
                    <label htmlFor="nomeCompleto">Nome Completo</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="date"
                      className="form-control"
                      id="dataNascimento"
                      required
                    />
                    <label htmlFor="dataNascimento">Data de Nascimento</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="cpf"
                      placeholder="CPF"
                      required
                    />
                    <label htmlFor="cpf">CPF</label>
                  </div>
                  <div className="form-floating mb-3">
                    <select className="form-select" id="tipoSanguineo" required>
                      <option value="" selected disabled>
                        Selecione o tipo sanguíneo
                      </option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                    <label htmlFor="tipoSanguineo">Tipo Sanguíneo</label>
                  </div>
                </div>

                <div id="juridicaFields" className="d-none">
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="nomeResponsavel"
                      placeholder="Nome do responsável"
                      required
                    />
                    <label htmlFor="nomeResponsavel">Nome do Responsável</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="nomeInstituicao"
                      placeholder="Nome da Instituição"
                      required
                    />
                    <label htmlFor="nomeInstituicao">Nome da Instituição</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="cnpj"
                      placeholder="CNPJ"
                      required
                    />
                    <label htmlFor="cnpj">CNPJ</label>
                  </div>
                </div>

                <div id="commonFields" className="d-none">
                  <div className="form-floating mb-3">
                    <select className="form-select" id="estado" required>
                      <option value="" selected disabled>
                        Selecione o estado
                      </option>
                      <option value="AC">Acre</option>
                      <option value="AL">Alagoas</option>
                      <option value="AP">Amapá</option>
                      <option value="AM">Amazonas</option>
                      <option value="BA">Bahia</option>
                      <option value="CE">Ceará</option>
                      <option value="DF">Distrito Federal</option>
                      <option value="ES">Espírito Santo</option>
                      <option value="GO">Goiás</option>
                      <option value="MA">Maranhão</option>
                      <option value="MT">Mato Grosso</option>
                      <option value="MS">Mato Grosso do Sul</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="PA">Pará</option>
                      <option value="PB">Paraíba</option>
                      <option value="PR">Paraná</option>
                      <option value="PE">Pernambuco</option>
                      <option value="PI">Piauí</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="RN">Rio Grande do Norte</option>
                      <option value="RS">Rio Grande do Sul</option>
                      <option value="RO">Rondônia</option>
                      <option value="RR">Roraima</option>
                      <option value="SC">Santa Catarina</option>
                      <option value="SP">São Paulo</option>
                      <option value="SE">Sergipe</option>
                      <option value="TO">Tocantins</option>
                    </select>
                    <label htmlFor="estado">Estado</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="cidade"
                      placeholder="Cidade"
                      required
                    />
                    <label htmlFor="cidade">Cidade</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className="form-control"
                      id="signupEmail"
                      placeholder="name@example.com"
                      required
                    />
                    <label htmlFor="signupEmail">Email para Login</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="password"
                      className="form-control"
                      id="signupPassword"
                      placeholder="Password"
                      required
                    />
                    <label htmlFor="signupPassword">Senha Desejada</label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-danger w-100 py-2 mt-2"
                >
                  Cadastrar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <button
        id="backToTopBtn"
        className="btn btn-danger rounded-circle position-fixed"
      >
        <i className="bi bi-arrow-up text-white"></i>
      </button>
    </>
  );
}
