import Image from "next/image";
import Link from "next/link";
import "./bootstrap.min.css";

export default function Home() {
  return (
    <>
      <div className="container mb-5">
        <header className="d-flex flex-wrap justify-content-between align-items-center py-3 mb-5 fixed-top bg-white shadow p-4">
          <Link
            href="/"
            className="d-flex align-items-center link-body-emphasis text-decoration-none me-4"
          >
            <img
              src="https://www.sanguesolidario.com.br/assets/images/logo/sangue-main.svg"
              alt="Sangue Solidário"
              className="fs-4"
            />
          </Link>

          <div className="position-relative d-none d-lg-flex align-items-center me-auto">
            <input
              type="text"
              className="form-control me-2 searchCity"
              id="cityInput"
              placeholder="Informe a cidade, estado"
            />
            <button className="btn p-2" id="searchCityBtn">
              <i className="bi bi-search"></i>
            </button>
            <ul
              id="suggestions"
              className="list-group position-absolute w-100"
            ></ul>
          </div>

          <button
            className="navbar-toggler d-lg-none border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarMenu"
            aria-controls="navbarMenu"
            aria-expanded="false"
            aria-label="Abrir menu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <nav
            className="collapse navbar-collapse d-lg-none w-100"
            id="navbarMenu"
          >
            <ul className="navbar-nav text-center w-100 my-2">
              <li className="nav-item w-100">
                <div className="d-flex justify-content-center align-items-center">
                  <input
                    type="text"
                    className="form-control w-75 me-2 searchCity"
                    id="cityInputMobile"
                    placeholder="Informe a cidade, estado"
                  />
                  <button className="btn p-2" id="searchCityBtnMobile">
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </li>
              <li className="nav-item">
                <Link href="/" className="nav-link text-danger">
                  HOME
                </Link>
              </li>
              <li className="nav-item">
                <a href="#sobre" className="nav-link text-danger">
                  SOBRE NÓS
                </a>
              </li>
              <li className="nav-item">
                <a href="contato.html" className="nav-link text-danger">
                  CONTATO
                </a>
              </li>
              <li className="nav-item">
                <a href="solicitacoes.html" className="nav-link text-danger">
                  DOE
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="#"
                  className="btn btn-danger"
                  data-bs-toggle="modal"
                  data-bs-target="#loginModal"
                >
                  LOGIN
                </a>
              </li>
            </ul>
          </nav>

          <ul className="nav nav-pills d-none d-lg-flex my-2">
            <li className="nav-item">
              <Link
                href="/"
                className="nav-link text-danger"
                aria-current="page"
              >
                HOME
              </Link>
            </li>
            <li className="nav-item">
              <a href="#sobre" className="nav-link text-danger">
                SOBRE NÓS
              </a>
            </li>
            <li className="nav-item">
              <a href="contato.html" className="nav-link text-danger">
                CONTATO
              </a>
            </li>
            <li className="nav-item">
              <a href="solicitacoes.html" className="nav-link text-danger">
                DOE
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#"
                className="btn btn-danger"
                data-bs-toggle="modal"
                data-bs-target="#loginModal"
              >
                LOGIN
              </a>
            </li>
          </ul>
        </header>

        <div className="row flex-lg-row-reverse align-items-center g-5 py-5 mt-5 mb-3">
          <div className="col-lg-6 col-12 col-sm-12">
            <h1 className="display-5 fw-bold mb-3">
              Seja solidário, <span className="text-danger">doe sangue!</span>
            </h1>
            <p className="lead text-justify">
              Somos a <span className="text-danger">sangue solidário</span> uma
              plataforma que a plataforma que conecta vidas por meio da
              solidariedade. Com apenas alguns cliques, você descobre onde sua
              doação é necessária ou cadastra a sua necessidade.
            </p>
            <p>
              Junte-se a nós nessa missão de amor e empatia e faça parte da
              corrente que transforma a solidariedade em esperança. Doe sangue,
              doe vida.
            </p>
            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
              <a href="/solicitacoes.html">
                <button
                  type="button"
                  className="btn btn-danger btn-lg px-4 me-md-2"
                >
                  Ver solicitações
                </button>
              </a>
              <a href="/criar-solicitacao.html">
                <button
                  type="button"
                  className="btn btn-outline-danger btn-lg px-4"
                >
                  Cadastrar solicitação
                </button>
              </a>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-lg-6">
            <img
              src="https://www.sanguesolidario.com.br/assets/images/topo.jpg"
              className="d-block mx-lg-auto img-fluid"
            />
          </div>
        </div>
        <div className="row g-5 row align-items-center mb-5 d-none d-lg-flex py-5 mb-5">
          <div className="col-12">
            <h2 className="display-7 fw-bold mb-3">
              12 hemocentros e 67 pessoas precisam da sua ajuda!
            </h2>
            <div id="map"></div>
          </div>
        </div>
        <div className="row d-lg-none mb-5">
          <div className="col-12">
            <h4 className="mb-2">
              Confira as solicitações próximas da sua localização
            </h4>
            <div id="map-mobile"></div>
          </div>
        </div>
        <div className="row g-5 py-5 mb-5" id="sobre">
          <div className="col-12">
            <h2 className="display-7 fw-bold mb">Sobre a plataforma</h2>
            <p className="lead">
              A missão da plataforma é simples, mas poderosa: salvar vidas.
              Através de uma interface clara e um sistema de localização
              eficiente, a ferramenta permite que doadores se conectem com quem
              mais precisa. Assim, a Sangue Solidário atua não só como um
              facilitadora logística, mas também como um espaço de
              conscientização e engajamento, incentivando a sociedade a se
              envolver ativamente na causa e a entender que doar sangue é
              seguro, necessário e impactante.
            </p>
          </div>
          <div className="col-lg-6 col-12 col-sm-12">
            <p>
              A plataforma <strong>Sangue Solidário</strong> surgiu do desejo de
              cinco amigos – Caio César, Caio Scudeller, Cássio Bruno, Nicolas
              Mencacci e Ysrael Moreno – em transformar a maneira como a doação
              de sangue é vista e acessada no Brasil. Com experiências e
              conhecimentos variados nas áreas de tecnologia, saúde e
              comunicação, eles compartilharam o mesmo sonho: criar uma ponte
              prática e acessível entre quem precisa de sangue e quem deseja
              doar.
            </p>

            <p>
              Percebendo as dificuldades e o desconhecimento que ainda envolvem
              o ato de doar, os amigos idealizaram a plataforma como uma forma
              de <strong>desmistificar e facilitar a doação de sangue</strong>.
              Eles notaram que muitas vezes, quem deseja ajudar não sabe onde
              nem como começar, e que quem precisa de doações enfrenta
              dificuldades para alcançar possíveis doadores. Dessa forma,{" "}
              <strong>Sangue Solidário</strong> visa romper com essas barreiras,
              oferecendo um ambiente intuitivo e acessível, onde cidadãos
              comuns, hospitais e hemocentros podem compartilhar necessidades e
              localizar doadores em potencial.
            </p>
          </div>
          <div className="col-lg-6 col-12 col-sm-12">
            <img
              src="assets/images/sobre.jpg"
              className="d-block mx-lg-auto img-fluid"
            />
          </div>
        </div>

        <div className="row">
          <h2 className="display-7 fw-bold mb-3">Se mantenha informado</h2>
        </div>
        <div
          id="blogCarousel"
          className="carousel slide mb-5 position-relative"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            <div className="carousel-item active">
              <div className="row">
                <div className="col-12 col-md-4 mb-3">
                  <div className="card shadow-sm">
                    <a
                      href="blog.html"
                      className="text-dark text-decoration-none"
                    >
                      <img
                        src="assets/images/blog/01.jpg"
                        alt=""
                        className="card-img-top"
                      />
                      <div className="card-body">
                        <h6 className="fw-bold mb-1">
                          A importância da doação
                        </h6>
                        <p className="card-text previa-blog">
                          A doação de sangue é um ato essencial de solidariedade
                          que pode salvar inúmeras vidas, especialmente em
                          situações de emergência, cirurgias e tratamentos para
                          doenças graves. Com uma única doação, é possível
                          ajudar até quatro pessoas.
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
                <div className="col-6 col-md-4 mb-3">
                  <div className="card shadow-sm">
                    <img
                      src="assets/images/blog/02.jpg"
                      alt=""
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
                    <img
                      src="assets/images/blog/03.jpg"
                      alt=""
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
            <div className="carousel-item">
              <div className="row">
                <div className="col-12 col-md-4 mb-3">
                  <div className="card shadow-sm">
                    <a
                      href="blog.html"
                      className="text-dark text-decoration-none"
                    >
                      <img
                        src="assets/images/blog/04.jpg"
                        alt=""
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
                    </a>
                  </div>
                </div>
                <div className="col-6 col-md-4 mb-3">
                  <div className="card shadow-sm">
                    <img
                      src="assets/images/blog/05.jpg"
                      alt=""
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
                    <img
                      src="assets/images/blog/06.jpg"
                      alt=""
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

          <button
            className="carousel-control-prev position-absolute top-50 translate-middle-y rounded-circle bg-danger"
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
      <div className="bg-danger">
        <div className="container">
          <footer className="py-5">
            <div className="row justify-content-center">
              <div className="col-12 text-center mb-3">
                <Link
                  href="/"
                  className="d-flex justify-content-center align-items-center mb-3 link-body-emphasis text-decoration-none"
                >
                  <img
                    src="assets/images/logo/sangue-white.svg"
                    alt="Sangue Solidário"
                    className="fs-4"
                  />
                </Link>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-12 text-center">
                <ul className="nav justify-content-center">
                  <li className="nav-item">
                    <a
                      href="#"
                      className="nav-link text-white"
                      aria-current="page"
                    >
                      HOME
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="#sobre" className="nav-link text-white">
                      SOBRE NÓS
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="contato.html" className="nav-link text-white">
                      CONTATO
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href="visualizar-solicitacao.html"
                      className="nav-link text-white"
                    >
                      DOE
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href="#"
                      className="btn btn-light"
                      data-bs-toggle="modal"
                      data-bs-target="#loginModal"
                    >
                      LOGIN
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </footer>
        </div>
      </div>

      <div
        className="modal fade"
        id="loginModal"
        tabIndex="-1"
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
