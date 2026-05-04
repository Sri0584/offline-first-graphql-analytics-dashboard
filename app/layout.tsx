import type { Metadata } from "next";
import "./globals.css";

import { ToasterProvider } from "@/components/toaster-provider";

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
				{children}
				<ToasterProvider />
			</body>
		</html>
	);
}
