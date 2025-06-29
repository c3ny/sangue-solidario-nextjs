import Image from "next/image";
import Link from "next/link";
import { Navbar } from "../Navbar";

export const Header = () => {
  return (
    <header className="d-flex flex-wrap justify-content-between align-items-center py-3 mb-5 fixed-top bg-white shadow p-4">
      <Link
        href="/"
        className="d-flex align-items-center link-body-emphasis text-decoration-none me-4"
      >
        <Image
          src="/assets/images/logo/sangue-main.svg"
          alt="Sangue Solidário"
          width={200}
          height={60}
          className="fs-4"
        />
      </Link>

      {/* Botão de menu hambúrguer em resoluções pequenas */}
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

      {/* Menu colapsável para resoluções menores que 992px */}
      <nav className="collapse navbar-collapse d-lg-none w-100" id="navbarMenu">
        <ul className="navbar-nav text-center w-100 my-2">
          {/* Campo de pesquisa de cidade centralizado para resoluções menores */}
          <li className="nav-item w-100">
            <div className="d-flex justify-content-center align-items-center">
              <input
                type="text"
                className="form-control w-75 me-2 searchCity"
                id="cityInputMobile"
                placeholder="Informe a cidade, estado"
              />
              <button
                className="btn p-2"
                id="searchCityBtnMobile"
                style={{ background: "transparent" }}
              >
                <i className="bi bi-search" style={{ color: "#333" }}></i>
              </button>
            </div>
          </li>
          <li className="nav-item">
            <Link href="/" className="nav-link text-danger">
              HOME
            </Link>
          </li>
          <li className="nav-item">
            <Link href="#sobre" className="nav-link text-danger">
              SOBRE NÓS
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/contato" className="nav-link text-danger">
              CONTATO
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/solicitacoes" className="nav-link text-danger">
              DOE
            </Link>
          </li>
          <li className="nav-item">
            <button
              className="btn btn-danger"
              data-bs-toggle="modal"
              data-bs-target="#loginModal"
            >
              LOGIN
            </button>
          </li>
        </ul>
      </nav>

      <Navbar />
    </header>
  );
};
