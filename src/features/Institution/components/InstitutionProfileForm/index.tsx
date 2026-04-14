"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Image from "next/image";
import { IInstitution } from "@/features/Institution/interfaces/Institution.interface";
import { updateCompanyValidationSchema } from "@/features/Institution/schemas/update-company.schema";
import { ScheduleEditor, ScheduleItem, DEFAULT_SCHEDULE } from "../ScheduleEditor";
import { CoverImageUpload } from "../CoverImageUpload";
import { ICompanyActionResult } from "@/app/(main)/hemocentros/perfil/actions";
import styles from "./styles.module.scss";

const DAY_ORDER = [
  "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY",
] as const;

/** Convert IInstitutionSchedule (PT day names) back to ScheduleItem (enum keys) */
const PT_TO_DAY: Record<string, ScheduleItem["dayOfWeek"]> = {
  "Segunda-feira": "MONDAY",
  "Terça-feira": "TUESDAY",
  "Quarta-feira": "WEDNESDAY",
  "Quinta-feira": "THURSDAY",
  "Sexta-feira": "FRIDAY",
  "Sábado": "SATURDAY",
  "Domingo": "SUNDAY",
};

function buildInitialSchedule(institution: IInstitution): ScheduleItem[] {
  if (!institution.schedule?.length) return DEFAULT_SCHEDULE;

  const mapped = new Map<string, ScheduleItem>();
  for (const day of institution.schedule) {
    const key = PT_TO_DAY[day.dayOfWeek] ?? (day.dayOfWeek as ScheduleItem["dayOfWeek"]);
    mapped.set(key, {
      dayOfWeek: key,
      openTime: day.openTime,
      closeTime: day.closeTime,
      isOpen: day.isOpen,
    });
  }

  return DAY_ORDER.map(
    (d) =>
      mapped.get(d) ?? {
        dayOfWeek: d,
        openTime: "08:00",
        closeTime: "17:00",
        isOpen: false,
      }
  );
}

interface InstitutionProfileFormProps {
  institution: IInstitution;
  updateAction: (input: object) => Promise<ICompanyActionResult>;
  uploadBannerAction: (fd: FormData) => Promise<ICompanyActionResult>;
  uploadLogoAction: (fd: FormData) => Promise<ICompanyActionResult>;
}

