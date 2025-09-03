"use client";
import HeroSection from "../components/HeroSection";
import Menu from "../components/Menu";


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
    </div>
  );
}
