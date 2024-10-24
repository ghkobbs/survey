import React from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Breadcrumb from "@/components/breadcrumbs";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

// export const metadata: Metadata = {
// 	title: "Dashboard",
// 	description: "Dashboard Area",
// };

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<main className="min-h-screen p-4 md:p-8">
					<div className="container mx-auto p-4 max-w-6xl">
						<Breadcrumb />
						{children}
					</div>
				</main>
			</body>
		</html>
	);
}
