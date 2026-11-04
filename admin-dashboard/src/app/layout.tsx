import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { TabsProvider } from "@/context/TabsContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portfolio Admin Dashboard — Visual Studio Code",
  description: "Administrative console for managing portfolio projects, skills, inquiries, and analytics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-vscode-bgDark font-sans antialiased text-vscode-textLight selection:bg-vscode-bgLight selection:text-white">
        <AuthProvider>
          <TabsProvider>{children}</TabsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
