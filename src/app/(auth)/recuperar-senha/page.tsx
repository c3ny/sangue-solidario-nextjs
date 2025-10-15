"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BsEnvelope,
  BsArrowRight,
  BsArrowLeft,
  BsCheckCircleFill,
  BsShieldCheck,
} from "react-icons/bs";
import { Input } from "@/components/Input";
import styles from "./styles.module.scss";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending recovery email
    setTimeout(() => {
      setIsSubmitted(true);
    }, 500);
  };

  return (
    <main className={styles.container}>
      {/* Left Side - Form */}
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

          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className={styles.header}>
                <h1 className={styles.title}>Esqueceu sua senha?</h1>
                <p className={styles.subtitle}>
                  Não se preocupe! Digite seu e-mail e enviaremos instruções
                  para recuperar sua senha.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className={styles.form}>
                <Input
                  label="E-mail cadastrado"
                  icon={BsEnvelope}
                  type="email"
                  id="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                {/* Submit Button */}
                <button type="submit" className={styles.submitButton}>
                  <span>Enviar instruções</span>
                  <BsArrowRight className={styles.buttonIcon} />
                </button>

                {/* Back to Login */}
                <Link href="/login" className={styles.backLink}>
                  <BsArrowLeft className={styles.backIcon} />
                  <span>Voltar para o login</span>
                </Link>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className={styles.successContent}>
                <div className={styles.successIcon}>
                  <BsCheckCircleFill />
                </div>
                <h1 className={styles.successTitle}>E-mail enviado!</h1>
                <p className={styles.successText}>
                  Enviamos as instruções para recuperação de senha para{" "}
                  <strong>{email}</strong>
                </p>
                <p className={styles.successSubtext}>
                  Verifique sua caixa de entrada e siga as instruções para criar
                  uma nova senha. Não esqueça de verificar a pasta de spam.
                </p>

                {/* Actions */}
                <div className={styles.successActions}>
                  <Link href="/login" className={styles.loginButton}>
                    <BsArrowLeft className={styles.buttonIcon} />
                    <span>Voltar para o login</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className={styles.resendButton}
                  >
                    Reenviar e-mail
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className={styles.visualSection}>
        <div className={styles.visualContent}>
          <div className={styles.badge}>
            <BsShieldCheck className={styles.badgeIcon} />
            <span>Segurança em primeiro lugar</span>
          </div>
          <h2 className={styles.visualTitle}>
            Sua conta está{" "}
            <span className={styles.highlight}>protegida conosco</span>
          </h2>
          <p className={styles.visualText}>
            Levamos a segurança da sua conta muito a sério. O processo de
            recuperação de senha é simples, rápido e totalmente seguro.
          </p>
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <BsShieldCheck />
              </div>
              <div className={styles.featureContent}>
                <h3 className={styles.featureTitle}>Link seguro</h3>
                <p className={styles.featureText}>
                  O link de recuperação expira em 1 hora por segurança
                </p>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <BsEnvelope />
              </div>
              <div className={styles.featureContent}>
                <h3 className={styles.featureTitle}>E-mail verificado</h3>
                <p className={styles.featureText}>
                  Enviamos apenas para e-mails cadastrados
                </p>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <BsCheckCircleFill />
              </div>
              <div className={styles.featureContent}>
                <h3 className={styles.featureTitle}>Processo rápido</h3>
                <p className={styles.featureText}>
                  Recupere sua senha em poucos minutos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
