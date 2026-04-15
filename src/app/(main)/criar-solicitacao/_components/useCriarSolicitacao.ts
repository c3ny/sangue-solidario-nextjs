"use client";

import { useReducer, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ISuggestion } from "@/components/AddressSearch";
import {
  createDonationAction,
  uploadDonationImageAction,
} from "@/actions/donation/donation-actions";
import { getCurrentUserClient } from "@/utils/auth.client";
import {
  isEndAfterOrEqualStart,
  isFutureOrToday,
} from "@/utils/date-validation";
import { logger } from "@/utils/logger";
import React from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FormData = {
  nome: string;
  tipoSanguineo: string;
  quantidade: number;
  endereco: string;
  datainicio: string;
  datatermino: string;
  content: string;
};

export type ValidationErrors = {
  nome?: string;
  tipoSanguineo?: string;
  quantidade?: string;
  endereco?: string;
  datainicio?: string;
  datatermino?: string;
};

export type WizardState = {
  currentStep: number;
  formData: FormData;
  locationData: { suggestion: ISuggestion } | null;
  isSubmitting: boolean;
  isGenerating: boolean;
  selectedImage: File | null;
  imagePreview: string | null;
  imageError: string | null;
  validationErrors: ValidationErrors;
};

// Actions typed per step/concern
export type WizardAction =
  // Navigation
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SET_STEP"; payload: number }
  // Step 1 — Patient data
  | { type: "UPDATE_NOME"; payload: string }
  // Step 2 — Donation info
  | { type: "UPDATE_TIPO_SANGUINEO"; payload: string }
  | { type: "UPDATE_QUANTIDADE"; payload: number }
  // Step 3 — Location & period
  | { type: "UPDATE_ENDERECO"; payload: string }
  | { type: "UPDATE_DATAINICIO"; payload: string }
  | { type: "UPDATE_DATATERMINO"; payload: string }
  | { type: "SET_LOCATION"; payload: { suggestion: ISuggestion } | null }
  // Step 4 — Extra info
  | { type: "UPDATE_CONTENT"; payload: string }
  | { type: "SET_IMAGE"; payload: { file: File; preview: string } }
  | { type: "REMOVE_IMAGE" }
  | { type: "SET_IMAGE_ERROR"; payload: string | null }
  // Validation
  | { type: "SET_VALIDATION_ERRORS"; payload: ValidationErrors }
  | { type: "CLEAR_FIELD_ERROR"; field: keyof ValidationErrors }
  // Async flags
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "SET_GENERATING"; payload: boolean };

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const TOTAL_STEPS = 4;

const initialState: WizardState = {
  currentStep: 1,
  formData: {
    nome: "",
    tipoSanguineo: "",
    quantidade: 1,
    endereco: "",
    datainicio: "",
    datatermino: "",
    content: "",
  },
  locationData: null,
  isSubmitting: false,
  isGenerating: false,
  selectedImage: null,
  imagePreview: null,
  imageError: null,
  validationErrors: {},
};

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    // Navigation
    case "NEXT_STEP":
      return state.currentStep < TOTAL_STEPS
        ? { ...state, currentStep: state.currentStep + 1 }
        : state;
    case "PREV_STEP":
      return state.currentStep > 1
        ? { ...state, currentStep: state.currentStep - 1 }
        : state;
    case "SET_STEP":
      return { ...state, currentStep: action.payload };

    // Step 1
    case "UPDATE_NOME":
      return {
        ...state,
        formData: { ...state.formData, nome: action.payload },
        validationErrors: { ...state.validationErrors, nome: undefined },
      };

    // Step 2
    case "UPDATE_TIPO_SANGUINEO":
      return {
        ...state,
        formData: { ...state.formData, tipoSanguineo: action.payload },
        validationErrors: { ...state.validationErrors, tipoSanguineo: undefined },
      };
    case "UPDATE_QUANTIDADE":
      return {
        ...state,
        formData: { ...state.formData, quantidade: action.payload },
        validationErrors: { ...state.validationErrors, quantidade: undefined },
      };

    // Step 3
    case "UPDATE_ENDERECO":
      return {
        ...state,
        formData: { ...state.formData, endereco: action.payload },
        validationErrors: { ...state.validationErrors, endereco: undefined },
      };
    case "UPDATE_DATAINICIO": {
      const updated = { ...state.formData, datainicio: action.payload };
      if (action.payload && state.formData.datatermino) {
        if (new Date(action.payload) > new Date(state.formData.datatermino)) {
          updated.datatermino = action.payload;
        }
      }
      return {
        ...state,
        formData: updated,
        validationErrors: {
          ...state.validationErrors,
          datainicio: undefined,
          datatermino: undefined,
        },
      };
    }
    case "UPDATE_DATATERMINO": {
      const updated = { ...state.formData, datatermino: action.payload };
      if (action.payload && state.formData.datainicio) {
        if (new Date(action.payload) < new Date(state.formData.datainicio)) {
          updated.datainicio = action.payload;
        }
      }
      return {
        ...state,
        formData: updated,
        validationErrors: {
          ...state.validationErrors,
          datainicio: undefined,
          datatermino: undefined,
        },
      };
    }
    case "SET_LOCATION":
      return {
        ...state,
        locationData: action.payload,
        validationErrors: { ...state.validationErrors, endereco: undefined },
      };

    // Step 4
    case "UPDATE_CONTENT":
      return { ...state, formData: { ...state.formData, content: action.payload } };
    case "SET_IMAGE":
      return {
        ...state,
        selectedImage: action.payload.file,
        imagePreview: action.payload.preview,
        imageError: null,
      };
    case "REMOVE_IMAGE":
      return { ...state, selectedImage: null, imagePreview: null, imageError: null };
    case "SET_IMAGE_ERROR":
      return {
        ...state,
        imageError: action.payload,
        selectedImage: null,
        imagePreview: null,
      };

    // Validation
    case "SET_VALIDATION_ERRORS":
      return { ...state, validationErrors: action.payload };
    case "CLEAR_FIELD_ERROR":
      return {
        ...state,
        validationErrors: { ...state.validationErrors, [action.field]: undefined },
      };

    // Async flags
    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.payload };
    case "SET_GENERATING":
      return { ...state, isGenerating: action.payload };

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

