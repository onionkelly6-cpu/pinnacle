"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { createLead } from "@/lib/demo-leads";
import { intakeRateLimit } from "@/lib/rate-limit";
import { practiceAreas } from "@/lib/content/practice-areas";

const practiceAreaSlugs = practiceAreas.map((area) => area.slug) as [string, ...string[]];

const leadSchema = z.object({
  name: z.string().trim().min(1, "Enter your name"),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().max(30).optional().default(""),
  practiceArea: z.enum(practiceAreaSlugs),
  message: z.string().trim().min(1, "Tell us what's going on").max(4000),
});

function redirectWithError(message: string): never {
  redirect(`/contact?error=${encodeURIComponent(message)}`);
}

export async function submitLeadAction(formData: FormData) {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const { success: withinLimit } = await intakeRateLimit.limit(ip);
  if (!withinLimit) {
    redirectWithError("Too many submissions from this connection. Try again in a minute.");
  }

  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    practiceArea: formData.get("practiceArea"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    redirectWithError(parsed.error.issues[0]?.message ?? "Please check the form and try again.");
  }

  await createLead(parsed.data);
  redirect("/contact?success=1");
}
