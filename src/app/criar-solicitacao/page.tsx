import Image from "next/image";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
     <Header />
    <div className="container mb-5">
  <div className="row align-items-center g-5 py-5 mt-5 mb-3">
    <div className="col-12">
      <h1 className="display-5 fw-bold mb-3">Crie uma solicitação de doação de sangue</h1>
      <p className="lead">
        Preencha as informações necessárias para que doadores possam encontrar sua solicitação e ajudar quem precisa.
      </p>
    </div>
    <div className="col-12">
      <form>
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="nome" className="form-label">Nome do paciente</label>
            <input type="text" className="form-control" id="nome" required />
          </div>
          <div className="col-md-6">
            <label htmlFor="telefone" className="form-label">Telefone para contato</label>
            <input type="text" className="form-control" id="telefone" />
          </div>
          <div className="col-md-6">
            <label htmlFor="tipoSanguineo" className="form-label">Tipo sanguíneo</label>
            <select className="form-select" id="tipoSanguineo" required>
              <option value="" disabled>Selecione o tipo sanguíneo</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="quantidade" className="form-label">Quantidade de bolsas</label>
            <input type="number" className="form-control" id="quantidade" required />
          </div>
          <div className="col-md-6">
            <label htmlFor="datainicio" className="form-label">Data de início da solicitação</label>
            <input type="date" className="form-control" id="datainicio" />
          </div>
          <div className="col-md-6">
            <label htmlFor="datatermino" className="form-label">Data de término da solicitação</label>
            <input type="date" className="form-control" id="datatermino" />
          </div>
          <div className="col-12">
            <label htmlFor="endereco" className="form-label">Endereço para doação</label>
            <input type="text" className="form-control" id="endereco" required />
          </div>
          <div className="col-12">
            <label htmlFor="descricao" className="form-label">Descrição</label>
            <textarea className="form-control" id="descricao" rows={5} placeholder="Se desejar, adicione uma descrição da solicitação"></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="formFile" className="form-label">Foto do paciente</label>
            <input className="form-control" type="file" id="formFile" />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-lg btn-danger">Criar solicitação</button>
          </div>
        </div>
      </form>
    </div>
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