function validateStep(
  step: number,
  formData: FormData,
  locationData: WizardState["locationData"]
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (step === 1) {
    if (!formData.nome?.trim()) {
      errors.nome = "Nome do paciente é obrigatório";
    } else if (formData.nome.trim().length < 3) {
      errors.nome = "Nome deve ter pelo menos 3 caracteres";
    }
  }

  if (step === 2) {
    if (!formData.tipoSanguineo) errors.tipoSanguineo = "Tipo sanguíneo é obrigatório";
    if (!formData.quantidade || formData.quantidade < 1)
      errors.quantidade = "Quantidade deve ser pelo menos 1";
  }

  if (step === 3) {
    if (!locationData) {
      errors.endereco = "Por favor, selecione um endereço válido usando a busca";
    } else if (!formData.endereco?.trim()) {
      errors.endereco = "Endereço é obrigatório";
    }
    if (formData.datainicio && !isFutureOrToday(formData.datainicio)) {
      errors.datainicio = "Data de início não pode ser no passado";
    }
    if (
      formData.datainicio &&
      formData.datatermino &&
      !isEndAfterOrEqualStart(formData.datainicio, formData.datatermino)
    ) {
      errors.datatermino = "Data de término deve ser igual ou posterior à data de início";
    }
  }

  return errors;
}

