import Image from "next/image";
import Link from "next/link";
import {
  BsHeart,
  BsEnvelope,
  BsPhone,
  BsGeoAlt,
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsLinkedin,
} from "react-icons/bs";
import styles from "./styles.module.scss";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.brandColumn}>
            <Link href="/" className={styles.logoLink}>
              <Image
                src="/assets/images/logo/sangue-white.svg"
                alt="Sangue Solidário"
                width={180}
                height={60}
                className={styles.logo}
              />
            </Link>
            <p className={styles.brandDescription}>
              Conectando vidas através da solidariedade. Uma plataforma que
              facilita a doação de sangue e salva vidas todos os dias.
            </p>
            <div className={styles.socialLinks}>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Facebook"
              >
                <BsFacebook />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Instagram"
              >
                <BsInstagram />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Twitter"
              >
                <BsTwitter />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="LinkedIn"
              >
                <BsLinkedin />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className={styles.linksColumn}>
            <h3 className={styles.columnTitle}>Navegação</h3>
            <ul className={styles.linksList}>
              <li>
                <Link href="/">Início</Link>
              </li>
              <li>
                <Link href="/#sobre">Sobre Nós</Link>
              </li>
              <li>
                <Link href="/#como-funciona">Como Funciona</Link>
              </li>
              <li>
                <Link href="/#faq">FAQ</Link>
              </li>
            </ul>
          </div>

          <div className={styles.linksColumn}>
            <h3 className={styles.columnTitle}>Doação</h3>
            <ul className={styles.linksList}>
              <li>
                <Link href="/solicitacoes">Ver Solicitações</Link>
              </li>
              <li>
                <Link href="/criar-solicitacao">Criar Solicitação</Link>
              </li>
              <li>
                <Link href="/hemocentros">Hemocentros</Link>
              </li>
            </ul>
          </div>

          <div className={styles.linksColumn}>
            <h3 className={styles.columnTitle}>Contato</h3>
            <ul className={styles.contactList}>
              <li>
                <BsEnvelope className={styles.contactIcon} />
                <a href="mailto:contato@sanguesolidario.com.br">
                  contato@sanguesolidario.com.br
                </a>
              </li>
              <li>
                <BsPhone className={styles.contactIcon} />
                <a href="tel:+551112345678">(11) 1234-5678</a>
              </li>
              <li>
                <BsGeoAlt className={styles.contactIcon} />
                <span>Sorocaba, SP - Brasil</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.bottomSection}>
          <div className={styles.copyright}>
            <BsHeart className={styles.heartIcon} />
            <span>
              {currentYear} Sangue Solidário. Todos os direitos reservados.
            </span>
          </div>
          <div className={styles.legalLinks}>
            <Link href="/termos-privacidade">
              Termos de Uso e Política de Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
