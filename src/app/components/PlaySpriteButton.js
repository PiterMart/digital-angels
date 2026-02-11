"use client";
import { useState, useEffect } from "react";

const SPRITES = ["/sprite1.png", "/sprite2.png", "/sprite3.png"];
const FRAME_MS = 280;

export default function PlaySpriteButton({ onClick }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setFrame((f) => (f + 1) % SPRITES.length);
    }, FRAME_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 25,
        cursor: "pointer",
        padding: 0,
        border: "none",
        background: "transparent",
        display: "block",
      }}
      aria-label="Play"
    >
      <img
        src={SPRITES[frame]}
        alt=""
        style={{
          maxWidth: "min(40vw, 200px)",
          height: "auto",
          display: "block",
          pointerEvents: "none",
        }}
      />
    </button>
  );
}
