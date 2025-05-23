'use client'

import Image from "next/image";
import BackToTopButton from "@/components/Button/backToTop";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";

export default function Home() {
  return (
    <>
     <Header />
    import Image from "next/image";

// ...dentro do seu componente...
<div className="container mb-5 py-5">
  <div className="row mt-4 g-5">
    {/* Coluna Lateral com a Foto do Usuário e Informações */}
    <div className="col-lg-3 col-md-4 col-12 text-center mb-4">
      <div className="card shadow-sm p-4">
        <Image
          
          src="/assets/images/users/user1.jpg"
          alt="Foto do usuário"
          
          className="rounded-circle mb-3 img-fluid avatar"
          width={120}
          height={120}
          style={{ display: 'block', margin: '0 auto' }}
        />
        <h4 className="mb-1">Heloisa Moraes</h4>
        <p className="text-muted mb-0">Perfil criado em: 01/01/2023</p>
        <p className="text-muted mb-1">
          Tipo Sanguíneo: <span className="text-danger">O+</span>
        </p>
        <a href="/criar-solicitacao" className="btn btn-danger btn-sm">
          Criar Solicitação
        </a>
      </div>
    </div>

    {/* Cards Centrais com Informações sobre Doações */}
    <div className="col-lg-9 col-md-8">
      <div className="row mb-4">
        <div className="col-lg-4 col-md-12 mb-3">
          <div className="card shadow-sm p-4">
            <h6 className="text-muted">Data da última doação</h6>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="h3 fw-bold">21/10/2024</h5>
              <i className="bi bi-calendar-check fs-3 text-danger"></i>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-12 mb-3">
          <div className="card shadow-sm p-4">
            <h6 className="text-muted">Você já salvou</h6>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="h3 fw-bold mb-0">80 vidas</h5>
              <i className="bi bi-heart-fill fs-3 text-danger"></i>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-12 mb-3">
          <div className="card shadow-sm p-4">
            <h6 className="text-muted">Pode doar novamente</h6>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="h3 fw-bold mb-0 text-danger">22/01/2025</h5>
              <i className="bi bi-calendar2-heart fs-3 text-danger"></i>
            </div>
          </div>
        </div>
      </div>
      <div className="row align-items-center mb-5 d-none d-lg-flex">
        <div>
          <h4 className="mb-2">Confira as solicitações próximas da sua localização</h4>
          <div id="map" style={{ height: 200 }}></div>
        </div>
      </div>
    </div>
  </div>
  {/* Div do mapa para resoluções menores que 1006px */}
  <div className="row d-lg-none mb-5">
    <div className="col-12">
      <h4 className="mb-2">Confira as solicitações próximas da sua localização</h4>
      <div id="map-mobile" style={{ height: 200 }}></div>
    </div>
  </div>
  <div className="row mb-4">
    <div className="col-12">
      <div className="card shadow-sm p-4">
        <h4>Suas informações</h4>
        <form>
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
            <select className="form-select" id="tipoSanguineo" required defaultValue="">
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
          <div className="mb-3">
            <label htmlFor="cidade" className="form-label">
              Cidade
            </label>
            <input
              type="text"
              className="form-control"
              id="cidade"
              defaultValue="Sorocaba"
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
        <h4>Últimas doações</h4>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Doação</th>
                <th>Local</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>João Silva</td>
                <td>Colsan de Sorocaba</td>
                <td>12/10/2024</td>
                <td>
                  <a href="#" className="btn btn-sm btn-outline-danger">
                    Detalhes
                  </a>
                </td>
              </tr>
              <tr>
                <td>Cleber Tavarez</td>
                <td>Hospital Unimed Sorocaba</td>
                <td>12/10/2024</td>
                <td>
                  <a href="#" className="btn btn-sm btn-outline-danger">
                    Detalhes
                  </a>
                </td>
              </tr>
              <tr>
                <td>Colsan de Sorocaba</td>
                <td>Colsan de Sorocaba</td>
                <td>12/10/2024</td>
                <td>
                  <a href="#" className="btn btn-sm btn-outline-danger">
                    Detalhes
                  </a>
                </td>
              </tr>
              <tr>
                <td>Rita Lina Sousa</td>
                <td>Centro de Hematologia de Sorocaba</td>
                <td>12/10/2024</td>
                <td>
                  <a href="#" className="btn btn-sm btn-outline-danger">
                    Detalhes
                  </a>
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
              <select className="form-select" id="tipoSanguineo" required defaultValue="">
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


    <BackToTopButton />
     
    </>
  );
}
