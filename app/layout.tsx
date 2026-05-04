import type { Metadata } from "next";
import dynamic from "next/dynamic";
import "./globals.css";

const Toaster = dynamic(
	() => import("@/components/ui/sonner").then((mod) => mod.Toaster),
	{ ssr: false },
);

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
				<Toaster richColors position='top-right' />
			</body>
		</html>
	);
}
