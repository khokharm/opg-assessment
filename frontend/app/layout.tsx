import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata = {
  title: "weather.ai - AI-Powered Weather Predictions",
  description: "Advanced machine learning algorithms predict weather patterns with precision. Get intelligent forecasting backed by cutting-edge AI technology.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
