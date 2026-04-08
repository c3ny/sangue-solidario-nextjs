"use client";

import React from "react";
import { BsArrowLeft, BsArrowRight, BsCheckCircleFill } from "react-icons/bs";
import styles from "../styles.module.scss";
import { Bold } from "@/components/Bold";
import { logger } from "@/utils/logger";
import { useCriarSolicitacao, TOTAL_STEPS } from "./useCriarSolicitacao";
import { WizardStepper, WIZARD_STEPS } from "./WizardStepper";
import { StepPatientData } from "./StepPatientData";
import { StepDonationInfo } from "./StepDonationInfo";
import { StepLocationPeriod } from "./StepLocationPeriod";
import { StepExtraInfo } from "./StepExtraInfo";

export default function CriarSolicitacao() {
  const {
    state,
    dispatch,
    goNext,
    goPrev,
    triggerSubmit,
    handleGenerateDescription,
    handleImageChange,
    handleRemoveImage,
  } = useCriarSolicitacao();

  const { currentStep, formData, locationData, isSubmitting, isGenerating, selectedImage, imagePreview, imageError, validationErrors } = state;

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            Criar Solicitação de <Bold>Doação</Bold>
          </h1>
          <p className={styles.subtitle}>
            Preencha as informações necessárias para que doadores possam encontrar sua
            solicitação e ajudar quem precisa.
          </p>
        </div>

        <WizardStepper steps={WIZARD_STEPS} currentStep={currentStep} />

        <div
          role="form"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const target = e.target as HTMLElement;
              const tag = target.tagName.toLowerCase();
              const type = (target as HTMLInputElement).type;
              if (
                tag !== "textarea" &&
                !(tag === "button" && type === "submit" && currentStep === TOTAL_STEPS)
              ) {
                e.preventDefault();
                logger.warn(`Enter bloqueado no campo: <${tag} type="${type}">`);
              }
            }
          }}
          className={styles.form}
        >
          <div className={styles.formCard}>
            {currentStep === 1 && (
              <StepPatientData
                nome={formData.nome}
                error={validationErrors.nome}
                onChange={(value) => dispatch({ type: "UPDATE_NOME", payload: value })}
              />
            )}

            {currentStep === 2 && (
              <StepDonationInfo
                tipoSanguineo={formData.tipoSanguineo}
                quantidade={formData.quantidade}
                errors={{
                  tipoSanguineo: validationErrors.tipoSanguineo,
                  quantidade: validationErrors.quantidade,
                }}
                onChange={(field, value) => {
                  if (field === "tipoSanguineo") {
                    dispatch({ type: "UPDATE_TIPO_SANGUINEO", payload: value });
                  } else {
                    dispatch({ type: "UPDATE_QUANTIDADE", payload: Number(value) });
                  }
                }}
              />
            )}

            {currentStep === 3 && (
              <StepLocationPeriod
                endereco={formData.endereco}
                datainicio={formData.datainicio}
                datatermino={formData.datatermino}
                locationData={locationData}
                errors={{
                  endereco: validationErrors.endereco,
                  datainicio: validationErrors.datainicio,
                  datatermino: validationErrors.datatermino,
                }}
                onEnderecoChange={(value) =>
                  dispatch({ type: "UPDATE_ENDERECO", payload: value })
                }
                onSelectLocation={(suggestion) =>
                  dispatch({ type: "SET_LOCATION", payload: { suggestion } })
                }
                onClearLocation={() => {
                  dispatch({ type: "SET_LOCATION", payload: null });
                  dispatch({ type: "UPDATE_ENDERECO", payload: "" });
                }}
                onDatainicioChange={(value) =>
                  dispatch({ type: "UPDATE_DATAINICIO", payload: value })
                }
                onDataterminoChange={(value) =>
                  dispatch({ type: "UPDATE_DATATERMINO", payload: value })
                }
              />
            )}

            {currentStep === 4 && (
              <StepExtraInfo
                content={formData.content}
                selectedImage={selectedImage}
                imagePreview={imagePreview}
                imageError={imageError}
                isGenerating={isGenerating}
                onContentChange={(value) =>
                  dispatch({ type: "UPDATE_CONTENT", payload: value })
                }
                onGenerateDescription={handleGenerateDescription}
                onImageChange={handleImageChange}
                onRemoveImage={handleRemoveImage}
              />
            )}
          </div>

          <div className={styles.navigation}>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={goPrev}
                onMouseDown={(e) => e.preventDefault()}
                className={`${styles.button} ${styles.buttonSecondary}`}
              >
                <BsArrowLeft className={styles.buttonIcon} />
                Voltar
              </button>
            )}

            {currentStep < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={goNext}
                onMouseDown={(e) => e.preventDefault()}
                className={`${styles.button} ${styles.buttonPrimary}`}
              >
                Próximo
                <BsArrowRight className={styles.buttonIcon} />
              </button>
            ) : (
              <button
                type="button"
                onClick={triggerSubmit}
                className={`${styles.button} ${styles.buttonPrimary}`}
              >
                <BsCheckCircleFill className={styles.buttonIcon} />
                {isSubmitting ? "Enviando..." : "Criar Solicitação"}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
