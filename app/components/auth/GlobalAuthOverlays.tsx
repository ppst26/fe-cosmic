"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useOverlayLayer } from "@/app/hooks/useOverlayLayer";
import { useLazyOverlayMount } from "@/app/hooks/useLazyOverlayMount";

/** drawer เข้าสู่ระบบ / สมัครสมาชิกโหลดแยก chunk ตอนเปิดครั้งแรก — ไม่ติดไป bundle แรกของทุกหน้า */
const LoginBottomDrawer = dynamic(() =>
  import("./LoginBottomDrawer").then((m) => m.LoginBottomDrawer),
);
const SignUpBottomDrawer = dynamic(() =>
  import("./SignUpBottomDrawer").then((m) => m.SignUpBottomDrawer),
);

/**
 * Login / สมัครสมาชิก sheet ทั่วแอป — sync ?layer=login|signup
 */
export function GlobalAuthOverlays() {
  const { isOpen: isLoginOpen, close: closeLogin, open: openLogin } = useOverlayLayer("login");
  const { isOpen: isSignUpOpen, close: closeSignUp, open: openSignUp } = useOverlayLayer("signup");

  const handleSignUpFromLogin = () => {
    closeLogin();
    openSignUp();
  };

  const handleLoginFromSignUp = () => {
    closeSignUp();
    openLogin();
  };

  const loginMounted = useLazyOverlayMount(isLoginOpen);
  const signUpMounted = useLazyOverlayMount(isSignUpOpen);

  return (
    <>
      {loginMounted ? (
        <LoginBottomDrawer
          isOpen={isLoginOpen}
          onClose={closeLogin}
          onSignUpClick={handleSignUpFromLogin}
        />
      ) : null}
      {signUpMounted ? (
        <SignUpBottomDrawer
          isOpen={isSignUpOpen}
          onClose={closeSignUp}
          onLoginClick={handleLoginFromSignUp}
        />
      ) : null}
    </>
  );
}
