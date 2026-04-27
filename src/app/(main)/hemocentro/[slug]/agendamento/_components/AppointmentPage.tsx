"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  BsCalendar3,
  BsClock,
  BsDropletFill,
  BsPersonFill,
  BsEnvelopeFill,
  BsTelephoneFill,
  BsCardText,
  BsCheckCircleFill,
  BsExclamationCircleFill,
  BsArrowLeft,
  BsMegaphone,
} from "react-icons/bs";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles.module.scss";
import {
  IInstitution,
  IAppointmentFormData,
} from "@/features/Institution/interfaces/Institution.interface";
import {
  ITimeSlot,
  IAvailableDate,
  IScheduleConfig,
} from "@/features/Institution/interfaces/Appointment.interface";
import { ICampaign } from "@/features/Campaign/interfaces/Campaign.interface";
import { SchedulingService } from "@/services/scheduling.service";
import { DatePicker } from "@/components/DatePicker";
import { TimePicker } from "@/components/TimePicker";
import {
  createAppointmentAction,
  DonorPrefillData,
  AppointmentActionError,
} from "@/actions/appointments/appointments-actions";
import { AppointmentErrorMessage } from "@/components/AppointmentErrorMessage";
import { maskPhone, maskCPF, unmaskPhone } from "@/utils/masks";
import { logger } from "@/utils/logger";

interface AppointmentPageProps {
  slug: string;
  institution: IInstitution;
  activeCampaigns: ICampaign[];
  donorPrefill: DonorPrefillData | null;
}

type AppointmentFormState = IAppointmentFormData & {
  campaignId: string;
};

const EMPTY_FORM: AppointmentFormState = {
  campaignId: "",
  donorName: "",
  donorEmail: "",
  donorPhone: "",
  bloodType: "",
  birthDate: "",
  cpf: "",
  scheduledDate: "",
  scheduledTime: "",
  notes: "",
};

function buildInitialForm(
  prefill: DonorPrefillData | null,
): AppointmentFormState {
  if (!prefill) return EMPTY_FORM;
  return {
    ...EMPTY_FORM,
    donorName: prefill.name,
    donorEmail: prefill.email,
    donorPhone: prefill.phone ? maskPhone(prefill.phone) : "",
    cpf: prefill.cpf ? maskCPF(prefill.cpf) : "",
    bloodType:
      prefill.bloodType && prefill.bloodType !== "UNKNOWN"
        ? prefill.bloodType
        : "",
    birthDate: prefill.birthDate ?? "",
  };
}

