import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: "PriceWise | Home",
	description:
		"Rastreie os preços dos produtos e economize dinheiro nas suas compras online!",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt">
			<body className={inter.className}>
				<main className="max-w-10xl mx-auto">
          <Navbar />
          {children}
        </main>
			</body>
		</html>
	);
}
