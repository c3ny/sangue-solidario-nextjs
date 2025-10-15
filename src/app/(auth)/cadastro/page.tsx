"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BsPersonFill,
  BsEnvelope,
  BsLock,
  BsPhone,
  BsGeoAlt,
  BsEye,
  BsEyeSlash,
  BsCheckCircleFill,
  BsHeart,
  BsBuilding,
} from "react-icons/bs";
import styles from "./styles.module.scss";

export default function Cadastro() {
  const [userType, setUserType] = useState<"fisica" | "juridica" | "">("");
  const [showPassword, setShowPassword] = useState(false);

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const estados = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Cadastro realizado com sucesso!");
  };

  return (
    <main className={styles.container}>
      {/* Left Side - Visual */}
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

      {/* Right Side - Form */}
      <div className={styles.formSection}>
        <div className={styles.formContent}>
          {/* Logo */}
          <Link href="/" className={styles.logoLink}>
            <Image
              src="/assets/images/logo/sangue-main.svg"
              alt="Sangue Solidário"
              width={180}
              height={54}
              className={styles.logo}
            />
          </Link>

          {/* Header */}
          <div className={styles.header}>
            <h1 className={styles.title}>Criar conta</h1>
            <p className={styles.subtitle}>
              Preencha seus dados para começar a salvar vidas
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* User Type Selection */}
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
                {/* Pessoa Física Fields */}
                {userType === "fisica" && (
                  <>
                    <div className={styles.formGroup}>
                      <label htmlFor="nome" className={styles.label}>
                        Nome completo *
                      </label>
                      <div className={styles.inputWrapper}>
                        <BsPersonFill className={styles.inputIcon} />
                        <input
                          type="text"
                          id="nome"
                          className={styles.input}
                          placeholder="Digite seu nome completo"
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label htmlFor="dataNascimento" className={styles.label}>
                          Data de nascimento *
                        </label>
                        <input
                          type="date"
                          id="dataNascimento"
                          className={styles.input}
                          required
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="cpf" className={styles.label}>
                          CPF *
                        </label>
                        <input
                          type="text"
                          id="cpf"
                          className={styles.input}
                          placeholder="000.000.000-00"
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="tipoSanguineo" className={styles.label}>
                        Tipo sanguíneo *
                      </label>
                      <select
                        id="tipoSanguineo"
                        className={styles.select}
                        required
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Selecione seu tipo sanguíneo
                        </option>
                        {bloodTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {/* Pessoa Jurídica Fields */}
                {userType === "juridica" && (
                  <>
                    <div className={styles.formGroup}>
                      <label htmlFor="responsavel" className={styles.label}>
                        Nome do responsável *
                      </label>
                      <div className={styles.inputWrapper}>
                        <BsPersonFill className={styles.inputIcon} />
                        <input
                          type="text"
                          id="responsavel"
                          className={styles.input}
                          placeholder="Nome do responsável"
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="instituicao" className={styles.label}>
                        Nome da instituição *
                      </label>
                      <div className={styles.inputWrapper}>
                        <BsBuilding className={styles.inputIcon} />
                        <input
                          type="text"
                          id="instituicao"
                          className={styles.input}
                          placeholder="Nome da instituição"
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label htmlFor="cnpj" className={styles.label}>
                          CNPJ *
                        </label>
                        <input
                          type="text"
                          id="cnpj"
                          className={styles.input}
                          placeholder="00.000.000/0000-00"
                          required
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="cnes" className={styles.label}>
                          CNES
                        </label>
                        <input
                          type="text"
                          id="cnes"
                          className={styles.input}
                          placeholder="0000000"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Common Fields */}
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="estado" className={styles.label}>
                      Estado *
                    </label>
                    <select
                      id="estado"
                      className={styles.select}
                      required
                      defaultValue=""
                    >
                      <option value="" disabled>
                        UF
                      </option>
                      {estados.map((uf) => (
                        <option key={uf} value={uf}>
                          {uf}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="cidade" className={styles.label}>
                      Cidade *
                    </label>
                    <input
                      type="text"
                      id="cidade"
                      className={styles.input}
                      placeholder="Sua cidade"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="endereco" className={styles.label}>
                    Endereço *
                  </label>
                  <div className={styles.inputWrapper}>
                    <BsGeoAlt className={styles.inputIcon} />
                    <input
                      type="text"
                      id="endereco"
                      className={styles.input}
                      placeholder="Rua, número, bairro"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="cep" className={styles.label}>
                    CEP *
                  </label>
                  <input
                    type="text"
                    id="cep"
                    className={styles.input}
                    placeholder="00000-000"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    E-mail *
                  </label>
                  <div className={styles.inputWrapper}>
                    <BsEnvelope className={styles.inputIcon} />
                    <input
                      type="email"
                      id="email"
                      className={styles.input}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="senha" className={styles.label}>
                    Senha *
                  </label>
                  <div className={styles.inputWrapper}>
                    <BsLock className={styles.inputIcon} />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="senha"
                      className={styles.input}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className={styles.togglePassword}
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showPassword ? <BsEyeSlash /> : <BsEye />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button type="submit" className={styles.submitButton}>
                  <BsCheckCircleFill className={styles.buttonIcon} />
                  <span>Criar conta</span>
                </button>

                {/* Login Link */}
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
