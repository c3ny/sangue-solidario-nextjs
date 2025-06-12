import Image from "next/image";
import styles from "./styles.module.scss";

export const AboutSection = () => {
  return (
    <div className={styles.aboutSection} id="sobre">
      <div className={styles.firstParagraph}>
        <h2 className="display-7 fw-bold mb">Sobre a plataforma</h2>
        <p className="lead">
          A missão da plataforma é simples, mas poderosa: salvar vidas. Através
          de uma interface clara e um sistema de localização eficiente, a
          ferramenta permite que doadores se conectem com quem mais precisa.
          Assim, a Sangue Solidário atua não só como um facilitadora logística,
          mas também como um espaço de conscientização e engajamento,
          incentivando a sociedade a se envolver ativamente na causa e a
          entender que doar sangue é seguro, necessário e impactante.
        </p>
      </div>
      <div className={styles.secondParagraph}>
        <p>
          A plataforma <strong>Sangue Solidário</strong> surgiu do desejo de
          cinco amigos – Caio César, Caio Scudeller, Cássio Bruno, Nicolas
          Mencacci e Ysrael Moreno – em transformar a maneira como a doação de
          sangue é vista e acessada no Brasil. Com experiências e conhecimentos
          variados nas áreas de tecnologia, saúde e comunicação, eles
          compartilharam o mesmo sonho: criar uma ponte prática e acessível
          entre quem precisa de sangue e quem deseja doar.
        </p>

        <p>
          Percebendo as dificuldades e o desconhecimento que ainda envolvem o
          ato de doar, os amigos idealizaram a plataforma como uma forma de{" "}
          <strong>desmistificar e facilitar a doação de sangue</strong>. Eles
          notaram que muitas vezes, quem deseja ajudar não sabe onde nem como
          começar, e que quem precisa de doações enfrenta dificuldades para
          alcançar possíveis doadores. Dessa forma,{" "}
          <strong>Sangue Solidário</strong> visa romper com essas barreiras,
          oferecendo um ambiente intuitivo e acessível, onde cidadãos comuns,
          hospitais e hemocentros podem compartilhar necessidades e localizar
          doadores em potencial.
        </p>
      </div>
      <div className={styles.image}>
        <Image
          src="/assets/images/sobre.jpg"
          className="d-block mx-lg-auto img-fluid"
          width={624}
          alt=""
          height={395}
        />
      </div>
    </div>
  );
};
