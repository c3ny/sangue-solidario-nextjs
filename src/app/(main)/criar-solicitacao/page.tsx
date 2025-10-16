"use client";

import { useState } from "react";
import {
  BsPersonFill,
  BsDropletFill,
  BsGeoAltFill,
  BsImageFill,
  BsCheckCircleFill,
  BsArrowLeft,
  BsArrowRight,
} from "react-icons/bs";
import styles from "./styles.module.scss";

export const dynamic = "force-dynamic";

export default function CriarSolicitacao() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const steps = [
    { number: 1, title: "Dados do Paciente", icon: BsPersonFill },
    { number: 2, title: "Doação", icon: BsDropletFill },
    { number: 3, title: "Local e Período", icon: BsGeoAltFill },
    { number: 4, title: "Informações Extras", icon: BsImageFill },
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted");
  };

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            Criar Solicitação de
            <span className={styles.highlight}>Doação</span>
          </h1>
          <p className={styles.subtitle}>
            Preencha as informações necessárias para que doadores possam
            encontrar sua solicitação e ajudar quem precisa.
          </p>
        </div>

        {/* Progress Stepper */}
        <div className={styles.stepper}>
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;

            return (
              <div key={step.number} className={styles.stepItem}>
                <div
                  className={`${styles.stepCircle} ${
                    isActive ? styles.active : ""
                  } ${isCompleted ? styles.completed : ""}`}
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
                    className={`${styles.stepLine} ${
                      isCompleted ? styles.completed : ""
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formCard}>
            {/* Step 1: Patient Data */}
            {currentStep === 1 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepHeading}>
                  <BsPersonFill className={styles.headingIcon} />
                  Dados do Paciente
                </h2>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="nome" className={styles.label}>
                      Nome do paciente
                      <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      className={styles.input}
                      id="nome"
                      placeholder="Digite o nome completo"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="telefone" className={styles.label}>
                      Telefone para contato
                      <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="tel"
                      className={styles.input}
                      id="telefone"
                      placeholder="(00) 00000-0000"
                      required
                    />
                    <span className={styles.helpText}>
                      Número para contato sobre a doação
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Blood Info */}
            {currentStep === 2 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepHeading}>
                  <BsDropletFill className={styles.headingIcon} />
                  Informações sobre a Doação
                </h2>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="tipoSanguineo" className={styles.label}>
                      Tipo sanguíneo <span className={styles.required}>*</span>
                    </label>
                    <select
                      className={styles.select}
                      id="tipoSanguineo"
                      required
                      defaultValue=""
                    >
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

                  <div className={styles.formGroup}>
                    <label htmlFor="quantidade" className={styles.label}>
                      Quantidade de bolsas
                      <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="number"
                      className={styles.input}
                      id="quantidade"
                      placeholder="Ex: 2"
                      min="1"
                      required
                    />
                    <span className={styles.helpText}>
                      Quantidade necessária para a transfusão
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Location & Period */}
            {currentStep === 3 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepHeading}>
                  <BsGeoAltFill className={styles.headingIcon} />
                  Local e Período
                </h2>
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="endereco" className={styles.label}>
                      Endereço para doação
                      <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      className={styles.input}
                      id="endereco"
                      placeholder="Hospital, clínica ou hemocentro"
                      required
                    />
                    <span className={styles.helpText}>
                      Informe o local onde a doação deve ser realizada
                    </span>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="datainicio" className={styles.label}>
                      Data de início
                    </label>
                    <input
                      type="date"
                      className={styles.input}
                      id="datainicio"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="datatermino" className={styles.label}>
                      Data de término
                    </label>
                    <input
                      type="date"
                      className={styles.input}
                      id="datatermino"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Extra Info */}
            {currentStep === 4 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepHeading}>
                  <BsImageFill className={styles.headingIcon} />
                  Informações Complementares
                </h2>
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="descricao" className={styles.label}>
                      Descrição da solicitação
                    </label>
                    <textarea
                      className={styles.textarea}
                      id="descricao"
                      rows={5}
                      placeholder="Adicione informações adicionais que possam ajudar os doadores (opcional)"
                    ></textarea>
                    <span className={styles.helpText}>
                      Informações sobre a urgência, histórico ou condições
                      especiais
                    </span>
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="formFile" className={styles.label}>
                      Foto do paciente (opcional)
                    </label>
                    <div className={styles.fileUpload}>
                      <input
                        className={styles.fileInput}
                        type="file"
                        id="formFile"
                        accept="image/*"
                      />
                      <label htmlFor="formFile" className={styles.fileLabel}>
                        <BsImageFill className={styles.fileIcon} />
                        <span className={styles.fileText}>
                          Clique para selecionar uma imagem
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className={styles.navigation}>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className={`${styles.button} ${styles.buttonSecondary}`}
              >
                <BsArrowLeft className={styles.buttonIcon} />
                Voltar
              </button>
            )}

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className={`${styles.button} ${styles.buttonPrimary}`}
              >
                Próximo
                <BsArrowRight className={styles.buttonIcon} />
              </button>
            ) : (
              <button
                type="submit"
                className={`${styles.button} ${styles.buttonPrimary}`}
              >
                <BsCheckCircleFill className={styles.buttonIcon} />
                Criar Solicitação
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
