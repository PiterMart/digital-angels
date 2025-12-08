"use client";
import HeroSection from "../components/HeroSection";
import Menu from "../components/Menu";
import Link from "next/link";


const menuItems = [
  { text: "nvm", href: "/" },
];
const handleMenuSelect = (selectedItem) => {
  // Handle menu selection if needed
  window.location.href = selectedItem.href;
};

export default function Credits() {
  return (
    <div style={{ 
      backgroundColor: 'white', 
      minHeight: '100vh', 
      width: '100%',
      margin: 0,
      padding: 0
    }}>
    <Menu 
      menuItems={menuItems} 
      onSelect={handleMenuSelect}
                      layout="centered"
    />
      <HeroSection />
      <Link href="/" style={{color: "gray", textDecoration: "underline", fontSize: "1.5rem", fontWeight: "bold", marginTop: "2rem", bottom: "0px", position: "fixed", right: "50px", zIndex: "1000"}}>Go Home</Link>
    </div>
  );
}
