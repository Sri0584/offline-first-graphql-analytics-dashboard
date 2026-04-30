import type { Metadata } from "next";
import "./globals.css";
import { AppApolloProvider } from "@/components/apollo-provider";
import { ServiceWorkerRegister } from "@/components/service-worker-register";

export const metadata: Metadata = {
	title: "Offline GraphQL Analytics Dashboard",
	description: "Production-ready GraphQL portfolio project",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body>
				{/* <ServiceWorkerRegister /> */}
				<AppApolloProvider>{children}</AppApolloProvider>
			</body>
		</html>
	);
}
