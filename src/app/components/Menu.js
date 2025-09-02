"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "../styles/page.module.css";

// Animated Select Indicator Component
function AnimatedSelectIndicator({ onClick, className, style }) {
  const [currentFrame, setCurrentFrame] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev % 3) + 1);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <Image
      src={`/l0_sprite_${currentFrame}.png`}
      alt="Selection indicator"
      width={270}
      height={270}
      className={className}
      onClick={onClick}
      style={style}
    />
  );
}

export default function Menu({ menuItems, onSelect, layout = "default", defaultSelectedIndex = 0 }) {
  const [selectedIndex, setSelectedIndex] = useState(defaultSelectedIndex);
  const [gamepad, setGamepad] = useState(null);
  const [gamepadInput, setGamepadInput] = useState({ x: 0, y: 0, fire: false, buttons: [] });
  const [isControllerActive, setIsControllerActive] = useState(false);
  const lastInputTime = useRef(0);
  const lastButtonTime = useRef(0);
  const controllerActivityTimeout = useRef(null);
  const inputCooldown = 150; // milliseconds between navigation inputs
  const buttonCooldown = 300; // milliseconds between button presses

  const handleKeyDown = (event) => {
    switch (event.key) {
      case "ArrowLeft":
        if (layout !== "vertical") {
          setSelectedIndex(prev => prev === 0 ? menuItems.length - 1 : prev - 1);
        }
        break;
      case "ArrowRight":
        if (layout !== "vertical") {
          setSelectedIndex(prev => prev === menuItems.length - 1 ? 0 : prev + 1);
        }
        break;
      case "ArrowUp":
        if (layout === "vertical") {
          setSelectedIndex(prev => prev === 0 ? menuItems.length - 1 : prev - 1);
        }
        break;
      case "ArrowDown":
        if (layout === "vertical") {
          setSelectedIndex(prev => prev === menuItems.length - 1 ? 0 : prev + 1);
        }
        break;
      case "Enter":
      case " ":
        handleSelect();
        break;
      default:
        break;
    }
  };

  const handleSelect = () => {
    // Call the onSelect callback with the selected item
    if (onSelect) {
      onSelect(menuItems[selectedIndex]);
    } else {
      // Fallback to direct navigation if no callback provided
      window.location.href = menuItems[selectedIndex].href;
    }
  };

  const handleMenuItemClick = (index) => {
    setSelectedIndex(index);
    // Small delay to allow visual feedback before selection
    setTimeout(() => {
      handleSelect();
    }, 100);
  };

  const handleSelectionIndicatorClick = () => {
    handleSelect();
  };

  // Gamepad handling functions
  const handleGamepadConnect = (e) => {
    console.log("Atari controller connected:", e.gamepad);
    setGamepad(e.gamepad);
  };

  const handleGamepadDisconnect = () => {
    console.log("Atari controller disconnected");
    setGamepad(null);
  };

  const processGamepadInput = () => {
    const gp = navigator.getGamepads()[0];
    if (!gp) return;

    const deadzone = 0.5; // Increased deadzone for more reliable navigation
    const currentTime = Date.now();
    
    // Check for specific buttons (typically button 0 is A/Select, button 1 is B/Cancel)
    const selectButtonPressed = gp.buttons[0] && gp.buttons[0].pressed;
    const cancelButtonPressed = gp.buttons[1] && gp.buttons[1].pressed;
    const anyButtonPressed = gp.buttons.some(button => button.pressed);
    
    // Update gamepad input state
    setGamepadInput({
      x: gp.axes[0].toFixed(2),
      y: gp.axes[1].toFixed(2),
      fire: anyButtonPressed,
      buttons: gp.buttons.map((button, index) => ({ index, pressed: button.pressed, value: button.value }))
    });

    // Check for any controller activity
    const hasActivity = anyButtonPressed || Math.abs(gp.axes[0]) > deadzone || Math.abs(gp.axes[1]) > deadzone;
    
    if (hasActivity) {
      setIsControllerActive(true);
      // Clear any existing timeout
      if (controllerActivityTimeout.current) {
        clearTimeout(controllerActivityTimeout.current);
      }
      // Set timeout to hide controller indicator after 2 seconds of inactivity
      controllerActivityTimeout.current = setTimeout(() => {
        setIsControllerActive(false);
      }, 2000);
    }

    // Handle button presses for selection (separate from navigation)
    if (selectButtonPressed && currentTime - lastButtonTime.current > buttonCooldown) {
      handleSelect();
      lastButtonTime.current = currentTime;
      return; // Don't process navigation when selecting
    }

    // Check if enough time has passed since last navigation input
    if (currentTime - lastInputTime.current < inputCooldown) {
      return;
    }

    // Handle joystick navigation
    const xAxis = gp.axes[0];
    const yAxis = gp.axes[1];

    // Horizontal navigation (left/right)
    if (Math.abs(xAxis) > deadzone && layout !== "vertical") {
      if (xAxis < -deadzone) {
        // Left
        setSelectedIndex(prev => prev === 0 ? menuItems.length - 1 : prev - 1);
        lastInputTime.current = currentTime;
      } else if (xAxis > deadzone) {
        // Right
        setSelectedIndex(prev => prev === menuItems.length - 1 ? 0 : prev + 1);
        lastInputTime.current = currentTime;
      }
    }

    // Vertical navigation (up/down)
    if (Math.abs(yAxis) > deadzone && layout === "vertical") {
      if (yAxis < -deadzone) {
        // Up
        setSelectedIndex(prev => prev === 0 ? menuItems.length - 1 : prev - 1);
        lastInputTime.current = currentTime;
      } else if (yAxis > deadzone) {
        // Down
        setSelectedIndex(prev => prev === menuItems.length - 1 ? 0 : prev + 1);
        lastInputTime.current = currentTime;
      }
    }
  };

  useEffect(() => {
    // Keyboard event listeners
    window.addEventListener("keydown", handleKeyDown);
    
    // Gamepad event listeners
    window.addEventListener("gamepadconnected", handleGamepadConnect);
    window.addEventListener("gamepaddisconnected", handleGamepadDisconnect);

    // Gamepad input loop
    const gamepadLoop = () => {
      processGamepadInput();
      requestAnimationFrame(gamepadLoop);
    };
    gamepadLoop();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("gamepadconnected", handleGamepadConnect);
      window.removeEventListener("gamepaddisconnected", handleGamepadDisconnect);
      // Clean up controller activity timeout
      if (controllerActivityTimeout.current) {
        clearTimeout(controllerActivityTimeout.current);
      }
    };
  }, [selectedIndex, menuItems, onSelect, layout]);

  const getMenuClassName = () => {
    const baseClass = `${styles.menu} ${styles.menuVisible}`;
    if (layout === "centered") {
      return `${baseClass} ${styles.menuCentered}`;
    } else if (layout === "vertical") {
      return `${baseClass} ${styles.menuVertical}`;
    } else if (layout === "top") {
      return `${baseClass} ${styles.menuTop}`;
    }
    return baseClass;
  };

  return (
    <div>
      {/* Controller indicator */}
      {gamepad && isControllerActive && (
        <div style={{ 
          position: 'fixed', 
          top: '20px', 
          left: '20px', 
          background: 'rgba(0,255,0,0.8)', 
          color: 'black', 
          padding: '8px 12px', 
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 'bold',
          zIndex: 1000,
          animation: 'pulse 1s infinite'
        }}>
          🎮 Controller Active
        </div>
      )}

      {/* Optional debug display for gamepad input - remove in production */}
      {process.env.NODE_ENV === 'development' && gamepad && (
        <div style={{ 
          position: 'fixed', 
          top: '10px', 
          right: '10px', 
          background: 'rgba(0,0,0,0.8)', 
          color: 'white', 
          padding: '10px', 
          borderRadius: '5px',
          fontSize: '12px',
          zIndex: 1000
        }}>
          <div>Atari Controller Connected</div>
          <div>X: {gamepadInput.x}</div>
          <div>Y: {gamepadInput.y}</div>
          <div>Select (B0): {gamepadInput.buttons[0]?.pressed ? "🔥" : "○"}</div>
          <div>Cancel (B1): {gamepadInput.buttons[1]?.pressed ? "🔥" : "○"}</div>
          <div style={{ marginTop: '5px' }}>
            All Buttons:
            {gamepadInput.buttons.map((button, index) => (
              <div key={index} style={{ marginLeft: '10px' }}>
                B{button.index}: {button.pressed ? "🔥" : "○"} ({button.value.toFixed(2)})
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className={getMenuClassName()}>
        {menuItems.map((item, index) => (
          <div key={index} className={styles.menuItem}>
            {selectedIndex === index && (
              <AnimatedSelectIndicator
                className={styles.selectionIndicator}
                onClick={handleSelectionIndicatorClick}
                style={{ cursor: 'pointer' }}
              />
            )}
            <a 
              href={item.href}
              className={selectedIndex === index ? styles.selected : ''}
              onClick={(e) => {
                e.preventDefault();
                handleMenuItemClick(index);
              }}
              style={{ cursor: 'pointer' }}
            >
              {item.text}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
