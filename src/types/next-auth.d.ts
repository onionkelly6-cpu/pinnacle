import type { DefaultSession } from "next-auth";
import type { DemoRole } from "@/lib/demo-accounts";

declare module "next-auth" {
  interface User {
    role?: DemoRole;
  }
  interface Session {
    user: {
      role?: DemoRole;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: DemoRole;
  }
}
