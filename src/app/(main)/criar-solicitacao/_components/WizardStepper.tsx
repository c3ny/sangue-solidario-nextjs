import { BsCheckCircleFill, BsPersonFill, BsDropletFill, BsGeoAltFill, BsImageFill } from "react-icons/bs";
import { IconType } from "react-icons";
import styles from "../styles.module.scss";

interface Step {
  number: number;
  title: string;
  icon: IconType;
}

interface WizardStepperProps {
  steps: Step[];
  currentStep: number;
}

export function WizardStepper({ steps, currentStep }: WizardStepperProps) {
  return (
    <div className={styles.stepper}>
      {steps.map((step, index) => {
        const StepIcon = step.icon;
        const isActive = currentStep === step.number;
        const isCompleted = currentStep > step.number;

        return (
          <div key={step.number} className={styles.stepItem}>
            <div
              className={`${styles.stepCircle} ${isActive ? styles.active : ""} ${
                isCompleted ? styles.completed : ""
              }`}
            >
              {isCompleted ? (
                <BsCheckCircleFill className={styles.checkIcon} />
              ) : (
                <StepIcon className={styles.stepIcon} />
              )}
            </div>
            <div className={styles.stepLabel}>
              <span className={styles.stepNumber}>Passo {step.number}</span>
              <span className={styles.stepTitle}>{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`${styles.stepLine} ${isCompleted ? styles.completed : ""}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export const WIZARD_STEPS: Step[] = [
  { number: 1, title: "Dados do Paciente", icon: BsPersonFill },
  { number: 2, title: "Doação", icon: BsDropletFill },
  { number: 3, title: "Local e Período", icon: BsGeoAltFill },
  { number: 4, title: "Informações Extras", icon: BsImageFill },
];
