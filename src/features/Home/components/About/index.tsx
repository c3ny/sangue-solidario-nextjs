import { BsHeart } from "react-icons/bs";
import { Badge } from "@/components/Badge";
import styles from "./styles.module.scss";

export const AboutSection = () => {
  return (
    <section
      className={styles.aboutSection}
      id="sobre"
      aria-label="Sobre a plataforma"
    >
      <div className={styles.header}>
        <Badge icon={<BsHeart />} variant="danger">
          Sobre a Plataforma
        </Badge>
        <h2 className={styles.title}>
          Conectando vidas através da{" "}
          <span className={styles.highlight}>solidariedade</span>
        </h2>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.imageSection}>
          <div className={styles.imageWrapper}>
            <img
              src="https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1151"
              alt="Equipe Sangue Solidário - Conectando doadores e salvando vidas"
              className={styles.image}
            />
          </div>
        </div>

        <div className={styles.textContent}>
          <div className={styles.contentBlock}>
            <h3 className={styles.blockTitle}>Nossa Missão</h3>
            <p className={styles.text}>
              A missão da plataforma é simples, mas poderosa:
              <strong className={styles.bold}>salvar vidas.</strong> Através de
              uma interface clara e um sistema de localização eficiente, a
              ferramenta permite que doadores se conectem com quem mais precisa.
            </p>
            <p className={styles.text}>
              Assim, a<strong className={styles.bold}>Sangue Solidário</strong>
              atua não só como uma facilitadora logística, mas também como um
              espaço de conscientização e engajamento, incentivando a sociedade
              a se envolver ativamente na causa.
            </p>
          </div>

          <div className={styles.contentBlock}>
            <h3 className={styles.blockTitle}>Nossa História</h3>
            <p className={styles.text}>
              A plataforma
              <strong className={styles.bold}>Sangue Solidário</strong>
              surgiu do desejo de transformar a maneira como a doação de sangue
              é vista e acessada no Brasil. Com experiências e conhecimentos
              variados nas áreas de tecnologia, saúde e comunicação, criamos uma
              ponte prática e acessível entre quem precisa de sangue e quem
              deseja doar.
            </p>
          </div>

          <div className={styles.contentBlock}>
            <h3 className={styles.blockTitle}>Nosso Propósito</h3>
            <p className={styles.text}>
              Percebendo as dificuldades e o desconhecimento que ainda envolvem
              o ato de doar, idealizamos a plataforma como uma forma de
              <strong className={styles.bold}>
                desmistificar e facilitar a doação de sangue.
              </strong>
            </p>
            <p className={styles.text}>
              Notamos que muitas vezes, quem deseja ajudar não sabe onde nem
              como começar, e que quem precisa de doações enfrenta dificuldades
              para alcançar possíveis doadores. Dessa forma, visamos romper com
              essas barreiras, oferecendo um ambiente intuitivo e acessível.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>1000+</span>
          <span className={styles.statLabel}>Vidas salvas</span>
        </div>
        <div className={styles.statDivider}></div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>500+</span>
          <span className={styles.statLabel}>Doadores ativos</span>
        </div>
        <div className={styles.statDivider}></div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>24/7</span>
          <span className={styles.statLabel}>Disponível</span>
        </div>
      </div>
    </section>
  );
};
