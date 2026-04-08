"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { BsApple } from "react-icons/bs";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import AppleSignin from "react-apple-signin-auth";
import { Button } from "@/components/Button";
import { loginOAuthGoogle, loginOAuthApple } from "@/app/(auth)/actions";
import styles from "./styles.module.scss";
import { logger } from "@/utils/logger";

interface OAuthButtonsProps {
  redirect?: string;
}

function GoogleButton({ redirect }: OAuthButtonsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      startTransition(async () => {
        try {
          const redirectTo = await loginOAuthGoogle(tokenResponse.access_token, redirect);
          router.push(redirectTo);
        } catch (error) {
          logger.error("Google login failed:", error);
        }
      });
    },
    onError: (error) => {
      logger.error("Google login failed:", error);
    },
  });

  return (
    <Button
      type="button"
      variant="google"
      iconBefore={<FcGoogle />}
      fullWidth
      isLoading={isPending}
      onClick={() => login()}
    >
      Google
    </Button>
  );
}

function AppleButton({ redirect }: OAuthButtonsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <AppleSignin
      uiType="light"
      authOptions={{
        clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID ?? "",
        scope: "email name",
        redirectURI: process.env.NEXT_PUBLIC_SITE_URL
          ? `${process.env.NEXT_PUBLIC_SITE_URL}/login`
          : "http://localhost:3000/login",
        usePopup: true,
      }}
      onSuccess={(response: {
        authorization: { id_token: string };
        user?: { name?: { firstName?: string; lastName?: string } };
      }) => {
        startTransition(async () => {
          try {
            const redirectTo = await loginOAuthApple(
              response.authorization.id_token,
              response.user?.name?.firstName,
              response.user?.name?.lastName,
              redirect
            );
            router.push(redirectTo);
          } catch (error) {
            logger.error("Apple login failed:", error);
          }
        });
      }}
      onError={(error: unknown) => {
        logger.error("Apple login failed:", error);
      }}
      render={(props: { onClick: () => void }) => (
        <Button
          type="button"
          variant="outline"
          iconBefore={<BsApple />}
          fullWidth
          isLoading={isPending}
          onClick={props.onClick}
        >
          Apple
        </Button>
      )}
    />
  );
}

export default function OAuthButtons({ redirect }: OAuthButtonsProps) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""}>
      <div className={styles.oauthButtons}>
        <GoogleButton redirect={redirect} />
        <AppleButton redirect={redirect} />
      </div>
    </GoogleOAuthProvider>
  );
}
