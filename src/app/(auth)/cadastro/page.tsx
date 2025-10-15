"use client";

import { useState } from "react";
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
import { Select } from "@/components/Select";
import styles from "./styles.module.scss";

export default function Cadastro() {
  const [userType, setUserType] = useState<"fisica" | "juridica" | "">("");

  const bloodTypeOptions = [
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Cadastro realizado com sucesso!");
  };

  return (
    <main className={styles.container}>
      <div className={styles.visualSection}>
        <div className={styles.visualContent}>
          <div className={styles.badge}>
            <BsHeart className={styles.badgeIcon} />
            <span>Junte-se a nós</span>
          </div>
          <h2 className={styles.visualTitle}>
            Seja parte desta{" "}
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

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Tipo de usuário *</label>
              <div className={styles.userTypeButtons}>
                <button
                  type="button"
                  className={`${styles.userTypeButton} ${
                    userType === "fisica" ? styles.active : ""
                  }`}
                  onClick={() => setUserType("fisica")}
                >
                  <BsPersonFill className={styles.userTypeIcon} />
                  <span>Pessoa Física</span>
                </button>
                <button
                  type="button"
                  className={`${styles.userTypeButton} ${
                    userType === "juridica" ? styles.active : ""
                  }`}
                  onClick={() => setUserType("juridica")}
                >
                  <BsBuilding className={styles.userTypeIcon} />
                  <span>Pessoa Jurídica</span>
                </button>
              </div>
            </div>

            {userType && (
              <>
                {userType === "fisica" && (
                  <>
                    <Input
                      label="Nome completo"
                      icon={BsPersonFill}
                      type="text"
                      id="nome"
                      placeholder="Digite seu nome completo"
                      required
                      showRequired
                    />

                    <div className={styles.formGrid}>
                      <Input
                        label="Data de nascimento"
                        type="date"
                        id="dataNascimento"
                        required
                        showRequired
                      />

                      <Input
                        label="CPF"
                        type="text"
                        id="cpf"
                        placeholder="000.000.000-00"
                        required
                        showRequired
                      />
                    </div>

                    <Select
                      label="Tipo sanguíneo"
                      id="tipoSanguineo"
                      options={bloodTypeOptions}
                      placeholder="Selecione seu tipo sanguíneo"
                      required
                      showRequired
                      defaultValue=""
                    />
                  </>
                )}

                {userType === "juridica" && (
                  <>
                    <Input
                      label="Nome do responsável"
                      icon={BsPersonFill}
                      type="text"
                      id="responsavel"
                      placeholder="Nome do responsável"
                      required
                      showRequired
                    />

                    <Input
                      label="Nome da instituição"
                      icon={BsBuilding}
                      type="text"
                      id="instituicao"
                      placeholder="Nome da instituição"
                      required
                      showRequired
                    />

                    <div className={styles.formGrid}>
                      <Input
                        label="CNPJ"
                        type="text"
                        id="cnpj"
                        placeholder="00.000.000/0000-00"
                        required
                        showRequired
                      />

                      <Input
                        label="CNES"
                        type="text"
                        id="cnes"
                        placeholder="0000000"
                      />
                    </div>
                  </>
                )}

                <div className={styles.formGrid}>
                  <Select
                    label="Estado"
                    id="estado"
                    options={estadoOptions}
                    placeholder="UF"
                    required
                    showRequired
                    defaultValue=""
                  />

                  <Input
                    label="Cidade"
                    type="text"
                    id="cidade"
                    placeholder="Sua cidade"
                    required
                    showRequired
                  />
                </div>

                <Input
                  label="Endereço"
                  icon={BsGeoAlt}
                  type="text"
                  id="endereco"
                  placeholder="Rua, número, bairro"
                  required
                  showRequired
                />

                <Input
                  label="CEP"
                  type="text"
                  id="cep"
                  placeholder="00000-000"
                  required
                  showRequired
                />

                <Input
                  label="E-mail"
                  icon={BsEnvelope}
                  type="email"
                  id="email"
                  placeholder="seu@email.com"
                  required
                  showRequired
                />

                <Input
                  label="Senha"
                  icon={BsLock}
                  type="password"
                  id="senha"
                  placeholder="••••••••"
                  required
                  showRequired
                  showPasswordToggle
                />

                <button type="submit" className={styles.submitButton}>
                  <BsCheckCircleFill className={styles.buttonIcon} />
                  <span>Criar conta</span>
                </button>

                <p className={styles.loginText}>
                  Já tem uma conta?{" "}
                  <Link href="/login" className={styles.loginLink}>
                    Faça login
                  </Link>
                </p>
              </>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
