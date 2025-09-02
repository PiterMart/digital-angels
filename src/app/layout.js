import "./globals.css";
import ConsoleLogger from "./components/ConsoleLogger";

export const metadata = {
  title: "'*•.¸♡Digital Angels ♡¸.•*'",
  description: "✧･ﾟ: *✧･ﾟ:*✧･ﾟ: *✧･ﾟ:*✧･ﾟ: *✧･ﾟ:*✧･ﾟ: *✧･ﾟ:*✧･ﾟ: *✧･ﾟ:*",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ConsoleLogger />
        {children}
      </body>
    </html>
  );
}
