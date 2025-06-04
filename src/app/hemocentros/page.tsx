import Image from "next/image";

import { Header } from "@/components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <div className="container mb-5 py-5">
        <div className="row mt-4 g-5">
          {/* Coluna Lateral com a Foto do Usuário e Informações */}
          <div className="col-lg-3 col-md-4 col-12 text-center mb-4">
            <div className="card shadow-sm p-4">
              <Image
                src="/assets/images/users/colsan.jpg"
                alt="Foto do usuário"
                className="rounded-circle mb-3 img-fluid avatar"
                width={120}
                height={120}
              />
              <h4 className="mb-1">Colsan Sorocaba</h4>
              <p className="text-muted mb-1">
                Responsável cadastrado:{" "}
                <span className="text-danger">Ricardo Souza</span>
              </p>
              <p className="text-muted mb-2">Perfil criado em: 01/01/2023</p>
              <a href="#" className="btn btn-danger btn-sm">
                Criar Solicitação
              </a>
            </div>
          </div>

          {/* Cards Centrais com Informações sobre Doações */}
          <div className="col-lg-9 col-md-8">
            <div className="row mb-2">
              <h4 className="mb-3">Estoque de Sangue</h4>
              <div className="col-lg-4 col-md-12 mb-3">
                <div className="card shadow-sm p-3">
                  <h6 className="text-muted m-0">Estoque A+</h6>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="status-bar-container">
                      <div
                        className="status-bar"
                        style={{ width: "70%" }}
                      ></div>
                    </div>
                    <h5 className="h3 fw-bold ms-3">70%</h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-12 mb-3">
                <div className="card shadow-sm p-3">
                  <h6 className="text-muted m-0">Estoque A-</h6>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="status-bar-container">
                      <div
                        className="status-bar"
                        style={{ width: "45%" }}
                      ></div>
                    </div>
                    <h5 className="h3 fw-bold ms-3">45%</h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-12 mb-3">
                <div className="card shadow-sm p-3">
                  <h6 className="text-muted m-0">Estoque B+</h6>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="status-bar-container">
                      <div
                        className="status-bar"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                    <h5 className="h3 fw-bold ms-3">85%</h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-lg-4 col-md-12 mb-3">
                <div className="card shadow-sm p-3">
                  <h6 className="text-muted m-0">Estoque B-</h6>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="status-bar-container">
                      <div
                        className="status-bar"
                        style={{ width: "60%" }}
                      ></div>
                    </div>
                    <h5 className="h3 fw-bold ms-3">60%</h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-12 mb-3">
                <div className="card shadow-sm p-3">
                  <h6 className="text-muted m-0">Estoque AB+</h6>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="status-bar-container">
                      <div
                        className="status-bar"
                        style={{ width: "43%" }}
                      ></div>
                    </div>
                    <h5 className="h3 fw-bold ms-3">43%</h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-12 mb-3">
                <div className="card shadow-sm p-3">
                  <h6 className="text-muted m-0">Estoque AB-</h6>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="status-bar-container">
                      <div
                        className="status-bar"
                        style={{ width: "55%" }}
                      ></div>
                    </div>
                    <h5 className="h3 fw-bold ms-3">55%</h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-lg-4 col-md-12 mb-3">
                <div className="card shadow-sm p-3">
                  <h6 className="text-muted m-0">Estoque O+</h6>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="status-bar-container">
                      <div
                        className="status-bar"
                        style={{ width: "72%" }}
                      ></div>
                    </div>
                    <h5 className="h3 fw-bold ms-3">72%</h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-12 mb-3">
                <div className="card shadow-sm p-3">
                  <h6 className="text-muted m-0">Estoque O-</h6>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="status-bar-container">
                      <div
                        className="status-bar"
                        style={{ width: "35%" }}
                      ></div>
                    </div>
                    <h5 className="h3 fw-bold ms-3">35%</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm p-4">
              <h4>Suas informações</h4>
              <form>
                <div className="mb-3">
                  <label htmlFor="nomeInstituicao" className="form-label">
                    Nome da Instituição
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nomeInstituicao"
                    defaultValue="Colsan Sorocaba"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="nomeResponsavel" className="form-label">
                    Responsável pela conta
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nomeResponsavel"
                    defaultValue="Ricardo Souza"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="telefone" className="form-label">
                    Telefone
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="telefone"
                    defaultValue="(11) 98765-4321"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="endereco" className="form-label">
                    Endereço
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="endereco"
                    defaultValue="Av. Comendador Pereira Inácio, 564"
                    required
                  />
                </div>
                <hr />
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email de login
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    defaultValue="lolomoraes@gmail.com"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    Senha
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    defaultValue="123456"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-danger w-100">
                  Salvar Alterações
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Últimas Doações */}
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm p-4">
              <h4>Doações agendadas</h4>
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Data</th>
                      <th>Hora</th>
                      <th>Tipo sanguíneo indicado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>João Silva</td>
                      <td>12/10/2024</td>
                      <td>07:30</td>
                      <td>
                        <span className="text-danger">A+</span>
                      </td>
                    </tr>
                    <tr>
                      <td>Tatiane Moscardi</td>
                      <td>12/10/2024</td>
                      <td>07:45</td>
                      <td>
                        <span className="text-danger">B+</span>
                      </td>
                    </tr>
                    <tr>
                      <td>Sabrina Fernandes</td>
                      <td>12/10/2024</td>
                      <td>08:00</td>
                      <td>
                        <span className="text-danger">O-</span>
                      </td>
                    </tr>
                    <tr>
                      <td>Diego Mendes</td>
                      <td>12/10/2024</td>
                      <td>09:00</td>
                      <td>
                        <span className="text-danger">AB+</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de Edição de Perfil */}
        <div
          className="modal fade"
          id="editProfileModal"
          tabIndex={-1}
          aria-labelledby="editProfileModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editProfileModalLabel">
                  Editar Perfil
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3 text-center">
                    <label htmlFor="profilePhoto" className="form-label">
                      Foto de Perfil
                    </label>
                    <div className="d-flex justify-content-center mb-3">
                      <Image
                        src="/assets/images/users/user1.jpg"
                        alt="Foto de Perfil"
                        className="rounded-circle"
                        width={100}
                        height={100}
                      />
                    </div>
                    <input
                      type="file"
                      className="form-control"
                      id="profilePhoto"
                      accept="image/*"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="nomeCompleto" className="form-label">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="nomeCompleto"
                      defaultValue="Heloisa Moraes"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="tipoSanguineo" className="form-label">
                      Tipo Sanguíneo
                    </label>
                    <select className="form-select" id="tipoSanguineo" required>
                      <option value="" disabled>
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
                  </div>
                  <div className="mb-3">
                    <label htmlFor="telefone" className="form-label">
                      Telefone
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="telefone"
                      defaultValue="(11) 98765-4321"
                      required
                    />
                  </div>
                  <hr />
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email de login
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="email"
                      defaultValue="lolomoraes@gmail.com"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">
                      Senha
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      defaultValue="123456"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-danger w-100">
                    Salvar Alterações
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
