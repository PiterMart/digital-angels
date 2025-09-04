"use client";
import { useEffect, useState } from "react";

export default function FontLoader() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fontError, setFontError] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        // Check if fonts are available
        if ('fonts' in document) {
          const fontCheck = await document.fonts.check('16px FT88');
          if (fontCheck) {
            console.log('FT88 font loaded successfully');
            setFontsLoaded(true);
          } else {
            console.warn('FT88 font not available, using fallback');
            setFontError(true);
          }
        } else {
          // Fallback for browsers without font API
          console.log('Font API not available, using fallback fonts');
          setFontError(true);
        }
      } catch (error) {
        console.error('Font loading error:', error);
        setFontError(true);
      }
    };

    // Try to load fonts
    loadFonts();

    // Fallback timeout - if fonts don't load within 3 seconds, use fallbacks
    const fallbackTimeout = setTimeout(() => {
      if (!fontsLoaded) {
        console.log('Font loading timeout, using fallback fonts');
        setFontError(true);
      }
    }, 3000);

    return () => clearTimeout(fallbackTimeout);
  }, [fontsLoaded]);

  // Apply fallback styles if fonts fail to load
  useEffect(() => {
    if (fontError) {
      // Force fallback fonts
      document.body.style.fontFamily = 'Arial, Helvetica, sans-serif';
      document.body.style.fontSize = '16px';
      
      // Add a class to body for CSS targeting
      document.body.classList.add('font-fallback');
      
      console.log('Applied fallback font styles');
    }
  }, [fontError]);

  return null; // This component doesn't render anything
}
