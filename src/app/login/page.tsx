import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { LoginForm } from "./login-form";

export const metadata = { title: "Client Portal Login" };

type Props = {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl?.startsWith("/")
    ? params.callbackUrl
    : "/dashboard";

  return (
    <div className="theme-portal flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground">
      <Card className="w-full max-w-sm">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.jpg"
            alt="Pinnacle Legal & Business Law"
            width={1455}
            height={1081}
            className="h-12 w-auto rounded-sm"
          />
        </Link>
        <h1 className="mt-6 font-display text-2xl">Client Portal Sign In</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email and password to sign in. Client, attorney, and
          firm staff accounts all use this same form.
        </p>
        {params.error && (
          <p
            role="alert"
            className="mt-4 rounded-sm border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            Invalid email or password.
          </p>
        )}
        <LoginForm callbackUrl={callbackUrl} />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          New client?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </Card>
    </div>
  );
}
