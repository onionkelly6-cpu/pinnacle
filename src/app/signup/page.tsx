import Link from "next/link";
import { Scale } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SignupForm } from "./signup-form";

export const metadata = { title: "Create Your Client Account" };

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function SignupPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <div className="theme-portal flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground">
      <Card className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2 font-display text-lg">
          <Scale className="h-4 w-4 text-primary" aria-hidden />
          Fairmont Law <span className="text-primary">Agency</span>
        </Link>
        <h1 className="mt-6 font-display text-2xl">Create Your Client Account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Set up your own client portal access. No invitation needed. If
          your email matches a matter Fairmont Law Agency already has on
          file for you, it appears on your dashboard right away.
        </p>
        {params.error && (
          <p
            role="alert"
            className="mt-4 rounded-sm border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {params.error}
          </p>
        )}
        <SignupForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
