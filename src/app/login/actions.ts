"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const callbackUrlRaw = formData.get("callbackUrl");
  const callbackUrl =
    typeof callbackUrlRaw === "string" && callbackUrlRaw.startsWith("/")
      ? callbackUrlRaw
      : "/dashboard";

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      const params = new URLSearchParams({ error: "invalid", callbackUrl });
      redirect(`/login?${params.toString()}`);
    }
    throw error;
  }
}
