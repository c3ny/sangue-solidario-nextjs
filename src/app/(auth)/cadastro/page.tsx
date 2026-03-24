"use client";

import { useState } from "react";
import { useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BsPersonFill,
  BsEnvelope,
  BsLock,
  BsCheckCircleFill,
  BsHeart,
  BsBuilding,
} from "react-icons/bs";
import { Input } from "@/components/Input";
import { MaskedInput } from "@/components/MaskedInput";
import { Select } from "@/components/Select";
import { Button } from "@/components/Button";
import { PersonType } from "@/interfaces/Registration.interface";
import { registerDonor, registerCompany, FormState } from "./actions";
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
import {
  getPasswordStrength,
  getStrengthLevel,
} from "@/features/Registration/validation/registration.schema";
import styles from "./styles.module.scss";
import { Bold } from "@/components/Bold";

const initialState: FormState = {};

interface PasswordStrengthBarProps {
  count: number;
  level: "fraca" | "média" | "forte";
  hasLetters: boolean;
  hasNumbers: boolean;
  hasSymbols: boolean;
}

function PasswordStrengthBar({
  count,
  level,
  hasLetters,
  hasNumbers,
  hasSymbols,
}: PasswordStrengthBarProps) {
  const segClass =
    level === "forte"
      ? styles.segForte
      : level === "média"
      ? styles.segMedia
      : styles.segFraca;

  const labelClass =
    level === "forte"
      ? styles.labelForte
      : level === "média"
      ? styles.labelMedia
      : styles.labelFraca;

  return (
    <div className={styles.strengthBar}>
      <div className={styles.strengthSegments}>
        <div className={`${styles.segment} ${count >= 1 ? segClass : ""}`} />
        <div className={`${styles.segment} ${count >= 2 ? segClass : ""}`} />
        <div className={`${styles.segment} ${count >= 3 ? segClass : ""}`} />
      </div>
      <div className={styles.strengthMeta}>
        <div className={styles.achievements}>
          {hasLetters && (
            <span className={styles.achievement}>Contém letras ✓</span>
          )}
          {hasNumbers && (
            <span className={styles.achievement}>Contém números ✓</span>
          )}
          {hasSymbols && (
            <span className={styles.achievement}>Contém símbolos ✓</span>
          )}
        </div>
        <span className={`${styles.strengthLabel} ${labelClass}`}>
          Força: {level}
        </span>
      </div>
    </div>
  );
}