function validateAll(
  formData: FormData,
  locationData: WizardState["locationData"]
): ValidationErrors {
  return {
    ...validateStep(1, formData, locationData),
    ...validateStep(2, formData, locationData),
    ...validateStep(3, formData, locationData),
  };
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useCriarSolicitacao() {
  const router = useRouter();
  const [state, dispatch] = useReducer(wizardReducer, initialState);
  const isMounted = useRef(true);
  const submitNonceRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const goNext = () => {
    const errors = validateStep(state.currentStep, state.formData, state.locationData);
    if (Object.keys(errors).length > 0) {
      dispatch({ type: "SET_VALIDATION_ERRORS", payload: errors });
      return;
    }
    dispatch({ type: "NEXT_STEP" });
    try {
      (document.activeElement as HTMLElement)?.blur();
    } catch {}
  };

  const goPrev = () => dispatch({ type: "PREV_STEP" });

  const handleGenerateDescription = async () => {
    dispatch({ type: "SET_GENERATING", payload: true });
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: state.formData.nome,
          tipoSanguineo: state.formData.tipoSanguineo,
          quantidade: state.formData.quantidade,
          endereco: state.formData.endereco,
          datainicio: state.formData.datainicio || undefined,
          datatermino: state.formData.datatermino || undefined,
        }),
      });
      if (!res.ok) throw new Error("Falha ao gerar descrição");
      const data = await res.json();
      if (data.text) dispatch({ type: "UPDATE_CONTENT", payload: data.text });
    } catch {
      alert("Não foi possível gerar a descrição com IA. Tente novamente.");
    } finally {
      dispatch({ type: "SET_GENERATING", payload: false });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      dispatch({ type: "REMOVE_IMAGE" });
      return;
    }
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      dispatch({
        type: "SET_IMAGE_ERROR",
        payload: "Apenas imagens JPG, PNG ou WEBP são permitidas",
      });
      e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      dispatch({ type: "SET_IMAGE_ERROR", payload: "A imagem deve ter no máximo 5MB" });
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      dispatch({
        type: "SET_IMAGE",
        payload: { file, preview: reader.result as string },
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    dispatch({ type: "REMOVE_IMAGE" });
    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const performSubmit = async (nonce?: string) => {
    if (!nonce || submitNonceRef.current !== nonce) return;
    submitNonceRef.current = null;

    if (state.currentStep < TOTAL_STEPS || state.isSubmitting) return;

    const allErrors = validateAll(state.formData, state.locationData);
    if (Object.keys(allErrors).length > 0) {
      dispatch({ type: "SET_VALIDATION_ERRORS", payload: allErrors });
      if (allErrors.nome) dispatch({ type: "SET_STEP", payload: 1 });
      else if (allErrors.tipoSanguineo || allErrors.quantidade)
        dispatch({ type: "SET_STEP", payload: 2 });
      else if (allErrors.endereco || allErrors.datainicio || allErrors.datatermino)
        dispatch({ type: "SET_STEP", payload: 3 });
      alert("Por favor, preencha todos os campos obrigatórios corretamente.");
      return;
    }

    dispatch({ type: "SET_SUBMITTING", payload: true });

    const user = await getCurrentUserClient();
    if (!user?.id) {
      logger.error("User not authenticated");
      alert("Você precisa estar autenticado para criar uma solicitação.");
      dispatch({ type: "SET_SUBMITTING", payload: false });
      return;
    }

    if (!state.locationData) {
      logger.error("Location data is required");
      alert("Por favor, selecione um endereço válido usando a busca.");
      dispatch({ type: "SET_SUBMITTING", payload: false });
      return;
    }

    try {
      const params = new URLSearchParams({
        access_token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "",
        q: state.locationData.suggestion.full_address,
      });
      const geoRes = await fetch(
        `https://api.mapbox.com/search/geocode/v6/forward?${params.toString()}`
      );
      if (!geoRes.ok) throw new Error("Failed to geocode location");

      const geoData = await geoRes.json();
      const feature = geoData.features[0];
      if (!feature) throw new Error("No location found");

      const latitude = feature.geometry.coordinates[1];
      const longitude = feature.geometry.coordinates[0];

      let imageUrl: string | undefined;
      if (state.selectedImage) {
        const reader = new FileReader();
        const imageBase64 = await new Promise<string>((resolve) => {
          reader.onload = () => resolve((reader.result as string).split(",")[1]);
          reader.readAsDataURL(state.selectedImage!);
        });
        const cdnResult = await uploadDonationImageAction(
          imageBase64,
          state.selectedImage.name,
          state.selectedImage.type
        );
        if (cdnResult?.url) imageUrl = cdnResult.url;
      }

      // Build payload as variable to allow extra location fields (name/address)
      // without triggering TypeScript excess property checking on the action type.
      const donationPayload = {
        status: "PENDING",
        content:
          state.formData.content ||
          `Solicitação de doação de sangue tipo ${state.formData.tipoSanguineo}`,
        startDate: state.formData.datainicio || new Date().toISOString(),
        finishDate: state.formData.datatermino || undefined,
        bloodType: state.formData.tipoSanguineo,
        quantity: state.formData.quantidade,
        location: {
          latitude,
          longitude,
          name: state.locationData.suggestion.name,
          address: state.locationData.suggestion.full_address,
        },
        userId: user.id,
        name: state.formData.nome,
        image: imageUrl,
      };
      const result = await createDonationAction(donationPayload);

      if (!result?.id) {
        logger.error("Resultado inválido ao criar solicitação", result);
        alert("Erro ao criar solicitação. Por favor, tente novamente.");
        if (isMounted.current) dispatch({ type: "SET_SUBMITTING", payload: false });
        return;
      }

      if (isMounted.current) dispatch({ type: "SET_SUBMITTING", payload: false });

      const redirectUrl = `/visualizar-solicitacao/${result.id}`;
      try {
        router.push(redirectUrl);
      } catch (redirectError) {
        logger.error("Erro ao redirecionar:", redirectError);
        window.location.href = redirectUrl;
      }
    } catch (error) {
      logger.error("Erro no envio:", error);
      alert("Erro ao criar solicitação. Por favor, tente novamente.");
      if (isMounted.current) dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  };

  const triggerSubmit = (e: React.MouseEvent) => {
    if (!e.isTrusted) {
      logger.warn("Click não confiável bloqueado (isTrusted=false)");
      return;
    }
    const nonce = Math.random().toString(36).slice(2, 10);
    submitNonceRef.current = nonce;
    performSubmit(nonce);
  };

  return {
    state,
    dispatch,
    totalSteps: TOTAL_STEPS,
    goNext,
    goPrev,
    triggerSubmit,
    handleGenerateDescription,
    handleImageChange,
    handleRemoveImage,
  };
}