export function InstitutionProfileForm({
  institution,
  updateAction,
  uploadBannerAction,
  uploadLogoAction,
}: InstitutionProfileFormProps) {
  const [bannerUploading, setBannerUploading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [bannerError, setBannerError] = useState("");
  const [logoError, setLogoError] = useState("");
  const [currentBanner, setCurrentBanner] = useState(institution.bannerImage);
  const [currentLogo, setCurrentLogo] = useState(institution.logoImage);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const initialValues = {
    type: institution.type ?? "",
    description: institution.description ?? "",
    phone: institution.contact.phone ?? "",
    whatsapp: institution.contact.whatsapp ?? "",
    contactEmail: institution.contact.email ?? "",
    website: institution.contact.website ?? "",
    address: institution.location.address ?? "",
    neighborhood: institution.location.neighborhood ?? "",
    city: institution.location.city ?? "",
    uf: institution.location.uf ?? "",
    zipcode: institution.location.zipcode ?? "",
    schedule: buildInitialSchedule(institution),
    acceptsDonations: institution.acceptsDonations,
    acceptsScheduling: institution.acceptsScheduling,
  };

  const handleBannerUpload = async (file: File) => {
    setBannerUploading(true);
    setBannerError("");
    try {
      const fd = new FormData();
      fd.append("image", file);
      const result = await uploadBannerAction(fd);
      if (result.success && result.data?.bannerImage) {
        setCurrentBanner(result.data.bannerImage);
      } else {
        setBannerError(result.message);
      }
    } finally {
      setBannerUploading(false);
    }
  };

  const handleLogoUpload = async (file: File) => {
    setLogoUploading(true);
    setLogoError("");
    try {
      const fd = new FormData();
      fd.append("image", file);
      const result = await uploadLogoAction(fd);
      if (result.success && result.data?.logoImage) {
        setCurrentLogo(result.data.logoImage);
      } else {
        setLogoError(result.message);
      }
    } finally {
      setLogoUploading(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={updateCompanyValidationSchema}
      onSubmit={async (values, { setSubmitting, setStatus }) => {
        setSaveSuccess(false);
        try {
          const result = await updateAction({
            ...values,
            type: values.type || undefined,
          });
          if (result.success) {
            setSaveSuccess(true);
            setStatus(null);
          } else {
            setStatus({ error: result.message });
          }
        } catch {
          setStatus({ error: "Erro inesperado. Tente novamente." });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, setFieldValue, isSubmitting, status }) => (
        <Form className={styles.form}>
          {/* Imagem de capa */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Imagem de Capa</h2>
            <CoverImageUpload
              currentImage={currentBanner}
              institutionName={institution.institutionName}
              onUpload={handleBannerUpload}
              isUploading={bannerUploading}
              uploadError={bannerError}
            />
          </section>

          {/* Logo */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Logotipo / Foto de Perfil</h2>
            <div className={styles.logoRow}>
              <div
                className={styles.logoPreview}
                onClick={() => document.getElementById("logo-input")?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && document.getElementById("logo-input")?.click()}
                aria-label="Alterar logotipo"
              >
                {currentLogo ? (
                  <Image
                    src={currentLogo}
                    alt="Logotipo"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <span className={styles.logoPlaceholder}>🏥</span>
                )}
                {logoUploading && <span className={styles.logoOverlay}>⏳</span>}
              </div>
              <div className={styles.logoInfo}>
                <p className={styles.logoHint}>JPG, PNG ou WEBP · máx 3.5MB · quadrado recomendado</p>
                <button
                  type="button"
                  className={styles.changLogoBtn}
                  onClick={() => document.getElementById("logo-input")?.click()}
                >
                  Alterar logotipo
                </button>
                {logoError && <p className={styles.fieldError}>{logoError}</p>}
              </div>
              <input
                id="logo-input"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className={styles.hiddenInput}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) await handleLogoUpload(file);
                  e.target.value = "";
                }}
                aria-hidden="true"
              />
            </div>
          </section>

          {/* Tipo */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Tipo de Instituição</h2>
            <div className={styles.fieldGroup}>
              <Field as="select" name="type" className={styles.select}>
                <option value="">Selecione...</option>
                <option value="HOSPITAL">Hospital</option>
                <option value="BLOOD_CENTER">Hemocentro</option>
                <option value="CLINIC">Clínica</option>
              </Field>
              <ErrorMessage name="type" component="span" className={styles.fieldError} />
            </div>
          </section>

          {/* Descrição */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Sobre a Instituição</h2>
            <div className={styles.fieldGroup}>
              <Field
                as="textarea"
                name="description"
                className={styles.textarea}
                rows={5}
                placeholder="Descreva sua instituição para os doadores..."
              />
              <ErrorMessage name="description" component="span" className={styles.fieldError} />
            </div>
          </section>

          {/* Contato */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Contato</h2>
            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Telefone</label>
                <Field name="phone" type="tel" className={styles.input} placeholder="11987654321" />
                <ErrorMessage name="phone" component="span" className={styles.fieldError} />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>WhatsApp</label>
                <Field name="whatsapp" type="tel" className={styles.input} placeholder="11987654321" />
                <ErrorMessage name="whatsapp" component="span" className={styles.fieldError} />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>E-mail público</label>
                <Field name="contactEmail" type="email" className={styles.input} placeholder="contato@hospital.com.br" />
                <ErrorMessage name="contactEmail" component="span" className={styles.fieldError} />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Site</label>
                <Field name="website" type="url" className={styles.input} placeholder="https://hospital.com.br" />
                <ErrorMessage name="website" component="span" className={styles.fieldError} />
              </div>
            </div>
          </section>

          {/* Endereço */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Endereço</h2>
            <div className={styles.grid2}>
              <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Endereço</label>
                <Field name="address" type="text" className={styles.input} placeholder="Rua, número" />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Bairro</label>
                <Field name="neighborhood" type="text" className={styles.input} />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Cidade</label>
                <Field name="city" type="text" className={styles.input} />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>UF</label>
                <Field name="uf" type="text" className={styles.input} maxLength={2} placeholder="SP" />
                <ErrorMessage name="uf" component="span" className={styles.fieldError} />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>CEP (só números)</label>
                <Field name="zipcode" type="text" className={styles.input} maxLength={8} placeholder="01310100" />
                <ErrorMessage name="zipcode" component="span" className={styles.fieldError} />
              </div>
            </div>
          </section>

          {/* Horários */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Horário de Funcionamento</h2>
            <ScheduleEditor
              value={values.schedule as ScheduleItem[]}
              onChange={(s) => setFieldValue("schedule", s)}
            />
          </section>

          {/* Configurações */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Configurações</h2>
            <div className={styles.toggleRow}>
              <label className={styles.toggleLabel}>
                <Field type="checkbox" name="acceptsDonations" className={styles.checkboxField} />
                <span>Aceitar doações presenciais</span>
              </label>
              <label className={styles.toggleLabel}>
                <Field type="checkbox" name="acceptsScheduling" className={styles.checkboxField} />
                <span>Aceitar agendamentos online</span>
              </label>
            </div>
          </section>

          {/* Feedback */}
          {status?.error && (
            <div className={styles.errorBanner} role="alert">
              {status.error}
            </div>
          )}
          {saveSuccess && (
            <div className={styles.successBanner} role="status">
              Perfil atualizado com sucesso!
            </div>
          )}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Salvando..." : "Salvar alterações"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
