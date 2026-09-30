"use client";

import React from "react";
import { LoginBottomDrawer } from "./LoginBottomDrawer";
import { SignUpBottomDrawer } from "./SignUpBottomDrawer";
import { useOverlayLayer } from "@/app/hooks/useOverlayLayer";

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

  return (
    <>
      <LoginBottomDrawer
        isOpen={isLoginOpen}
        onClose={closeLogin}
        onSignUpClick={handleSignUpFromLogin}
      />
      <SignUpBottomDrawer
        isOpen={isSignUpOpen}
        onClose={closeSignUp}
        onLoginClick={handleLoginFromSignUp}
      />
    </>
  );
}
