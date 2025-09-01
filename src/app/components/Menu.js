"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../styles/page.module.css";

export default function Menu({ menuItems, onSelect }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleKeyDown = (event) => {
    switch (event.key) {
      case "ArrowLeft":
        setSelectedIndex(prev => prev === 0 ? menuItems.length - 1 : prev - 1);
        break;
      case "ArrowRight":
        setSelectedIndex(prev => prev === menuItems.length - 1 ? 0 : prev + 1);
        break;
      case "Enter":
      case " ":
        // Call the onSelect callback with the selected item
        if (onSelect) {
          onSelect(menuItems[selectedIndex]);
        } else {
          // Fallback to direct navigation if no callback provided
          window.location.href = menuItems[selectedIndex].href;
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, menuItems, onSelect]);

  return (
    <div className={`${styles.menu} ${styles.menuVisible}`}>
      {menuItems.map((item, index) => (
        <div key={index} className={styles.menuItem}>
          {selectedIndex === index && (
            <Image
              src="/l0_sprite_2.png"
              alt="Selection indicator"
              width={270}
              height={270}
              className={styles.selectionIndicator}
            />
          )}
          <a 
            href={item.href}
            className={selectedIndex === index ? styles.selected : ''}
          >
            {item.text}
          </a>
        </div>
      ))}
    </div>
  );
}
