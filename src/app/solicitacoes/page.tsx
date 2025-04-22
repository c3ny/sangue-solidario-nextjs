/* eslint-disable @typescript-eslint/no-require-imports */
'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      require('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
  }, []);

  return (
    <>
      <header className="d-flex flex-wrap justify-content-between align-items-center py-3 mb-5 fixed-top bg-white shadow p-4">
          {/* Logotipo */}
          <Link href="/" className="d-flex align-items-center link-body-emphasis text-decoration-none me-4">
            <Image src="/assests/images/sangue-main.svg" alt="Sangue Solidário" width={200} height={60} className="fs-4" />
          </Link>
 
          {/* Campo de pesquisa de cidade para grandes resoluções */}
          <div className="position-relative d-none d-lg-flex align-items-center me-auto">
            <input type="text" className="form-control me-2 searchCity" id="cityInput" placeholder="Informe a cidade, estado" />
            <button className="btn p-2" id="searchCityBtn" style={{ background: 'transparent' }}>
              <i className="bi bi-search" style={{ color: '#333' }}></i>
            </button>
            {/* Lista de sugestões */}
            <ul id="suggestions" className="list-group position-absolute w-100" style={{ top: '100%', zIndex: 1000, display: 'none' }}>
            </ul>
          </div>
 
          {/* Botão de menu hambúrguer em resoluções pequenas */}
          <button className="navbar-toggler d-lg-none border-0" type="button" data-bs-toggle="collapse"
            data-bs-target="#navbarMenu" aria-controls="navbarMenu" aria-expanded="false" aria-label="Abrir menu">
            <span className="navbar-toggler-icon"></span>
          </button>
 
          {/* Menu colapsável para resoluções menores que 992px */}
          <nav className="collapse navbar-collapse d-lg-none w-100" id="navbarMenu">
            <ul className="navbar-nav text-center w-100 my-2">
              {/* Campo de pesquisa de cidade centralizado para resoluções menores */}
              <li className="nav-item w-100">
                <div className="d-flex justify-content-center align-items-center">
                  <input type="text" className="form-control w-75 me-2 searchCity" id="cityInputMobile"
                    placeholder="Informe a cidade, estado" />
                  <button className="btn p-2" id="searchCityBtnMobile" style={{ background: 'transparent' }}>
                    <i className="bi bi-search" style={{ color: '#333' }}></i>
                  </button>
                </div>
              </li>
              <li className="nav-item">
                <Link href="/" className="nav-link text-danger">HOME</Link>
              </li>
              <li className="nav-item">
                <Link href="#sobre" className="nav-link text-danger">SOBRE NÓS</Link>
              </li>
              <li className="nav-item">
                <Link href="/contato" className="nav-link text-danger">CONTATO</Link>
              </li>
              <li className="nav-item">
                <Link href="/solicitacoes" className="nav-link text-danger">DOE</Link>
              </li>
              <li className="nav-item">
                <button className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#loginModal">LOGIN</button>
              </li>
            </ul>
          </nav>
 
          {/* Menu horizontal para resoluções maiores que 992px */}
          <ul className="nav nav-pills d-none d-lg-flex my-2">
            <li className="nav-item">
              <Link href="/" className="nav-link text-danger">HOME</Link>
            </li>
            <li className="nav-item">
              <Link href="#sobre" className="nav-link text-danger">SOBRE NÓS</Link>
            </li>
            <li className="nav-item">
              <Link href="/contato" className="nav-link text-danger">CONTATO</Link>
            </li>
            <li className="nav-item">
              <Link href="/solicitacoes" className="nav-link text-danger">DOE</Link>
            </li>
            <li className="nav-item">
              <button className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#loginModal">LOGIN</button>
            </li>
          </ul>
        </header>

      <main className="container mt-5 py-5">
        <section className="mt-5">
          <div className="row align-items-center mb-2">
            <div className="col-lg-6">
              <h3>Solicitações ao seu redor</h3>
            </div>
            <div className="col-lg-6 d-flex justify-content-end">
              <Link href="/criar-solicitacao" className="btn btn-danger px-4">Solicitar</Link>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <input type="text" className="form-control" id="nomeCompleto" placeholder="Nome completo" required />
            </div>
          </div>

          <div className="row flex-lg-row g-5 py-5 mb-5">
            <div id="solicitationsCards" className="col-lg-6 justify-content-start">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="card border-0 shadow-sm rounded-3 p-3 d-flex flex-row align-items-center mb-3 bg-light">
                  <img 
                    className="rounded-circle me-3" 
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Foto do Paciente" 
                    width={80} 
                    height={80} 
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="flex-grow-1">
                    <h5 className="mb-1 fw-bold">Paciente Mario Luiz</h5>
                    <p className="mb-0 text-danger"><i className="bi bi-droplet"></i> O+</p>
                  </div>
                  <button className="btn btn-danger px-4" onClick={() => window.location.href='visualizar-solicitacao.html'}>Quero doar</button>
                </div>
              ))}
            </div>
            <div className="col-lg-6 d-flex justify-content-center align-items-center">
              <Image src="/assests/images/mapa.png" alt="Mapa de solicitações" width={500} height={400} className="img-fluid shadow rounded" />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-danger py-5">
        <div className="container text-center">
          <Link href="/">
            <Image src="/assests/images/sangue-white.svg" alt="Sangue Solidário" width={150} height={50} />
          </Link>

          <ul className="nav justify-content-center mt-3">
            <li className="nav-item">
              <Link href="/" className="nav-link text-white">HOME</Link>
            </li>
            <li className="nav-item">
              <Link href="/#sobre" className="nav-link text-white">SOBRE NÓS</Link>
            </li>
            <li className="nav-item">
              <Link href="/contato" className="nav-link text-white">CONTATO</Link>
            </li>
            <li className="nav-item">
              <Link href="#" className="nav-link text-white">DOE</Link>
            </li>
            <li className="nav-item">
              <button className="btn btn-light" data-bs-toggle="modal" data-bs-target="#loginModal">LOGIN</button>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
}
