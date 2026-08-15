import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const CLIENT_PATH_PREFIXES = ["/dashboard", "/matters", "/settings"];
const FIRM_PATH_PREFIX = "/firm";
// Case data (matters, documents, docket) is attorney + client only now —
// staff/admin keep the rest of the firm workspace (leads, account admin).
// `/firm/clients` (creating client portal logins) and `/firm/attorneys`
// (creating other attorney logins) are grouped in with case data too,
// since granting either kind of access is an attorney-level action.
const FIRM_ATTORNEY_ONLY_PREFIXES = ["/firm/matters", "/firm/clients", "/firm/attorneys"];

function matchesPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

/**
 * Gates the client portal and firm workspace behind the demo login from
 * Milestone "1.5". Case data specifically (`/firm/matters*`) is
 * attorney + client only — staff/admin keep the rest of the firm workspace
 * (leads, account admin) but not matters/documents/docket. Per-matter
 * ownership (this attorney is assigned to *this* matter, this client owns
 * *that* matter) is enforced at the route/page level against
 * `src/lib/demo-matters.ts` and `src/lib/demo-clients.ts`, not here — this
 * layer only does coarse role separation.
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const isClientPath = CLIENT_PATH_PREFIXES.some((prefix) =>
    matchesPrefix(pathname, prefix)
  );
  const isFirmPath = matchesPrefix(pathname, FIRM_PATH_PREFIX);

  if (!session?.user) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = session.user.role;

  if (isClientPath && role !== "client") {
    return NextResponse.redirect(
      new URL(role === "attorney" ? "/firm/matters" : "/firm/leads", req.nextUrl)
    );
  }

  if (isFirmPath && role === "client") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  const isFirmAttorneyOnlyPath = FIRM_ATTORNEY_ONLY_PREFIXES.some((prefix) =>
    matchesPrefix(pathname, prefix)
  );
  if (isFirmAttorneyOnlyPath && role !== "attorney") {
    return NextResponse.redirect(new URL("/firm/leads", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/matters/:path*",
    "/settings/:path*",
    "/firm/:path*",
  ],
};
