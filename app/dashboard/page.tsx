import { redirect } from "next/navigation";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AppApolloProvider } from "@/components/apollo-provider";

export default async function DashboardPage() {
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		redirect("/login");
	}

	return (
		<AppApolloProvider>
			<DashboardClient />
		</AppApolloProvider>
	);
}
