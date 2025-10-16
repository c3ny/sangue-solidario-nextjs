import Image from "next/image";
import Link from "next/link";
import { BsArrowRight, BsHeart, BsEye } from "react-icons/bs";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import styles from "./styles.module.scss";

/**
 * WelcomeSection Component
 * Hero section displaying the main call-to-action for the Sangue Solidário platform
 */
export const WelcomeSection = () => {
  return (
    <section className={styles.welcomeSection} aria-label="Bem-vindo">
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <Badge icon={<BsHeart />} variant="danger">
            Plataforma de Doação de Sangue
          </Badge>

          <h1 className={styles.mainHeading}>
            Seja solidário,
            <span className={styles.highlightText}>doe sangue!</span>
          </h1>

          <div className={styles.description}>
            <p className={styles.leadText}>
              Somos a
              <strong className={styles.brandName}>Sangue Solidário</strong>,
              uma plataforma que conecta vidas por meio da solidariedade. Com
              apenas alguns cliques, você descobre onde sua doação é necessária
              ou cadastra a sua necessidade.
            </p>
            <p className={styles.secondaryText}>
              Junte-se a nós nessa missão de amor e empatia e faça parte da
              corrente que transforma a solidariedade em esperança. Doe sangue,
              doe vida.
            </p>
          </div>

          <div className={styles.ctaButtons}>
            <Link href="/solicitacoes">
              <Button
                variant="primary"
                iconBefore={<BsEye />}
                iconAfter={<BsArrowRight />}
              >
                Ver Solicitações
              </Button>
            </Link>
            <Link href="/criar-solicitacao">
              <Button variant="secondary" iconBefore={<BsHeart />}>
                Cadastrar Solicitação
              </Button>
            </Link>
          </div>

          <div className={styles.stats}>
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
        </div>

        <div className={styles.imageWrapper}>
          <div className={styles.imageContainer}>
            <div className={styles.imageDecoration}></div>
            <Image
              width={700}
              height={700}
              alt="Pessoas doando sangue e salvando vidas"
              src="/assets/images/topo.jpg"
              className={styles.heroImage}
              priority={true}
            />
          </div>

          <div className={styles.floatingCard}>
            <div className={styles.floatingCardIcon}>
              <BsHeart />
            </div>
            <div className={styles.floatingCardContent}>
              <p className={styles.floatingCardTitle}>Faça a diferença</p>
              <p className={styles.floatingCardText}>
                Uma doação pode salvar até 4 vidas
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
