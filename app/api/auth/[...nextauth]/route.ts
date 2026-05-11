import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
// This route creates the NextAuth handler and exports it for GET and POST.

// Again, this is authentication API handling, not a rendered route.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
