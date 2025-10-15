import styles from "./styles.module.scss";
import {
  BsFileEarmarkPlus,
  BsGeoAlt,
  BsBell,
  BsArrowRight,
  BsPlusCircle,
  BsListUl,
} from "react-icons/bs";

/**
 * StepByStep Component
 * Explains the blood solicitation process on the Sangue Solidário platform
 */
export const StepByStepSection = () => {
  const steps = [
    {
      number: 1,
      Icon: BsFileEarmarkPlus,
      title: "Criar Solicitação",
      description:
        "Hospitais, hemocentros ou usuários criam uma solicitação de sangue informando o tipo sanguíneo necessário e a urgência do caso.",
      color: "danger",
    },
    {
      number: 2,
      Icon: BsGeoAlt,
      title: "Localizar o Hospital",
      description:
        "A solicitação é registrada com a localização exata do hospital onde o paciente está internado, facilitando o deslocamento dos doadores.",
      color: "primary",
    },
    {
      number: 3,
      Icon: BsBell,
      title: "Notificar Doadores",
      description:
        "Doadores compatíveis nas proximidades são notificados automaticamente através da plataforma, tornando o processo rápido e eficiente.",
      color: "success",
    },
  ];

  return (
    <div className={styles.stepByStepSection} id="como-funciona">
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Como Funciona</h2>
        <p className={styles.headerSubtitle}>
          Entenda o processo simplificado de solicitação e doação de sangue
        </p>
      </div>

      <div className={styles.stepsContainer}>
        {steps.map((step, index) => {
          const { Icon } = step;
          return (
            <div key={step.number} className={styles.stepCard}>
              <div className={styles.stepNumber}>
                <span
                  className={`${styles.badge} ${
                    styles[
                      `badge${
                        step.color.charAt(0).toUpperCase() + step.color.slice(1)
                      }`
                    ]
                  }`}
                >
                  {step.number}
                </span>
              </div>

              <div className={styles.iconWrapper}>
                <div
                  className={`${styles.iconCircle} ${
                    styles[
                      `iconCircle${
                        step.color.charAt(0).toUpperCase() + step.color.slice(1)
                      }`
                    ]
                  }`}
                >
                  <Icon
                    className={`${styles.icon} ${
                      styles[
                        `icon${
                          step.color.charAt(0).toUpperCase() +
                          step.color.slice(1)
                        }`
                      ]
                    }`}
                  />
                </div>
              </div>

              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>

              {index < steps.length - 1 && (
                <div className={styles.connector}>
                  <BsArrowRight className={styles.connectorIcon} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.callToAction}>
        <p className={styles.callToActionText}>
          <strong>Pronto para fazer a diferença?</strong>
        </p>
        <div className={styles.buttonGroup}>
          <a
            href="/criar-solicitacao"
            className={`${styles.button} ${styles.buttonPrimary}`}
          >
            <BsPlusCircle className={styles.buttonIcon} />
            Criar Solicitação
          </a>
          <a
            href="/solicitacoes"
            className={`${styles.button} ${styles.buttonOutline}`}
          >
            <BsListUl className={styles.buttonIcon} />
            Ver Solicitações
          </a>
        </div>
      </div>
    </div>
  );
};
