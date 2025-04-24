import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-danger py-5">
      <div className="container text-center">
        <Link href="/">
          <Image
            src="/assets/images/logo/sangue-white.svg"
            alt="Sangue Solidário"
            width={150}
            height={50}
          />
        </Link>

        <ul className="nav justify-content-center mt-3">
          <li className="nav-item">
            <Link href="/" className="nav-link text-white">
              HOME
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/#sobre" className="nav-link text-white">
              SOBRE NÓS
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/contato" className="nav-link text-white">
              CONTATO
            </Link>
          </li>
          <li className="nav-item">
            <Link href="#" className="nav-link text-white">
              DOE
            </Link>
          </li>
          <li className="nav-item">
            <button
              className="btn btn-light"
              data-bs-toggle="modal"
              data-bs-target="#loginModal"
            >
              LOGIN
            </button>
          </li>
        </ul>
      </div>
    </footer>
  );
};
