"use client";

import { GitBranch } from "lucide-react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";

export function SocialLoginButton() {
  return (
    <Button
      type="button"
      variant="secondary"
      className="full-width"
      onClick={() => signIn("github")}
    >
      <GitBranch size={16} className="icon-gap-sm" />
      Continue with GitHub
    </Button>
  );
}
