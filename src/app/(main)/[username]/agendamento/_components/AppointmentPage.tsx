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
} from "react-icons/bs";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles.module.scss";
import {
  IInstitution,
  IAppointmentFormData,
} from "@/features/Institution/interfaces/Institution.interface";
import {
  IAppointment,
  ITimeSlot,
  IAvailableDate,
  IScheduleConfig,
} from "@/features/Institution/interfaces/Appointment.interface";
import { SchedulingService } from "@/services/scheduling.service";
import { DatePicker } from "@/components/DatePicker";
import { TimePicker } from "@/components/TimePicker";

interface AppointmentPageProps {
  username: string;
}

export default function AppointmentPage({ username }: AppointmentPageProps) {
  const [institution, setInstitution] = useState<IInstitution | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [existingAppointments, setExistingAppointments] = useState<
    IAppointment[]
  >([]);
  const [scheduleConfig] = useState<IScheduleConfig>(
    SchedulingService.getDefaultConfig()
  );
  const [availableDates, setAvailableDates] = useState<IAvailableDate[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<ITimeSlot[]>([]);

  const [formData, setFormData] = useState<IAppointmentFormData>({
    donorName: "",
    donorEmail: "",
    donorPhone: "",
    bloodType: "",
    birthDate: "",
    cpf: "",
    scheduledDate: "",
    scheduledTime: "",
    notes: "",
  });

  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof IAppointmentFormData, string>>
  >({});

  const [touched, setTouched] = useState<
    Partial<Record<keyof IAppointmentFormData, boolean>>
  >({});

  useEffect(() => {
    const fetchInstitution = async () => {
      try {
        setLoading(true);
        const mockInstitution: IInstitution = {
          id: "inst-123",
          username: username.replace("@", ""),
          institutionName: "Hospital São Paulo",
          cnpj: "12.345.678/0001-90",
          type: "HOSPITAL" as any,
          status: "ACTIVE" as any,
          logoImage:
            "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=200&auto=format&fit=crop",
          location: {
            address: "Rua Napoleão de Barros, 715",
            city: "São Paulo",
            uf: "SP",
            zipcode: "04024-002",
            latitude: -23.5505,
            longitude: -46.6333,
          },
          contact: {
            phone: "(11) 5571-1111",
            email: "contato@hospitalsaopaulo.org.br",
          },
          schedule: [],
          acceptsDonations: true,
          acceptsScheduling: true,
          userId: "user-123",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setInstitution(mockInstitution);

        const mockAppointments: IAppointment[] = [
          {
            id: "apt-1",
            institutionId: "inst-123",
            donorName: "João Silva",
            donorEmail: "joao@example.com",
            donorPhone: "(11) 99999-9999",
            bloodType: "O+",
            birthDate: "1990-01-01",
            cpf: "123.456.789-00",
            scheduledDate: SchedulingService.formatDate(
              new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
            ),
            scheduledTime: "09:00",
            status: "CONFIRMED" as any,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "apt-2",
            institutionId: "inst-123",
            donorName: "Maria Santos",
            donorEmail: "maria@example.com",
            donorPhone: "(11) 88888-8888",
            bloodType: "A+",
            birthDate: "1985-05-15",
            cpf: "987.654.321-00",
            scheduledDate: SchedulingService.formatDate(
              new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
            ),
            scheduledTime: "09:00",
            status: "CONFIRMED" as any,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "apt-3",
            institutionId: "inst-123",
            donorName: "Pedro Oliveira",
            donorEmail: "pedro@example.com",
            donorPhone: "(11) 77777-7777",
            bloodType: "B+",
            birthDate: "1995-03-20",
            cpf: "456.789.123-00",
            scheduledDate: SchedulingService.formatDate(
              new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
            ),
            scheduledTime: "10:00",
            status: "CONFIRMED" as any,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];

        setExistingAppointments(mockAppointments);

        const dates = SchedulingService.getAvailableDates(
          scheduleConfig,
          mockAppointments
        );

        setAvailableDates(dates);
      } catch (err) {
        setError("Erro ao carregar informações da instituição");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstitution();
  }, [username, scheduleConfig]);

  useEffect(() => {
    if (formData.scheduledDate) {
      const slots = SchedulingService.generateTimeSlots(
        scheduleConfig,
        formData.scheduledDate,
        existingAppointments
      );
      setAvailableTimeSlots(slots);
    } else {
      setAvailableTimeSlots([]);
    }
  }, [formData.scheduledDate, existingAppointments, scheduleConfig]);

  const validateField = (
    name: keyof IAppointmentFormData,
    value: string
  ): string | undefined => {
    switch (name) {
      case "donorName":
        if (!value.trim()) return "Nome é obrigatório";
        if (value.length < 3) return "Nome deve ter pelo menos 3 caracteres";
        break;
      case "donorEmail":
        if (!value.trim()) return "E-mail é obrigatório";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "E-mail inválido";
        break;
      case "donorPhone":
        if (!value.trim()) return "Telefone é obrigatório";
        if (!/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/.test(value.replace(/\s/g, "")))
          return "Telefone inválido";
        break;
      case "bloodType":
        if (!value) return "Tipo sanguíneo é obrigatório";
        break;
      case "birthDate":
        if (!value) return "Data de nascimento é obrigatória";
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 16 || age > 69) return "Idade deve estar entre 16 e 69 anos";
        break;
      case "cpf":
        if (!value.trim()) return "CPF é obrigatório";
        if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value)) return "CPF inválido";
        break;
      case "scheduledDate":
        if (!value) return "Data é obrigatória";
        const schedDate = new Date(value);
        if (schedDate < new Date()) return "Data deve ser futura";
        break;
      case "scheduledTime":
        if (!value) return "Horário é obrigatório";
        break;
    }
  };

  const validateAll = (): boolean => {
    const newErrors: Partial<Record<keyof IAppointmentFormData, string>> = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof IAppointmentFormData>).forEach(
      (key) => {
        if (key === "notes") return;
        const error = validateField(key, formData[key]);
        if (error) {
          newErrors[key] = error;
          isValid = false;
        }
      }
    );

    setFormErrors(newErrors);
    return isValid;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name as keyof IAppointmentFormData]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name as keyof IAppointmentFormData, value);
    setFormErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitSuccess(true);
      setFormData({
        donorName: "",
        donorEmail: "",
        donorPhone: "",
        bloodType: "",
        birthDate: "",
        cpf: "",
        scheduledDate: "",
        scheduledTime: "",
        notes: "",
      });
      setTouched({});
    } catch (err) {
      setError("Erro ao realizar agendamento. Tente novamente.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Carregando...</p>
      </div>
    );
  }

  if (error && !institution) {
    return (
      <div className={styles.error}>
        <BsExclamationCircleFill className={styles.errorIcon} />
        <h2>Erro ao carregar</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!institution) {
    return (
      <div className={styles.error}>
        <h2>Instituição não encontrada</h2>
      </div>
    );
  }

  return (
    <main className={styles.appointmentContainer}>
      <div className={styles.appointmentContent}>
        <div className={styles.appointmentHeader}>
          <Link
            href={`/@${institution.username}`}
            className={styles.backButton}
          >
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
                Enviamos um e-mail de confirmação com todos os detalhes do seu
                agendamento.
              </p>
              <div className={styles.successActions}>
                <button
                  className={styles.newAppointmentButton}
                  onClick={() => setSubmitSuccess(false)}
                >
                  Fazer novo agendamento
                </button>
                <Link
                  href={`/@${institution.username}`}
                  className={styles.backToProfileButton}
                >
                  Voltar ao perfil
                </Link>
              </div>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
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
                      const error = validateField(
                        "scheduledDate",
                        formData.scheduledDate
                      );
                      setFormErrors((prev) => ({
                        ...prev,
                        scheduledDate: error,
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
                      const error = validateField(
                        "scheduledTime",
                        formData.scheduledTime
                      );
                      setFormErrors((prev) => ({
                        ...prev,
                        scheduledTime: error,
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
                  {error}
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
                * Ao confirmar, você receberá um e-mail com os detalhes do
                agendamento e instruções para preparação.
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