export default function Cadastro() {
  const [userType, setUserType] = useState<PersonType | "">("");
  const [donorState, donorAction, isDonorPending] = useActionState(
    registerDonor,
    initialState
  );
  const [companyState, companyAction, isCompanyPending] = useActionState(
    registerCompany,
    initialState
  );

  // — Donor: CEP auto-fill state
  const [donorCepDigits, setDonorCepDigits] = useState("");
  const [donorUf, setDonorUf] = useState("");
  const [donorCity, setDonorCity] = useState("");
  const [donorCepStatus, setDonorCepStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [donorCepMsg, setDonorCepMsg] = useState("");

  // — Donor: email & password confirm state
  const [donorEmail, setDonorEmail] = useState("");
  const [confirmEmailValue, setConfirmEmailValue] = useState("");
  const [confirmEmailError, setConfirmEmailError] = useState("");
  const [donorPassword, setDonorPassword] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // — Company: CEP auto-fill state
  const [companyCepDigits, setCompanyCepDigits] = useState("");
  const [companyUf, setCompanyUf] = useState("");
  const [companyCity, setCompanyCity] = useState("");
  const [companyCepStatus, setCompanyCepStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [companyCepMsg, setCompanyCepMsg] = useState("");

  // — Company: CNPJ validation state
  const [cnpjDigits, setCnpjDigits] = useState("");
  const [cnpjError, setCnpjError] = useState("");
  const [cnpjLoading, setCnpjLoading] = useState(false);

  // — Company: email & password confirm state
  const [companyEmail, setCompanyEmail] = useState("");
  const [confirmCompanyEmailValue, setConfirmCompanyEmailValue] = useState("");
  const [confirmCompanyEmailError, setConfirmCompanyEmailError] = useState("");
  const [companyPassword, setCompanyPassword] = useState("");
  const [confirmCompanyPasswordValue, setConfirmCompanyPasswordValue] =
    useState("");
  const [confirmCompanyPasswordError, setConfirmCompanyPasswordError] =
    useState("");

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

  const strengthInfo =
    donorPassword.length > 0 ? getPasswordStrength(donorPassword) : null;
  const strengthLevel = strengthInfo
    ? getStrengthLevel(strengthInfo.count)
    : null;

  const hasClientErrors =
    !!confirmEmailError ||
    !!confirmPasswordError ||
    (donorPassword.length > 0 && donorPassword.length < 6) ||
    (donorPassword.length > 0 && (strengthInfo?.count ?? 0) < 2);

  const companyStrengthInfo =
    companyPassword.length > 0 ? getPasswordStrength(companyPassword) : null;
  const companyStrengthLevel = companyStrengthInfo
    ? getStrengthLevel(companyStrengthInfo.count)
    : null;

  const hasCompanyClientErrors =
    !!confirmCompanyEmailError ||
    !!confirmCompanyPasswordError ||
    !!cnpjError ||
    (companyPassword.length > 0 && companyPassword.length < 6) ||
    (companyPassword.length > 0 && (companyStrengthInfo?.count ?? 0) < 2);

  const currentState =
    userType === PersonType.DONOR ? donorState : companyState;

  return (
    <main className={styles.container}>
      <div className={styles.visualSection}>
        <div className={styles.visualContent}>
          <div className={styles.badge}>
            <BsHeart className={styles.badgeIcon} />
            <span>Junte-se a nós</span>
          </div>
          <h2 className={styles.visualTitle}>
            Seja parte desta
            <span className={styles.highlight}>corrente de solidariedade</span>
          </h2>
          <p className={styles.visualText}>
            Crie sua conta e comece a fazer a diferença. Conecte-se com pessoas
            que precisam de ajuda e salve vidas através da doação de sangue.
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
            <h1 className={styles.title}>Criar conta</h1>
            <p className={styles.subtitle}>
              Preencha seus dados para começar a salvar vidas
            </p>
          </div>

          {currentState?.message && (
            <div className={styles.errorMessage}>{currentState.message}</div>
          )}

          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Tipo de usuário *</label>
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
                {/* Step 1 — Localização */}
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

                {/* Step 2 — Dados pessoais */}
                <Input
                  label="Nome completo"
                  icon={BsPersonFill}
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Digite seu nome completo"
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

                {/* Step 3 — Acesso */}
                <Input
                  label="E-mail"
                  icon={BsEnvelope}
                  type="email"
                  id="email"
                  name="email"
                  placeholder="seu@email.com"
                  value={donorEmail}
                  onChange={(e) => {
                    const newVal = e.target.value;
                    setDonorEmail(newVal);
                    if (confirmEmailValue) {
                      setConfirmEmailError(
                        newVal !== confirmEmailValue
                          ? "Os e-mails não conferem"
                          : ""
                      );
                    }
                  }}
                  error={donorState?.errors?.email}
                  required
                  showRequired
                />

                <Input
                  label="Confirmar e-mail"
                  icon={BsEnvelope}
                  type="email"
                  id="confirmEmail"
                  name="confirmEmail"
                  placeholder="Repita seu e-mail"
                  onPaste={(e) => e.preventDefault()}
                  onChange={(e) => {
                    const val = e.target.value;
                    setConfirmEmailValue(val);
                    if (donorEmail && val && val !== donorEmail) {
                      setConfirmEmailError("Os e-mails não conferem");
                    } else {
                      setConfirmEmailError("");
                    }
                  }}
                  error={confirmEmailError || donorState?.errors?.confirmEmail}
                  required
                  showRequired
                />

                <Input
                  label="Senha"
                  icon={BsLock}
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={donorPassword}
                  onChange={(e) => {
                    const newVal = e.target.value;
                    setDonorPassword(newVal);
                    if (confirmPasswordValue) {
                      setConfirmPasswordError(
                        newVal !== confirmPasswordValue
                          ? "As senhas não conferem"
                          : ""
                      );
                    }
                  }}
                  error={
                    (donorPassword.length > 0 && donorPassword.length < 6
                      ? "A senha deve ter pelo menos 6 caracteres"
                      : undefined) || donorState?.errors?.password
                  }
                  required
                  showRequired
                  showPasswordToggle
                />

                {/* Password strength bar */}
                {donorPassword.length > 0 && strengthInfo && strengthLevel && (
                  <PasswordStrengthBar
                    count={strengthInfo.count}
                    level={strengthLevel}
                    hasLetters={strengthInfo.hasLetters}
                    hasNumbers={strengthInfo.hasNumbers}
                    hasSymbols={strengthInfo.hasSymbols}
                  />
                )}

                <Input
                  label="Confirmar senha"
                  icon={BsLock}
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="••••••••"
                  onPaste={(e) => e.preventDefault()}
                  onChange={(e) => {
                    const val = e.target.value;
                    setConfirmPasswordValue(val);
                    if (donorPassword && val && val !== donorPassword) {
                      setConfirmPasswordError("As senhas não conferem");
                    } else {
                      setConfirmPasswordError("");
                    }
                  }}
                  error={
                    confirmPasswordError || donorState?.errors?.confirmPassword
                  }
                  required
                  showRequired
                  showPasswordToggle
                />

                <Button
                  type="submit"
                  variant="primary"
                  iconBefore={<BsCheckCircleFill />}
                  fullWidth
                  isLoading={isDonorPending}
                  disabled={hasClientErrors || isDonorPending}
                >
                  Criar conta
                </Button>

                <p className={styles.loginText}>
                  Já tem uma conta?
                  <Bold className={styles.loginLink}>
                    <Link href="/login" className={styles.loginLink}>
                      Faça login
                    </Link>
                  </Bold>
                </p>
              </form>
            )}

            {userType === PersonType.COMPANY && (
              <form action={companyAction} className={styles.formList}>
                {/* Step 1 — Localização */}
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

                {/* Step 2 — Dados da instituição */}
                <Input
                  label="Nome do responsável"
                  icon={BsPersonFill}
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Nome do responsável"
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

                {/* Step 3 — Acesso */}
                <Input
                  label="E-mail"
                  icon={BsEnvelope}
                  type="email"
                  id="email"
                  name="email"
                  placeholder="seu@email.com"
                  value={companyEmail}
                  onChange={(e) => {
                    const newVal = e.target.value;
                    setCompanyEmail(newVal);
                    if (confirmCompanyEmailValue) {
                      setConfirmCompanyEmailError(
                        newVal !== confirmCompanyEmailValue
                          ? "Os e-mails não conferem"
                          : ""
                      );
                    }
                  }}
                  error={companyState?.errors?.email}
                  required
                  showRequired
                />

                <Input
                  label="Confirmar e-mail"
                  icon={BsEnvelope}
                  type="email"
                  id="confirmEmail"
                  name="confirmEmail"
                  placeholder="Repita seu e-mail"
                  onPaste={(e) => e.preventDefault()}
                  onChange={(e) => {
                    const val = e.target.value;
                    setConfirmCompanyEmailValue(val);
                    if (companyEmail && val && val !== companyEmail) {
                      setConfirmCompanyEmailError("Os e-mails não conferem");
                    } else {
                      setConfirmCompanyEmailError("");
                    }
                  }}
                  error={
                    confirmCompanyEmailError || companyState?.errors?.confirmEmail
                  }
                  required
                  showRequired
                />

                <Input
                  label="Senha"
                  icon={BsLock}
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={companyPassword}
                  onChange={(e) => {
                    const newVal = e.target.value;
                    setCompanyPassword(newVal);
                    if (confirmCompanyPasswordValue) {
                      setConfirmCompanyPasswordError(
                        newVal !== confirmCompanyPasswordValue
                          ? "As senhas não conferem"
                          : ""
                      );
                    }
                  }}
                  error={
                    (companyPassword.length > 0 && companyPassword.length < 6
                      ? "A senha deve ter pelo menos 6 caracteres"
                      : undefined) || companyState?.errors?.password
                  }
                  required
                  showRequired
                  showPasswordToggle
                />

                {companyPassword.length > 0 &&
                  companyStrengthInfo &&
                  companyStrengthLevel && (
                    <PasswordStrengthBar
                      count={companyStrengthInfo.count}
                      level={companyStrengthLevel}
                      hasLetters={companyStrengthInfo.hasLetters}
                      hasNumbers={companyStrengthInfo.hasNumbers}
                      hasSymbols={companyStrengthInfo.hasSymbols}
                    />
                  )}

                <Input
                  label="Confirmar senha"
                  icon={BsLock}
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="••••••••"
                  onPaste={(e) => e.preventDefault()}
                  onChange={(e) => {
                    const val = e.target.value;
                    setConfirmCompanyPasswordValue(val);
                    if (companyPassword && val && val !== companyPassword) {
                      setConfirmCompanyPasswordError("As senhas não conferem");
                    } else {
                      setConfirmCompanyPasswordError("");
                    }
                  }}
                  error={
                    confirmCompanyPasswordError ||
                    companyState?.errors?.confirmPassword
                  }
                  required
                  showRequired
                  showPasswordToggle
                />

                <Button
                  type="submit"
                  variant="primary"
                  iconBefore={<BsCheckCircleFill />}
                  fullWidth
                  isLoading={isCompanyPending}
                  disabled={hasCompanyClientErrors || isCompanyPending}
                >
                  Criar conta
                </Button>

                <p className={styles.loginText}>
                  Já tem uma conta?
                  <Bold className={styles.loginLink}>
                    <Link href="/login" className={styles.loginLink}>
                      Faça login
                    </Link>
                  </Bold>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
