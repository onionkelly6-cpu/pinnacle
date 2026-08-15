"use client";

import { Button } from "@/components/ui/button";
import { signupAction } from "./actions";

export function SignupForm() {
  return (
    <form action={signupAction} className="mt-8 space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-2 w-full rounded-sm border border-border bg-background px-4 py-2.5"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-2 w-full rounded-sm border border-border bg-background px-4 py-2.5"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          className="mt-2 w-full rounded-sm border border-border bg-background px-4 py-2.5"
        />
        <p className="mt-1 text-xs text-muted-foreground">At least 6 characters.</p>
      </div>
      <Button type="submit" variant="primary" className="w-full">
        Create Account
      </Button>
    </form>
  );
}
