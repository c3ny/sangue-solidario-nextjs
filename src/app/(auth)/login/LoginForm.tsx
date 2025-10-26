"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BsEnvelope, BsLock, BsArrowRight } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import styles from "./styles.module.scss";
import { login, FormState } from "@/app/(auth)/actions";
import { Bold } from "@/components/Bold";

const initialState: FormState = {};

export default function LoginForm({ redirect }: { redirect?: string }) {
  const [rememberMe, setRememberMe] = useState(false);

  const [loginState, loginAction, isLoginPending] = useActionState(
    login,
    initialState
  );

  const handleGoogleLogin = () => {
    alert("Login com Google iniciado!");
  };

  return (
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

        {loginState?.message && (
          <div className={styles.errorMessage}>{loginState.message}</div>
        )}

        <form action={loginAction} className={styles.form}>
          <input type="hidden" name="redirect" value={redirect} />

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
                name="rememberMe"
                id="rememberMe"
                value="true"
                onChange={(e) => setRememberMe(e.target.checked)}
                className={styles.checkbox}
              />
              <span>Lembrar de mim</span>
            </label>
            <Link href="/recuperar-senha" className={styles.forgotLink}>
              Esqueci minha senha
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            iconAfter={<BsArrowRight />}
            fullWidth
            isLoading={isLoginPending}
          >
            Entrar
          </Button>

          <div className={styles.divider}>
            <span className={styles.dividerText}>ou</span>
          </div>

          <Button
            type="button"
            onClick={handleGoogleLogin}
            variant="google"
            iconBefore={<FcGoogle />}
            fullWidth
          >
            Continuar com Google
          </Button>

          <p className={styles.signupText}>
            Ainda não tem uma conta?
            <Bold className={styles.signupText}>
              <Link href="/cadastro" className={styles.signupLink}>
                Cadastre-se agora
              </Link>
            </Bold>
          </p>
        </form>
      </div>
    </div>
  );
}
