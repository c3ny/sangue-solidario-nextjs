"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  BsPersonFill,
  BsCheckCircleFill,
  BsHeart,
  BsBuilding,
} from "react-icons/bs";
import { Input } from "@/components/Input";
import { MaskedInput } from "@/components/MaskedInput";
import { Select } from "@/components/Select";
import { Button } from "@/components/Button";
import { PersonType } from "@/interfaces/Registration.interface";
import { completeDonorProfile, completeCompanyProfile, FormState } from "./actions";
import {
  maskCPF,
  unmaskCPF,
  maskCNPJ,
  unmaskCNPJ,
  maskDate,
  unmaskDate,
  maskCEP,
  unmaskCEP,
  maskCNES,
  unmaskCNES,
} from "@/utils/masks";
import styles from "./styles.module.scss";

const initialState: FormState = {};

export default function CompletarCadastro() {
  const router = useRouter();
  const [userType, setUserType] = useState<PersonType | "">("");
  const [donorState, donorAction, isDonorPending] = useActionState(
    completeDonorProfile,
    initialState
  );
  const [companyState, companyAction, isCompanyPending] = useActionState(
    completeCompanyProfile,
    initialState
  );

  useEffect(() => {
    if (donorState?.redirectTo) {
      router.push(donorState.redirectTo);
    }
  }, [donorState?.redirectTo, router]);

  useEffect(() => {
    if (companyState?.redirectTo) {
      router.push(companyState.redirectTo);
    }
  }, [companyState?.redirectTo, router]);

  // Pre-fill name from cookie
  const [userName, setUserName] = useState("");

  useEffect(() => {
    try {
      const userCookie = document.cookie
        .split("; ")
        .find((c) => c.startsWith("user="));
      if (userCookie) {
        const userData = JSON.parse(decodeURIComponent(userCookie.split("=").slice(1).join("=")));
        if (userData.name) {
          setUserName(userData.name);
        }
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Donor: CEP auto-fill state
  const [donorCepDigits, setDonorCepDigits] = useState("");
  const [donorUf, setDonorUf] = useState("");
  const [donorCity, setDonorCity] = useState("");
  const [donorCepStatus, setDonorCepStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [donorCepMsg, setDonorCepMsg] = useState("");

  // Company: CEP auto-fill state
  const [companyCepDigits, setCompanyCepDigits] = useState("");
  const [companyUf, setCompanyUf] = useState("");
  const [companyCity, setCompanyCity] = useState("");
  const [companyCepStatus, setCompanyCepStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [companyCepMsg, setCompanyCepMsg] = useState("");

  // Company: CNPJ validation state
  const [cnpjDigits, setCnpjDigits] = useState("");
  const [cnpjError, setCnpjError] = useState("");
  const [cnpjLoading, setCnpjLoading] = useState(false);

  const bloodTypeOptions = [
    { value: "", label: "Selecione seu tipo sanguíneo" },
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" },
  ];

  const estadoOptions = [
    { value: "", label: "Selecione o estado" },
    { value: "AC", label: "AC" },
    { value: "AL", label: "AL" },
    { value: "AP", label: "AP" },
    { value: "AM", label: "AM" },
    { value: "BA", label: "BA" },
    { value: "CE", label: "CE" },
    { value: "DF", label: "DF" },
    { value: "ES", label: "ES" },
    { value: "GO", label: "GO" },
    { value: "MA", label: "MA" },
    { value: "MT", label: "MT" },
    { value: "MS", label: "MS" },
    { value: "MG", label: "MG" },
    { value: "PA", label: "PA" },
    { value: "PB", label: "PB" },
    { value: "PR", label: "PR" },
    { value: "PE", label: "PE" },
    { value: "PI", label: "PI" },
    { value: "RJ", label: "RJ" },
    { value: "RN", label: "RN" },
    { value: "RS", label: "RS" },
    { value: "RO", label: "RO" },
    { value: "RR", label: "RR" },
    { value: "SC", label: "SC" },
    { value: "SP", label: "SP" },
    { value: "SE", label: "SE" },
    { value: "TO", label: "TO" },
  ];

  const handleCepBlur = async (
    digits: string,
    setStatus: (s: "idle" | "loading" | "success" | "error") => void,
    setMsg: (m: string) => void,
    setUf: (v: string) => void,
    setCity: (v: string) => void
  ) => {
    if (digits.length !== 8) return;
    setStatus("loading");
    setMsg("Buscando CEP...");
    try {
      const res = await fetch(`/api/cep?cep=${digits}`);
      const data = await res.json();
      if (!res.ok || data.error) {
        setStatus("error");
        setMsg(data.error || "CEP não encontrado");
        return;
      }
      setUf(data.uf);
      setCity(data.city);
      setStatus("success");
      setMsg("Endereço preenchido automaticamente");
    } catch {
      setStatus("error");
      setMsg("Erro ao consultar CEP");
    }
  };

  const handleCnpjBlur = async (digits: string) => {
    if (digits.length !== 14) return;
    setCnpjLoading(true);
    setCnpjError("");
    try {
      const res = await fetch(`/api/cnpj?cnpj=${digits}`);
      const data = await res.json();
      if (!res.ok) {
        setCnpjError(data.error || "Erro ao validar CNPJ");
      }
    } catch {
      setCnpjError("Erro ao validar CNPJ");
    } finally {
      setCnpjLoading(false);
    }
  };

  const currentState =
    userType === PersonType.DONOR ? donorState : companyState;

  return (
    <main className={styles.container}>
      <div className={styles.visualSection}>
        <div className={styles.visualContent}>
          <div className={styles.badge}>
            <BsHeart className={styles.badgeIcon} />
            <span>Falta pouco</span>
          </div>
          <h2 className={styles.visualTitle}>
            Complete seu cadastro e comece a
            <span className={styles.highlight}> salvar vidas</span>
          </h2>
          <p className={styles.visualText}>
            Preencha seus dados para ter acesso completo a todas as
            funcionalidades da plataforma Sangue Solidário.
          </p>
          <div className={styles.features}>
            <div className={styles.feature}>
              <BsCheckCircleFill className={styles.featureIcon} />
              <span>Encontre doações próximas</span>
            </div>
            <div className={styles.feature}>
              <BsCheckCircleFill className={styles.featureIcon} />
              <span>Crie solicitações</span>
            </div>
            <div className={styles.feature}>
              <BsCheckCircleFill className={styles.featureIcon} />
              <span>Acompanhe seu histórico</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <div className={styles.formContent}>
          <Link href="/" className={styles.logoLink}>
            <Image
              src="/assets/images/logo/sangue-main.svg"
              alt="Sangue Solidário"
              width={180}
              height={54}
              className={styles.logo}
            />
          </Link>

          <div className={styles.header}>
            <h1 className={styles.title}>Completar cadastro</h1>
            <p className={styles.subtitle}>
              Preencha seus dados para acessar todas as funcionalidades
            </p>
          </div>

          {currentState?.message && (
            <div className={styles.errorMessage}>{currentState.message}</div>
          )}

          <div className={styles.form}>
            <div>
              <label style={{ fontWeight: 600, marginBottom: 8, display: "block" }}>
                Tipo de usuário *
              </label>
              <div className={styles.userTypeButtons}>
                <button
                  type="button"
                  className={`${styles.userTypeButton} ${
                    userType === PersonType.DONOR ? styles.active : ""
                  }`}
                  onClick={() => setUserType(PersonType.DONOR)}
                >
                  <BsPersonFill className={styles.userTypeIcon} />
                  <span>Pessoa Física</span>
                </button>
                <button
                  type="button"
                  className={`${styles.userTypeButton} ${
                    userType === PersonType.COMPANY ? styles.active : ""
                  }`}
                  onClick={() => setUserType(PersonType.COMPANY)}
                >
                  <BsBuilding className={styles.userTypeIcon} />
                  <span>Pessoa Jurídica</span>
                </button>
              </div>
            </div>

            {userType === PersonType.DONOR && (
              <form action={donorAction} className={styles.formList}>
                <MaskedInput
                  label="CEP"
                  type="text"
                  id="zipcode"
                  name="zipcode"
                  placeholder="00000-000"
                  maskFn={maskCEP}
                  unmaskFn={unmaskCEP}
                  error={donorState?.errors?.zipcode}
                  required
                  showRequired
                  maxLength={9}
                  onChange={(_, unmasked) => setDonorCepDigits(unmasked)}
                  onBlur={() =>
                    handleCepBlur(
                      donorCepDigits,
                      setDonorCepStatus,
                      setDonorCepMsg,
                      setDonorUf,
                      setDonorCity
                    )
                  }
                />

                {donorCepStatus !== "idle" && (
                  <p
                    className={`${styles.cepFeedback} ${
                      donorCepStatus === "loading"
                        ? styles.cepLoading
                        : donorCepStatus === "success"
                        ? styles.cepSuccess
                        : styles.cepErrorText
                    }`}
                  >
                    {donorCepMsg}
                  </p>
                )}

                <div className={styles.formGrid}>
                  <Select
                    label="Estado"
                    id="uf"
                    name="uf"
                    options={estadoOptions}
                    value={donorUf}
                    onChange={(e) => setDonorUf(e.target.value)}
                    error={donorState?.errors?.uf}
                    required
                    showRequired
                  />

                  <Input
                    label="Cidade"
                    type="text"
                    id="city"
                    name="city"
                    placeholder="Sua cidade"
                    value={donorCity}
                    onChange={(e) => setDonorCity(e.target.value)}
                    error={donorState?.errors?.city}
                    required
                    showRequired
                  />
                </div>

                <Input
                  label="Nome completo"
                  icon={BsPersonFill}
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Digite seu nome completo"
                  defaultValue={userName}
                  error={donorState?.errors?.name}
                  required
                  showRequired
                />

                <div className={styles.formGrid}>
                  <MaskedInput
                    label="Data de nascimento"
                    type="text"
                    id="birthDate"
                    name="birthDate"
                    placeholder="DD/MM/AAAA"
                    maskFn={maskDate}
                    unmaskFn={unmaskDate}
                    error={donorState?.errors?.birthDate}
                    required
                    showRequired
                    maxLength={10}
                  />

                  <MaskedInput
                    label="CPF"
                    type="text"
                    id="cpf"
                    name="cpf"
                    placeholder="000.000.000-00"
                    maskFn={maskCPF}
                    unmaskFn={unmaskCPF}
                    error={donorState?.errors?.cpf}
                    required
                    showRequired
                    maxLength={14}
                  />
                </div>

                <Select
                  label="Tipo sanguíneo"
                  id="bloodType"
                  name="bloodType"
                  options={bloodTypeOptions}
                  error={donorState?.errors?.bloodType}
                  required
                  showRequired
                />

                <Button
                  type="submit"
                  variant="primary"
                  iconBefore={<BsCheckCircleFill />}
                  fullWidth
                  isLoading={isDonorPending}
                  disabled={isDonorPending}
                >
                  Completar cadastro
                </Button>
              </form>
            )}

            {userType === PersonType.COMPANY && (
              <form action={companyAction} className={styles.formList}>
                <MaskedInput
                  label="CEP"
                  type="text"
                  id="zipcode"
                  name="zipcode"
                  placeholder="00000-000"
                  maskFn={maskCEP}
                  unmaskFn={unmaskCEP}
                  error={companyState?.errors?.zipcode}
                  required
                  showRequired
                  maxLength={9}
                  onChange={(_, unmasked) => setCompanyCepDigits(unmasked)}
                  onBlur={() =>
                    handleCepBlur(
                      companyCepDigits,
                      setCompanyCepStatus,
                      setCompanyCepMsg,
                      setCompanyUf,
                      setCompanyCity
                    )
                  }
                />

                {companyCepStatus !== "idle" && (
                  <p
                    className={`${styles.cepFeedback} ${
                      companyCepStatus === "loading"
                        ? styles.cepLoading
                        : companyCepStatus === "success"
                        ? styles.cepSuccess
                        : styles.cepErrorText
                    }`}
                  >
                    {companyCepMsg}
                  </p>
                )}

                <div className={styles.formGrid}>
                  <Select
                    label="Estado"
                    id="uf"
                    name="uf"
                    options={estadoOptions}
                    value={companyUf}
                    onChange={(e) => setCompanyUf(e.target.value)}
                    error={companyState?.errors?.uf}
                    required
                    showRequired
                  />

                  <Input
                    label="Cidade"
                    type="text"
                    id="city"
                    name="city"
                    placeholder="Sua cidade"
                    value={companyCity}
                    onChange={(e) => setCompanyCity(e.target.value)}
                    error={companyState?.errors?.city}
                    required
                    showRequired
                  />
                </div>

                <Input
                  label="Nome do responsável"
                  icon={BsPersonFill}
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Nome do responsável"
                  defaultValue={userName}
                  error={companyState?.errors?.name}
                  required
                  showRequired
                />

                <Input
                  label="Nome da instituição"
                  icon={BsBuilding}
                  type="text"
                  id="institutionName"
                  name="institutionName"
                  placeholder="Nome da instituição"
                  error={companyState?.errors?.institutionName}
                  required
                  showRequired
                />

                <div className={styles.formGrid}>
                  <MaskedInput
                    label="CNPJ"
                    type="text"
                    id="cnpj"
                    name="cnpj"
                    placeholder="00.000.000/0000-00"
                    maskFn={maskCNPJ}
                    unmaskFn={unmaskCNPJ}
                    error={cnpjError || companyState?.errors?.cnpj}
                    required
                    showRequired
                    maxLength={18}
                    onChange={(_, unmasked) => {
                      setCnpjDigits(unmasked);
                      if (cnpjError) setCnpjError("");
                    }}
                    onBlur={() => handleCnpjBlur(cnpjDigits)}
                  />

                  <MaskedInput
                    label={`CNES${cnpjLoading ? " (validando CNPJ...)" : ""}`}
                    type="text"
                    id="cnes"
                    name="cnes"
                    placeholder="0000000"
                    maskFn={maskCNES}
                    unmaskFn={unmaskCNES}
                    error={companyState?.errors?.cnes}
                    required
                    showRequired
                    maxLength={7}
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  iconBefore={<BsCheckCircleFill />}
                  fullWidth
                  isLoading={isCompanyPending}
                  disabled={!!cnpjError || isCompanyPending}
                >
                  Completar cadastro
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
