import { redirect } from "next/navigation";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AppApolloProvider } from "@/components/apollo-provider";

export default async function DashboardPage() {
	let session = null;

	try {
		session = await getServerSession(authOptions);
	} catch {
		redirect("/login");
	}

	if (!session?.user) {
		redirect("/login");
	}

	return (
		<AppApolloProvider>
			<DashboardClient />
		</AppApolloProvider>
	);
}
