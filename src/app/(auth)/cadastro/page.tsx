"use client";

import { useState } from "react";
import { useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BsPersonFill,
  BsEnvelope,
  BsLock,
  BsGeoAlt,
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
import styles from "./styles.module.scss";

const initialState: FormState = {};

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

  const currentState =
    userType === PersonType.DONOR ? donorState : companyState;
  const isSubmitting =
    userType === PersonType.DONOR ? isDonorPending : isCompanyPending;

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

                <div className={styles.formGrid}>
                  <Select
                    label="Estado"
                    id="uf"
                    name="uf"
                    options={estadoOptions}
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
                    error={donorState?.errors?.city}
                    required
                    showRequired
                  />
                </div>

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
                />

                <Input
                  label="E-mail"
                  icon={BsEnvelope}
                  type="email"
                  id="email"
                  name="email"
                  placeholder="seu@email.com"
                  error={donorState?.errors?.email}
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
                  error={donorState?.errors?.password}
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
                >
                  Criar conta
                </Button>

                <p className={styles.loginText}>
                  Já tem uma conta?
                  <Link href="/login" className={styles.loginLink}>
                    Faça login
                  </Link>
                </p>
              </form>
            )}

            {userType === PersonType.COMPANY && (
              <form action={companyAction} className={styles.formList}>
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
                    error={companyState?.errors?.cnpj}
                    required
                    showRequired
                    maxLength={18}
                  />

                  <MaskedInput
                    label="CNES"
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

                <div className={styles.formGrid}>
                  <Select
                    label="Estado"
                    id="uf"
                    name="uf"
                    options={estadoOptions}
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
                    error={companyState?.errors?.city}
                    required
                    showRequired
                  />
                </div>

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
                />

                <Input
                  label="E-mail"
                  icon={BsEnvelope}
                  type="email"
                  id="email"
                  name="email"
                  placeholder="seu@email.com"
                  error={companyState?.errors?.email}
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
                  error={companyState?.errors?.password}
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
                >
                  Criar conta
                </Button>

                <p className={styles.loginText}>
                  Já tem uma conta?
                  <Link href="/login" className={styles.loginLink}>
                    Faça login
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
