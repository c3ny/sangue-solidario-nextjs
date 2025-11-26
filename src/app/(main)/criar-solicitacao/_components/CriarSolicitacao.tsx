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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState<{
    nome?: string;
    tipoSanguineo?: string;
    quantidade?: string;
    endereco?: string;
    datainicio?: string;
    datatermino?: string;
  }>({});

  const steps = [
    { number: 1, title: "Dados do Paciente", icon: BsPersonFill },
    { number: 2, title: "Doação", icon: BsDropletFill },
    { number: 3, title: "Local e Período", icon: BsGeoAltFill },
    { number: 4, title: "Informações Extras", icon: BsImageFill },
  ];

  /**
   * Validate form data for the current step
   */
  const validateStep = (step: number): boolean => {
    const errors: typeof validationErrors = {};

    if (step === 1) {
      // Step 1: Patient Data
      if (!formData.nome || !formData.nome.trim()) {
        errors.nome = "Nome do paciente é obrigatório";
      } else if (formData.nome.trim().length < 3) {
        errors.nome = "Nome deve ter pelo menos 3 caracteres";
      }
    }

    if (step === 2) {
      // Step 2: Donation Info
      if (!formData.tipoSanguineo) {
        errors.tipoSanguineo = "Tipo sanguíneo é obrigatório";
      }

      if (!formData.quantidade || formData.quantidade < 1) {
        errors.quantidade = "Quantidade deve ser pelo menos 1";
      }
    }

    if (step === 3) {
      // Step 3: Location and Period
      if (!formData.endereco || !formData.endereco.trim()) {
        errors.endereco = "Endereço é obrigatório";
      }

      if (!locationData) {
        errors.endereco =
          "Por favor, selecione um endereço válido usando a busca";
      }

      // Validate dates if provided
      if (formData.datainicio && formData.datatermino) {
        const startDate = new Date(formData.datainicio);
        const endDate = new Date(formData.datatermino);

        if (endDate < startDate) {
          errors.datatermino =
            "Data de término deve ser posterior à data de início";
        }
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Validate all required fields before submission
   */
  const validateAllFields = (): boolean => {
    const errors: typeof validationErrors = {};

    // Step 1 validations
    if (!formData.nome || !formData.nome.trim()) {
      errors.nome = "Nome do paciente é obrigatório";
    } else if (formData.nome.trim().length < 3) {
      errors.nome = "Nome deve ter pelo menos 3 caracteres";
    }

    // Step 2 validations
    if (!formData.tipoSanguineo) {
      errors.tipoSanguineo = "Tipo sanguíneo é obrigatório";
    }

    if (!formData.quantidade || formData.quantidade < 1) {
      errors.quantidade = "Quantidade deve ser pelo menos 1";
    }

    // Step 3 validations
    if (!formData.endereco || !formData.endereco.trim()) {
      errors.endereco = "Endereço é obrigatório";
    }

    if (!locationData) {
      errors.endereco =
        "Por favor, selecione um endereço válido usando a busca";
    }

    if (formData.datainicio && formData.datatermino) {
      const startDate = new Date(formData.datainicio);
      const endDate = new Date(formData.datatermino);

      if (endDate < startDate) {
        errors.datatermino =
          "Data de término deve ser posterior à data de início";
      }
    }

    setValidationErrors(errors);

    // If there are errors, scroll to first error and show which step has the error
    if (Object.keys(errors).length > 0) {
      // Determine which step has errors and navigate to it
      if (errors.nome) {
        setCurrentStep(1);
      } else if (errors.tipoSanguineo || errors.quantidade) {
        setCurrentStep(2);
      } else if (errors.endereco || errors.datainicio || errors.datatermino) {
        setCurrentStep(3);
      }
    }

    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    // Validate current step before proceeding
    if (!validateStep(currentStep)) {
      return;
    }

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
    const updatedFormData = { ...formData, [field]: value };

    if (field === "datainicio" && value && formData.datatermino) {
      const newStartDate = new Date(value);
      const currentEndDate = new Date(formData.datatermino);

      if (newStartDate > currentEndDate) {
        updatedFormData.datatermino = value;
      }
    }

    if (field === "datatermino" && value && formData.datainicio) {
      const newEndDate = new Date(value);
      const currentStartDate = new Date(formData.datainicio);

      if (newEndDate < currentStartDate) {
        updatedFormData.datainicio = value;
      }
    }

    setFormData(updatedFormData);

    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }

    if (field === "datainicio" || field === "datatermino") {
      setValidationErrors((prev) => ({
        ...prev,
        datainicio: undefined,
        datatermino: undefined,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(null);

    if (!file) {
      setSelectedImage(null);
      setImagePreview(null);
      return;
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setImageError("Apenas imagens JPG, PNG ou WEBP são permitidas");
      setSelectedImage(null);
      setImagePreview(null);
      e.target.value = ""; // Clear input
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setImageError("A imagem deve ter no máximo 5MB");
      setSelectedImage(null);
      setImagePreview(null);
      e.target.value = ""; // Clear input
      return;
    }

    setSelectedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setImageError(null);
    // Clear file input
    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
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

    // Validate all fields before submission
    if (!validateAllFields()) {
      alert("Por favor, preencha todos os campos obrigatórios corretamente.");
      return;
    }

    setIsSubmitting(true);

    const user = getCurrentUserClient();

    if (!user || !user.id) {
      console.error("User not authenticated");
      alert("Você precisa estar autenticado para criar uma solicitação.");
      setIsSubmitting(false);
      return;
    }

    if (!locationData) {
      console.error("Location data is required");
      alert("Por favor, selecione um endereço válido usando a busca.");
      setIsSubmitting(false);
      return;
    }

    const baseUrl = "https://api.mapbox.com/search/geocode/v6/forward";

    const params = new URLSearchParams({
      access_token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "",
      q: locationData.suggestion.full_address,
    });

    const response = await fetch(`${baseUrl}?${params.toString()}`);

    if (!response.ok) {
      console.error("Failed to geocode location");
      setIsSubmitting(false);
      return;
    }

    const data = await response.json();

    const location = data.features[0];

    if (!location) {
      console.error("No location found");
      setIsSubmitting(false);
      return;
    }

    const latitude = location.geometry.coordinates[1];
    const longitude = location.geometry.coordinates[0];

    const donationData = {
      status: "PENDING",
      content:
        formData.content ||
        `Solicitação de doação de sangue tipo ${formData.tipoSanguineo}`,
      startDate: formData.datainicio || new Date().toISOString(),
      finishDate: formData.datatermino || undefined,
      bloodType: formData.tipoSanguineo,
      quantity: formData.quantidade,
      location: {
        latitude: latitude,
        longitude: longitude,
        name: locationData.suggestion.name,
        address: locationData.suggestion.full_address,
      },
      userId: user.id,
      name: formData.nome,
    };

    try {
      const result = selectedImage
        ? await donationsClientService.createDonationWithFormData(
            donationData,
            selectedImage
          )
        : await donationsClientService.createDonation({
            ...donationData,
            image: undefined,
          });

      if (!result || !result.id) {
        console.error(
          "❌ Erro ao criar solicitação: resultado inválido",
          result
        );
        alert("Erro ao criar solicitação. Por favor, tente novamente.");
        if (isMounted.current) {
          setIsSubmitting(false);
        }
        return;
      }

      const redirectUrl = `/visualizar-solicitacao/${result.id}`;

      if (isMounted.current) {
        setIsSubmitting(false);
      }

      try {
        router.push(redirectUrl);
      } catch (redirectError) {
        console.error(
          "Erro ao redirecionar com router.push, usando window.location:",
          redirectError
        );
        window.location.href = redirectUrl;
      }
    } catch (error) {
      console.error("💥 Erro no envio:", error);
      alert("Erro ao criar solicitação. Por favor, tente novamente.");
      if (isMounted.current) {
        setIsSubmitting(false);
      }
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
                      className={`${styles.input} ${
                        validationErrors.nome ? styles.inputError : ""
                      }`}
                      id="nome"
                      placeholder="Digite o nome completo"
                      value={formData.nome}
                      onChange={(e) => handleChange("nome", e.target.value)}
                      required
                      aria-invalid={validationErrors.nome ? "true" : "false"}
                      aria-describedby={
                        validationErrors.nome ? "nome-error" : undefined
                      }
                    />
                    {validationErrors.nome && (
                      <span
                        id="nome-error"
                        className={styles.error}
                        role="alert"
                      >
                        {validationErrors.nome}
                      </span>
                    )}
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
                      className={`${styles.select} ${
                        validationErrors.tipoSanguineo ? styles.inputError : ""
                      }`}
                      id="tipoSanguineo"
                      value={formData.tipoSanguineo}
                      onChange={(e) =>
                        handleChange("tipoSanguineo", e.target.value)
                      }
                      required
                      aria-invalid={
                        validationErrors.tipoSanguineo ? "true" : "false"
                      }
                      aria-describedby={
                        validationErrors.tipoSanguineo
                          ? "tipoSanguineo-error"
                          : undefined
                      }
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
                    {validationErrors.tipoSanguineo && (
                      <span
                        id="tipoSanguineo-error"
                        className={styles.error}
                        role="alert"
                      >
                        {validationErrors.tipoSanguineo}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="quantidade" className={styles.label}>
                      Quantidade de bolsas
                      <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="number"
                      className={`${styles.input} ${
                        validationErrors.quantidade ? styles.inputError : ""
                      }`}
                      id="quantidade"
                      placeholder="Ex: 2"
                      min="1"
                      value={formData.quantidade}
                      onChange={(e) =>
                        handleChange("quantidade", e.target.value)
                      }
                      required
                      aria-invalid={
                        validationErrors.quantidade ? "true" : "false"
                      }
                      aria-describedby={
                        validationErrors.quantidade
                          ? "quantidade-error"
                          : undefined
                      }
                    />
                    {validationErrors.quantidade && (
                      <span
                        id="quantidade-error"
                        className={styles.error}
                        role="alert"
                      >
                        {validationErrors.quantidade}
                      </span>
                    )}
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
                        setValidationErrors((prev) => ({
                          ...prev,
                          endereco: undefined,
                        }));
                      }}
                      placeholder="Buscar hospital, clínica ou hemocentro..."
                      required
                      helpText="Informe o local onde a doação deve ser realizada"
                    />
                    {validationErrors.endereco && (
                      <span
                        id="endereco-error"
                        className={styles.error}
                        role="alert"
                      >
                        {validationErrors.endereco}
                      </span>
                    )}
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
                      className={`${styles.input} ${
                        validationErrors.datainicio ? styles.inputError : ""
                      }`}
                      id="datainicio"
                      value={formData.datainicio}
                      max={formData.datatermino || undefined}
                      onChange={(e) =>
                        handleChange("datainicio", e.target.value)
                      }
                      aria-invalid={
                        validationErrors.datainicio ? "true" : "false"
                      }
                      aria-describedby={
                        validationErrors.datainicio
                          ? "datainicio-error"
                          : undefined
                      }
                    />
                    {validationErrors.datainicio && (
                      <span
                        id="datainicio-error"
                        className={styles.error}
                        role="alert"
                      >
                        {validationErrors.datainicio}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="datatermino" className={styles.label}>
                      Data de término
                    </label>
                    <input
                      type="date"
                      className={`${styles.input} ${
                        validationErrors.datatermino ? styles.inputError : ""
                      }`}
                      id="datatermino"
                      value={formData.datatermino}
                      min={formData.datainicio || undefined}
                      onChange={(e) =>
                        handleChange("datatermino", e.target.value)
                      }
                      aria-invalid={
                        validationErrors.datatermino ? "true" : "false"
                      }
                      aria-describedby={
                        validationErrors.datatermino
                          ? "datatermino-error"
                          : undefined
                      }
                    />
                    {validationErrors.datatermino && (
                      <span
                        id="datatermino-error"
                        className={styles.error}
                        role="alert"
                      >
                        {validationErrors.datatermino}
                      </span>
                    )}
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
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageChange}
                      />
                      <label htmlFor="image" className={styles.fileLabel}>
                        <BsImageFill className={styles.fileIcon} />
                        <span className={styles.fileText}>
                          {selectedImage
                            ? selectedImage.name
                            : "Clique para selecionar uma imagem"}
                        </span>
                      </label>
                    </div>
                    {imageError && (
                      <span className={styles.error} role="alert">
                        {imageError}
                      </span>
                    )}
                    {imagePreview && (
                      <div className={styles.imagePreview}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imagePreview}
                          alt="Preview da imagem selecionada"
                          className={styles.previewImage}
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className={styles.removeImageButton}
                          aria-label="Remover imagem"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    <span className={styles.helpText}>
                      Formatos aceitos: JPG, PNG, WEBP (máximo 5MB)
                    </span>
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
