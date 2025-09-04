import "./globals.css";
import ConsoleLogger from "./components/ConsoleLogger";
import FontLoader from "./components/FontLoader";
import NetworkStatus from "./components/NetworkStatus";

export const metadata = {
  title: "'*•.¸♡Digital Angels ♡¸.•*'",
  description: "✧･ﾟ: *✧･ﾟ:*✧･ﾟ: *✧･ﾟ:*✧･ﾟ: *✧･ﾟ:*✧･ﾟ: *✧･ﾟ:*✧･ﾟ: *✧･ﾟ:*",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical fonts */}
        <link rel="preload" href="/fonts/FT88-Serif.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/FT88-Gothique.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        {/* Preload critical videos */}
        <link rel="preload" href="/videos/start.mp4" as="video" />
        <link rel="preload" href="/videos/introDA.mp4" as="video" />
      </head>
      <body>
        <FontLoader />
        <ConsoleLogger />
        <NetworkStatus />
        {children}
      </body>
    </html>
  );
}
