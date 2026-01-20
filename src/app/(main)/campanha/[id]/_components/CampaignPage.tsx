"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  BsCalendar3,
  BsGeoAlt,
  BsClock,
  BsDropletFill,
  BsPersonFill,
  BsEnvelopeFill,
  BsTelephoneFill,
  BsCardText,
  BsCheckCircleFill,
  BsExclamationCircleFill,
  BsBuilding,
} from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles.module.scss";
import {
  ICampaign,
  ICampaignScheduleFormData,
  CampaignStatus,
} from "@/features/Campaign/interfaces/Campaign.interface";
import {
  IAppointment,
  ITimeSlot,
  IAvailableDate,
  IScheduleConfig,
} from "@/features/Institution/interfaces/Appointment.interface";
import { SchedulingService } from "@/services/scheduling.service";
import { DatePicker } from "@/components/DatePicker";
import { TimePicker } from "@/components/TimePicker";

interface CampaignPageProps {
  campaignId: string;
}

export default function CampaignPage({ campaignId }: CampaignPageProps) {
  const [campaign, setCampaign] = useState<ICampaign | null>(null);
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

  const [formData, setFormData] = useState<ICampaignScheduleFormData>({
    name: "",
    email: "",
    phone: "",
    bloodType: "",
    birthDate: "",
    cpf: "",
    scheduledDate: "",
    scheduledTime: "",
    notes: "",
  });

  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof ICampaignScheduleFormData, string>>
  >({});

  const [touched, setTouched] = useState<
    Partial<Record<keyof ICampaignScheduleFormData, boolean>>
  >({});

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        const mockCampaign: ICampaign = {
          id: campaignId,
          title: "Campanha de Doação - Estoque Crítico",
          description:
            "Precisamos urgentemente aumentar nosso estoque de sangue. Todos os tipos sanguíneos são bem-vindos, mas estamos especialmente necessitando de doações dos tipos O- e AB+. Sua doação pode salvar até 4 vidas!",
          bannerImage:
            "https://images.unsplash.com/photo-1615461065929-4f8ffed6ca40?q=80&w=1629&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          startDate: new Date().toISOString(),
          endDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
          bloodType: undefined,
          location: {
            name: "Hospital São Paulo",
            address: "Rua Napoleão de Barros, 715",
            city: "São Paulo",
            uf: "SP",
            zipcode: "04024-002",
            latitude: -23.5505,
            longitude: -46.6333,
          },
          organizerId: "org-123",
          organizerName: "Hospital São Paulo",
          organizerUsername: "hospitalsaopaulo",
          status: CampaignStatus.ACTIVE,
          currentDonations: 142,
          targetDonations: 300,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setCampaign(mockCampaign);

        const mockAppointments: IAppointment[] = [
          {
            id: "apt-1",
            institutionId: campaignId,
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
        ];

        setExistingAppointments(mockAppointments);

        const dates = SchedulingService.getAvailableDates(
          scheduleConfig,
          mockAppointments
        );
        setAvailableDates(dates);
      } catch (err) {
        setError("Erro ao carregar campanha");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [campaignId, scheduleConfig]);

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
    name: keyof ICampaignScheduleFormData,
    value: string
  ): string | undefined => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Nome é obrigatório";
        if (value.length < 3) return "Nome deve ter pelo menos 3 caracteres";
        break;
      case "email":
        if (!value.trim()) return "E-mail é obrigatório";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "E-mail inválido";
        break;
      case "phone":
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
        if (!value) return "Data do agendamento é obrigatória";
        const schedDate = new Date(value);
        if (schedDate < new Date()) return "Data deve ser futura";
        break;
      case "scheduledTime":
        if (!value) return "Horário é obrigatório";
        break;
    }
  };

  const validateAll = (): boolean => {
    const newErrors: Partial<Record<keyof ICampaignScheduleFormData, string>> =
      {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof ICampaignScheduleFormData>).forEach(
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

    if (formErrors[name as keyof ICampaignScheduleFormData]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name as keyof ICampaignScheduleFormData, value);
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
        name: "",
        email: "",
        phone: "",
        bloodType: "",
        birthDate: "",
        cpf: "",
        scheduledDate: "",
        scheduledTime: "",
        notes: "",
      });
      setTouched({});
    } catch {
      setError("Erro ao realizar agendamento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const calculateProgress = (): number => {
    if (!campaign?.targetDonations) return 0;
    return Math.min(
      (campaign.currentDonations / campaign.targetDonations) * 100,
      100
    );
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Carregando campanha...</p>
      </div>
    );
  }

  if (error && !campaign) {
    return (
      <div className={styles.error}>
        <BsExclamationCircleFill className={styles.errorIcon} />
        <h2>Erro ao carregar campanha</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className={styles.error}>
        <h2>Campanha não encontrada</h2>
      </div>
    );
  }

  return (
    <main className={styles.container}>
      {campaign.bannerImage && (
        <div className={styles.banner}>
          <Image
            src={campaign.bannerImage}
            alt={campaign.title}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      )}
      <div className={styles.content}>
        <div className={styles.campaignInfo}>
          <h1 className={styles.title}>{campaign.title}</h1>

          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <BsCalendar3 className={styles.metaIcon} />
              <span>
                {formatDate(campaign.startDate)} até{" "}
                {formatDate(campaign.endDate)}
              </span>
            </div>

            <div className={styles.metaItem}>
              <BsGeoAlt className={styles.metaIcon} />
              <span>{campaign.location.name}</span>
            </div>

            {campaign.bloodType && (
              <div className={styles.metaItem}>
                <BsDropletFill className={styles.metaIcon} />
                <span>Tipo sanguíneo: {campaign.bloodType}</span>
              </div>
            )}
          </div>

          {/* Organizer Card */}
          {campaign.organizerUsername && (
            <Link
              href={`/@${campaign.organizerUsername}`}
              className={styles.organizerCard}
            >
              <div className={styles.organizerLabel}>Organizado por</div>
              <div className={styles.organizerInfo}>
                <div className={styles.organizerAvatar}>
                  <BsBuilding />
                </div>
                <div className={styles.organizerDetails}>
                  <h3 className={styles.organizerName}>
                    {campaign.organizerName}
                  </h3>
                  <span className={styles.organizerUsername}>
                    @{campaign.organizerUsername}
                  </span>
                </div>
              </div>
              <div className={styles.organizerAction}>
                Ver perfil completo →
              </div>
            </Link>
          )}

          <div className={styles.description}>
            <h2>Sobre a Campanha</h2>
            <p>{campaign.description}</p>
          </div>

          {campaign.targetDonations && (
            <div className={styles.progress}>
              <div className={styles.progressHeader}>
                <h3>Progresso da Campanha</h3>
                <span className={styles.progressCount}>
                  {campaign.currentDonations} de {campaign.targetDonations}{" "}
                  doações
                </span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
              <p className={styles.progressText}>
                {Math.round(calculateProgress())}% da meta alcançada
              </p>
            </div>
          )}

          <div className={styles.location}>
            <h2>
              <BsGeoAlt className={styles.sectionIcon} />
              Localização
            </h2>
            <div className={styles.locationDetails}>
              <p className={styles.locationName}>{campaign.location.name}</p>
              <p className={styles.locationAddress}>
                {campaign.location.address}
              </p>
              <p className={styles.locationCity}>
                {campaign.location.city} - {campaign.location.uf}
              </p>
              {campaign.location.zipcode && (
                <p className={styles.locationZipcode}>
                  CEP: {campaign.location.zipcode}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className={styles.schedulingForm}>
          <h2 className={styles.formTitle}>
            <BsCalendar3 className={styles.sectionIcon} />
            Agende sua Doação
          </h2>

          {submitSuccess ? (
            <div className={styles.successMessage}>
              <BsCheckCircleFill className={styles.successIcon} />
              <h3>Agendamento realizado com sucesso!</h3>
              <p>
                Enviamos um e-mail de confirmação com todos os detalhes do seu
                agendamento.
              </p>
              <button
                className={styles.newScheduleButton}
                onClick={() => setSubmitSuccess(false)}
              >
                Fazer novo agendamento
              </button>
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
                    <label htmlFor="name" className={styles.label}>
                      Nome completo
                      <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`${styles.input} ${
                        formErrors.name && touched.name ? styles.inputError : ""
                      }`}
                      placeholder="Digite seu nome completo"
                      required
                    />
                    {formErrors.name && touched.name && (
                      <span className={styles.error} role="alert">
                        {formErrors.name}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>
                      <BsEnvelopeFill className={styles.labelIcon} />
                      E-mail
                      <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`${styles.input} ${
                        formErrors.email && touched.email
                          ? styles.inputError
                          : ""
                      }`}
                      placeholder="seu@email.com"
                      required
                    />
                    {formErrors.email && touched.email && (
                      <span className={styles.error} role="alert">
                        {formErrors.email}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="phone" className={styles.label}>
                      <BsTelephoneFill className={styles.labelIcon} />
                      Telefone
                      <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`${styles.input} ${
                        formErrors.phone && touched.phone
                          ? styles.inputError
                          : ""
                      }`}
                      placeholder="(00) 00000-0000"
                      required
                    />
                    {formErrors.phone && touched.phone && (
                      <span className={styles.error} role="alert">
                        {formErrors.phone}
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
                      required
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
                      required
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
                      required
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
                      setTouched((prev) => ({
                        ...prev,
                        scheduledDate: true,
                      }));
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
                      setFormData((prev) => ({
                        ...prev,
                        scheduledTime: time,
                      }));
                      setFormErrors((prev) => ({
                        ...prev,
                        scheduledTime: undefined,
                      }));
                    }}
                    onBlur={() => {
                      setTouched((prev) => ({
                        ...prev,
                        scheduledTime: true,
                      }));
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
