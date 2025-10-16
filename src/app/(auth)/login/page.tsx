"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BsEnvelope, BsLock, BsArrowRight, BsHeart } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { Input } from "@/components/Input";
import styles from "./styles.module.scss";
import { login } from "@/app/(auth)/actions";

export default function Login() {
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Login realizado com sucesso!");
  };

  const handleGoogleLogin = () => {
    alert("Login com Google iniciado!");
  };

  return (
    <main className={styles.container}>
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
            <h1 className={styles.title}>Bem-vindo de volta!</h1>
            <p className={styles.subtitle}>
              Entre na sua conta para continuar salvando vidas
            </p>
          </div>

          <form action={login} className={styles.form}>
            <Input
              label="E-mail"
              icon={BsEnvelope}
              type="email"
              id="email"
              name="email"
              placeholder="seu@email.com"
              required
            />

            <Input
              label="Senha"
              icon={BsLock}
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              required
              showPasswordToggle
            />

            <div className={styles.formOptions}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className={styles.checkbox}
                />
                <span>Lembrar de mim</span>
              </label>
              <Link href="/recuperar-senha" className={styles.forgotLink}>
                Esqueci minha senha
              </Link>
            </div>

            <button type="submit" className={styles.submitButton}>
              <span>Entrar</span>
              <BsArrowRight className={styles.buttonIcon} />
            </button>

            <div className={styles.divider}>
              <span className={styles.dividerText}>ou</span>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className={styles.googleButton}
            >
              <FcGoogle className={styles.googleIcon} />
              <span>Continuar com Google</span>
            </button>

            <p className={styles.signupText}>
              Ainda não tem uma conta?{" "}
              <Link href="/cadastro" className={styles.signupLink}>
                Cadastre-se agora
              </Link>
            </p>
          </form>
        </div>
      </div>

      <div className={styles.visualSection}>
        <div className={styles.visualContent}>
          <div className={styles.badge}>
            <BsHeart className={styles.badgeIcon} />
            <span>Faça a diferença</span>
          </div>
          <h2 className={styles.visualTitle}>
            Cada gota conta.
            <br />
            <span className={styles.highlight}>Cada doação salva vidas.</span>
          </h2>
          <p className={styles.visualText}>
            Junte-se a milhares de doadores que estão fazendo a diferença em
            todo o Brasil. Sua solidariedade transforma vidas.
          </p>
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>1000+</span>
              <span className={styles.statLabel}>Vidas salvas</span>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>500+</span>
              <span className={styles.statLabel}>Doadores ativos</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
