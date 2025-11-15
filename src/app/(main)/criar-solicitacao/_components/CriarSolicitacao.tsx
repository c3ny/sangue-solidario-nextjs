"use client";

import React, { useState } from "react";
import {
  BsPersonFill,
  BsDropletFill,
  BsGeoAltFill,
  BsImageFill,
  BsCheckCircleFill,
  BsArrowLeft,
  BsArrowRight,
} from "react-icons/bs";
import styles from "../styles.module.scss";
import { donationsClientService } from "@/features/Solicitations/services/donations.client.service";
import { useRouter } from "next/navigation";
import { AddressSearch, ISuggestion } from "@/components/AddressSearch";
import { SelectedAddress } from "@/components/SelectedAddress";
import { getCurrentUserClient } from "@/utils/auth.client";
import { Bold } from "@/components/Bold";

export default function CriarSolicitacao() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [formData, setFormData] = useState({
    nome: "",
    tipoSanguineo: "",
    quantidade: 1,
    endereco: "",
    datainicio: "",
    datatermino: "",
    content: "",
  });

  const [locationData, setLocationData] = useState<{
    suggestion: ISuggestion;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { number: 1, title: "Dados do Paciente", icon: BsPersonFill },
    { number: 2, title: "Doação", icon: BsDropletFill },
    { number: 3, title: "Local e Período", icon: BsGeoAltFill },
    { number: 4, title: "Informações Extras", icon: BsImageFill },
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((s) => s + 1);

      try {
        (document.activeElement as HTMLElement)?.blur();
      } catch {}
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const submitNonceRef = React.useRef<string | null>(null);

  const performSubmit = async (nonce?: string) => {
    if (!nonce || submitNonceRef.current !== nonce) {
      return;
    }
    submitNonceRef.current = null;
    if (currentStep < totalSteps) {
      return;
    }
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    const user = getCurrentUserClient();
    if (!user || !user.id) {
      console.error("User not authenticated");
      setIsSubmitting(false);
      return;
    }

    if (
      !locationData ||
      !locationData.suggestion?.latitude ||
      !locationData.suggestion?.longitude
    ) {
      console.error("Location data is required");
      alert("Por favor, selecione um endereço válido usando a busca.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      status: "PENDING",
      content:
        formData.content ||
        `Solicitação de doação de sangue tipo ${formData.tipoSanguineo}`,
      startDate: formData.datainicio || new Date().toISOString(),
      finishDate: formData.datatermino || undefined,
      bloodType: formData.tipoSanguineo,
      location: {
        name: locationData.suggestion.name,
        address: locationData.suggestion.full_address,
        latitude: locationData.suggestion.latitude,
        longitude: locationData.suggestion.longitude,
      },
      userId: user.id,
      name: formData.nome,
    };

    try {
      const result = await donationsClientService.createDonation(payload);

      if (!isMounted.current) return;

      if (!result) {
        setTimeout(() => {
          if (!isMounted.current) return;
          setFormData({
            nome: "",
            tipoSanguineo: "",
            quantidade: 1,
            endereco: "",
            datainicio: "",
            datatermino: "",
            content: "",
          });
          setLocationData(null);
          setCurrentStep(1);
        }, 50);
        console.error("Erro ao criar solicitação");
      } else {
        router.push(`/visualizar-solicitacao/${result.id}`);
      }
    } catch (error) {
      console.error("💥 Erro no envio:", error);
    } finally {
      if (isMounted.current) setIsSubmitting(false);
    }
  };
  const isMounted = React.useRef(true);
  const formRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            Criar Solicitação de
            <Bold>Doação</Bold>
          </h1>
          <p className={styles.subtitle}>
            Preencha as informações necessárias para que doadores possam
            encontrar sua solicitação e ajudar quem precisa.
          </p>
        </div>

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

        <div
          ref={(el) => {
            formRef.current = el as HTMLDivElement;
            return;
          }}
          role="form"
          onSubmit={handleSubmit as any}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const target = e.target as HTMLElement;
              const tag = target.tagName.toLowerCase();
              const type = (target as HTMLInputElement).type;

              if (
                tag !== "textarea" &&
                !(
                  tag === "button" &&
                  type === "submit" &&
                  currentStep === totalSteps
                )
              ) {
                e.preventDefault();
                console.warn(
                  `⛔ Enter bloqueado no campo: <${tag} type="${type}">. Submit prevented.`
                );
              }
            }
          }}
          className={styles.form}
        >
          <div className={styles.formCard}>
            {currentStep === 1 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepHeading}>
                  <BsPersonFill className={styles.headingIcon} />
                  Dados do Paciente
                </h2>
                <div className={styles.formSingleGrid}>
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
                      value={formData.nome}
                      onChange={(e) => handleChange("nome", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

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
                      value={formData.tipoSanguineo}
                      onChange={(e) =>
                        handleChange("tipoSanguineo", e.target.value)
                      }
                      required
                    >
                      <option value="" disabled>
                        Selecione o tipo sanguíneo
                      </option>
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
                      value={formData.quantidade}
                      onChange={(e) =>
                        handleChange("quantidade", e.target.value)
                      }
                      required
                    />
                    <span className={styles.helpText}>
                      Quantidade necessária para a transfusão
                    </span>
                  </div>
                </div>
              </div>
            )}

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
                    <AddressSearch
                      id="endereco"
                      value={formData.endereco}
                      onChange={(value) => handleChange("endereco", value)}
                      onSelect={(result: ISuggestion) => {
                        setLocationData({ suggestion: result });
                      }}
                      placeholder="Buscar hospital, clínica ou hemocentro..."
                      required
                      helpText="Informe o local onde a doação deve ser realizada"
                    />
                    {locationData?.suggestion && (
                      <SelectedAddress
                        suggestion={locationData.suggestion}
                        onClear={() => {
                          setLocationData(null);
                          handleChange("endereco", "");
                        }}
                      />
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="datainicio" className={styles.label}>
                      Data de início
                    </label>
                    <input
                      type="date"
                      className={styles.input}
                      id="datainicio"
                      value={formData.datainicio}
                      onChange={(e) =>
                        handleChange("datainicio", e.target.value)
                      }
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
                      value={formData.datatermino}
                      onChange={(e) =>
                        handleChange("datatermino", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepHeading}>
                  <BsImageFill className={styles.headingIcon} />
                  Informações Complementares
                </h2>
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="content" className={styles.label}>
                      Descrição da solicitação
                    </label>
                    <textarea
                      className={styles.textarea}
                      id="content"
                      rows={5}
                      placeholder="Adicione informações adicionais que possam ajudar os doadores (opcional)"
                      value={formData.content}
                      onChange={(e) => handleChange("content", e.target.value)}
                    ></textarea>
                    <span className={styles.helpText}>
                      Informações sobre a urgência, histórico ou condições
                      especiais
                    </span>
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="image" className={styles.label}>
                      Foto do paciente (opcional)
                    </label>
                    <div className={styles.fileUpload}>
                      <input
                        className={styles.fileInput}
                        type="file"
                        id="image"
                        accept="image/*"
                      />
                      <label htmlFor="image" className={styles.fileLabel}>
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

          <div className={styles.navigation}>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                onMouseDown={(e) => e.preventDefault()}
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
                onMouseDown={(e) => e.preventDefault()}
                className={`${styles.button} ${styles.buttonPrimary}`}
              >
                Próximo
                <BsArrowRight className={styles.buttonIcon} />
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  if (!(e as React.MouseEvent).isTrusted) {
                    console.warn(
                      "⛔ Click não confiável bloqueado (isTrusted=false)"
                    );
                    return;
                  }
                  const nonce = Math.random().toString(36).slice(2, 10);
                  submitNonceRef.current = nonce;
                  performSubmit(nonce);
                }}
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
