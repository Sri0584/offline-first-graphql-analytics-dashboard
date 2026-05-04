import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

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
				<Toaster richColors position='top-right' />
				{children}
			</body>
		</html>
	);
}