export default function AppointmentPage({
  slug,
  institution,
  activeCampaigns,
  donorPrefill,
}: AppointmentPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<AppointmentActionError | null>(null);
  const [scheduleConfig] = useState<IScheduleConfig>(
    SchedulingService.getDefaultConfig(),
  );
  const [availableDates, setAvailableDates] = useState<IAvailableDate[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<ITimeSlot[]>([]);
  const [formData, setFormData] = useState<AppointmentFormState>(() =>
    buildInitialForm(donorPrefill),
  );
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof AppointmentFormState, string>>
  >({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof AppointmentFormState, boolean>>
  >({});

  useEffect(() => {
    // Slot availability is computed locally with defaults (seg-sex 8-17h, 30min).
    // Backend rejects (SlotFull / DonorAlreadyBooked) on submit if there's a clash.
    const dates = SchedulingService.getAvailableDates(scheduleConfig, []);
    setAvailableDates(dates);
  }, [scheduleConfig]);

  useEffect(() => {
    if (formData.scheduledDate) {
      const slots = SchedulingService.generateTimeSlots(
        scheduleConfig,
        formData.scheduledDate,
        [],
      );
      setAvailableTimeSlots(slots);
    } else {
      setAvailableTimeSlots([]);
    }
  }, [formData.scheduledDate, scheduleConfig]);

  const validateField = (
    name: keyof AppointmentFormState,
    value: string,
  ): string | undefined => {
    switch (name) {
      case "campaignId":
        if (!value) return "Selecione uma campanha ativa";
        break;
      case "donorName":
        if (!value.trim()) return "Nome é obrigatório";
        if (value.length < 3) return "Nome deve ter pelo menos 3 caracteres";
        break;
      case "donorEmail":
        if (!value.trim()) return "E-mail é obrigatório";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "E-mail inválido";
        break;
      case "donorPhone": {
        if (!value.trim()) return "Telefone é obrigatório";
        const digits = value.replace(/\D/g, "");
        if (digits.length < 10 || digits.length > 11)
          return "Telefone deve ter 10 ou 11 dígitos (com DDD)";
        break;
      }
      case "bloodType":
        if (!value) return "Tipo sanguíneo é obrigatório";
        break;
      case "birthDate": {
        if (!value) return "Data de nascimento é obrigatória";
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 16 || age > 69) return "Idade deve estar entre 16 e 69 anos";
        break;
      }
      case "cpf": {
        if (!value.trim()) return "CPF é obrigatório";
        const cpfDigits = value.replace(/\D/g, "");
        if (cpfDigits.length !== 11) return "CPF deve ter 11 dígitos";
        break;
      }
      case "scheduledDate": {
        if (!value) return "Data é obrigatória";
        const schedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (schedDate < today) return "Data deve ser futura";
        break;
      }
      case "scheduledTime":
        if (!value) return "Horário é obrigatório";
        break;
    }
  };

  const validateAll = (): boolean => {
    const newErrors: Partial<Record<keyof AppointmentFormState, string>> = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof AppointmentFormState>).forEach(
      (key) => {
        if (key === "notes") return;
        const err = validateField(key, formData[key]);
        if (err) {
          newErrors[key] = err;
          isValid = false;
        }
      },
    );

    setFormErrors(newErrors);
    return isValid;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    let nextValue = value;
    if (name === "donorPhone") nextValue = maskPhone(value);
    else if (name === "cpf") nextValue = maskCPF(value);

    setFormData((prev) => ({ ...prev, [name]: nextValue }));
    if (formErrors[name as keyof AppointmentFormState]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name as keyof AppointmentFormState, value);
    setFormErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    );
    setTouched(allTouched);

    if (!validateAll()) return;

    setIsSubmitting(true);
    setError(null);

    const result = await createAppointmentAction({
      campaignId: formData.campaignId,
      scheduledDate: formData.scheduledDate,
      scheduledTime: formData.scheduledTime,
      bloodType: formData.bloodType,
      donorName: formData.donorName.trim(),
      donorEmail: formData.donorEmail.trim(),
      donorPhone: unmaskPhone(formData.donorPhone),
      notes: formData.notes?.trim() || undefined,
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      // Only log unexpected failures — known business-rule rejections
      // (DONOR_ALREADY_BOOKED, SLOT_FULL, etc.) already surface in the UI and
      // should not pollute the console / dev overlay.
      if (!result.error.code) {
        logger.error("createAppointment failed:", result.error.message);
      }
      return;
    }

    setSubmitSuccess(true);
    setFormData(buildInitialForm(donorPrefill));
    setTouched({});
  };

  if (activeCampaigns.length === 0) {
    return (
      <main className={styles.appointmentContainer}>
        <div className={styles.appointmentContent}>
          <div className={styles.appointmentHeader}>
            <Link href={`/hemocentro/${slug}`} className={styles.backButton}>
              <BsArrowLeft />
              Voltar
            </Link>
          </div>
          <div className={styles.error}>
            <BsExclamationCircleFill className={styles.errorIcon} />
            <h2>Nenhuma campanha ativa</h2>
            <p>
              Este hemocentro ainda não possui campanhas abertas para
              agendamento. Tente novamente mais tarde.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.appointmentContainer}>
      <div className={styles.appointmentContent}>
        <div className={styles.appointmentHeader}>
          <Link href={`/hemocentro/${slug}`} className={styles.backButton}>
            <BsArrowLeft />
            Voltar
          </Link>

          <div className={styles.institutionInfo}>
            {institution.logoImage && (
              <Image
                src={institution.logoImage}
                alt={institution.institutionName}
                width={60}
                height={60}
                className={styles.institutionLogo}
              />
            )}
            <div>
              <h1 className={styles.appointmentTitle}>Agendar Doação</h1>
              <p className={styles.institutionName}>
                {institution.institutionName}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.formCard}>
          {submitSuccess ? (
            <div className={styles.successMessage}>
              <BsCheckCircleFill className={styles.successIcon} />
              <h3>Agendamento realizado com sucesso!</h3>
              <p>
                Seu agendamento está com status <strong>PENDENTE</strong>. O
                hemocentro confirmará em breve.
              </p>
              <div className={styles.successActions}>
                <button
                  className={styles.newAppointmentButton}
                  onClick={() => setSubmitSuccess(false)}
                >
                  Fazer novo agendamento
                </button>
                <Link
                  href={`/hemocentro/${slug}`}
                  className={styles.backToProfileButton}
                >
                  Voltar ao perfil
                </Link>
              </div>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              {/* Campanha ativa */}
              <div className={styles.formSection}>
                <h2 className={styles.formSectionTitle}>
                  <BsMegaphone className={styles.formSectionIcon} />
                  Campanha
                </h2>
                <div className={styles.formGroup}>
                  <label htmlFor="campaignId" className={styles.label}>
                    Escolha a campanha
                    <span className={styles.required}>*</span>
                  </label>
                  <select
                    id="campaignId"
                    name="campaignId"
                    value={formData.campaignId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${styles.select} ${
                      formErrors.campaignId && touched.campaignId
                        ? styles.inputError
                        : ""
                    }`}
                  >
                    <option value="">Selecione uma campanha ativa</option>
                    {activeCampaigns.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} (
                        {new Date(c.startDate).toLocaleDateString("pt-BR")} –{" "}
                        {new Date(c.endDate).toLocaleDateString("pt-BR")})
                      </option>
                    ))}
                  </select>
                  {formErrors.campaignId && touched.campaignId && (
                    <span className={styles.error} role="alert">
                      {formErrors.campaignId}
                    </span>
                  )}
                </div>
              </div>

              {/* Dados pessoais */}
              <div className={styles.formSection}>
                <h2 className={styles.formSectionTitle}>
                  <BsPersonFill className={styles.formSectionIcon} />
                  Dados Pessoais
                </h2>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="donorName" className={styles.label}>
                      Nome completo
                      <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      id="donorName"
                      name="donorName"
                      value={formData.donorName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`${styles.input} ${
                        formErrors.donorName && touched.donorName
                          ? styles.inputError
                          : ""
                      }`}
                      placeholder="Digite seu nome completo"
                    />
                    {formErrors.donorName && touched.donorName && (
                      <span className={styles.error} role="alert">
                        {formErrors.donorName}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="donorEmail" className={styles.label}>
                      <BsEnvelopeFill className={styles.labelIcon} />
                      E-mail
                      <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="email"
                      id="donorEmail"
                      name="donorEmail"
                      value={formData.donorEmail}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`${styles.input} ${
                        formErrors.donorEmail && touched.donorEmail
                          ? styles.inputError
                          : ""
                      }`}
                      placeholder="seu@email.com"
                    />
                    {formErrors.donorEmail && touched.donorEmail && (
                      <span className={styles.error} role="alert">
                        {formErrors.donorEmail}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="donorPhone" className={styles.label}>
                      <BsTelephoneFill className={styles.labelIcon} />
                      Telefone
                      <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="tel"
                      id="donorPhone"
                      name="donorPhone"
                      value={formData.donorPhone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`${styles.input} ${
                        formErrors.donorPhone && touched.donorPhone
                          ? styles.inputError
                          : ""
                      }`}
                      placeholder="(00) 00000-0000"
                    />
                    {formErrors.donorPhone && touched.donorPhone && (
                      <span className={styles.error} role="alert">
                        {formErrors.donorPhone}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="cpf" className={styles.label}>
                      <BsCardText className={styles.labelIcon} />
                      CPF
                      <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      id="cpf"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`${styles.input} ${
                        formErrors.cpf && touched.cpf ? styles.inputError : ""
                      }`}
                      placeholder="000.000.000-00"
                    />
                    {formErrors.cpf && touched.cpf && (
                      <span className={styles.error} role="alert">
                        {formErrors.cpf}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="birthDate" className={styles.label}>
                      <BsCalendar3 className={styles.labelIcon} />
                      Data de Nascimento
                      <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="date"
                      id="birthDate"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`${styles.input} ${
                        formErrors.birthDate && touched.birthDate
                          ? styles.inputError
                          : ""
                      }`}
                    />
                    {formErrors.birthDate && touched.birthDate && (
                      <span className={styles.error} role="alert">
                        {formErrors.birthDate}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="bloodType" className={styles.label}>
                      <BsDropletFill className={styles.labelIcon} />
                      Tipo Sanguíneo
                      <span className={styles.required}>*</span>
                    </label>
                    <select
                      id="bloodType"
                      name="bloodType"
                      value={formData.bloodType}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`${styles.select} ${
                        formErrors.bloodType && touched.bloodType
                          ? styles.inputError
                          : ""
                      }`}
                    >
                      <option value="">Selecione</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                    {formErrors.bloodType && touched.bloodType && (
                      <span className={styles.error} role="alert">
                        {formErrors.bloodType}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Agendamento */}
              <div className={styles.formSection}>
                <h2 className={styles.formSectionTitle}>
                  <BsCalendar3 className={styles.formSectionIcon} />
                  Agendamento
                </h2>

                <div className={styles.formGroup}>
                  <label htmlFor="scheduledDate" className={styles.label}>
                    Data da Doação
                    <span className={styles.required}>*</span>
                  </label>
                  <DatePicker
                    id="scheduledDate"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={(date) => {
                      setFormData((prev) => ({
                        ...prev,
                        scheduledDate: date,
                        scheduledTime: "",
                      }));
                      setFormErrors((prev) => ({
                        ...prev,
                        scheduledDate: undefined,
                      }));
                    }}
                    onBlur={() => {
                      setTouched((prev) => ({ ...prev, scheduledDate: true }));
                      const err = validateField(
                        "scheduledDate",
                        formData.scheduledDate,
                      );
                      setFormErrors((prev) => ({
                        ...prev,
                        scheduledDate: err,
                      }));
                    }}
                    availableDates={availableDates}
                    hasError={
                      !!(formErrors.scheduledDate && touched.scheduledDate)
                    }
                  />
                  {formErrors.scheduledDate && touched.scheduledDate && (
                    <span className={styles.error} role="alert">
                      {formErrors.scheduledDate}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="scheduledTime" className={styles.label}>
                    <BsClock className={styles.labelIcon} />
                    Horário
                    <span className={styles.required}>*</span>
                  </label>
                  <TimePicker
                    id="scheduledTime"
                    name="scheduledTime"
                    value={formData.scheduledTime}
                    onChange={(time) => {
                      setFormData((prev) => ({ ...prev, scheduledTime: time }));
                      setFormErrors((prev) => ({
                        ...prev,
                        scheduledTime: undefined,
                      }));
                    }}
                    onBlur={() => {
                      setTouched((prev) => ({ ...prev, scheduledTime: true }));
                      const err = validateField(
                        "scheduledTime",
                        formData.scheduledTime,
                      );
                      setFormErrors((prev) => ({
                        ...prev,
                        scheduledTime: err,
                      }));
                    }}
                    timeSlots={availableTimeSlots}
                    hasError={
                      !!(formErrors.scheduledTime && touched.scheduledTime)
                    }
                  />
                  {formErrors.scheduledTime && touched.scheduledTime && (
                    <span className={styles.error} role="alert">
                      {formErrors.scheduledTime}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="notes" className={styles.label}>
                    Observações (opcional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className={styles.textarea}
                    rows={4}
                    placeholder="Alguma informação adicional que deseja compartilhar?"
                  />
                </div>
              </div>

              {error && (
                <div className={styles.errorMessage} role="alert">
                  <BsExclamationCircleFill className={styles.errorIcon} />
                  <AppointmentErrorMessage error={error} />
                </div>
              )}

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className={styles.spinner}></span>
                    Agendando...
                  </>
                ) : (
                  <>
                    <BsCheckCircleFill />
                    Confirmar Agendamento
                  </>
                )}
              </button>

              <p className={styles.disclaimer}>
                * Dados pessoais (CPF / data de nascimento) são usados apenas
                para validação local — não são enviados ao backend.
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
