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
  const lastInputTime = useRef(0);
  const lastButtonTime = useRef(0);
  const selectedIndexRef = useRef(defaultSelectedIndex);
  const inputCooldown = 150; // milliseconds between navigation inputs
  const buttonCooldown = 300; // milliseconds between button presses

  const handleMenuItemClick = (index) => {
    setSelectedIndex(index);
    selectedIndexRef.current = index;
    // Small delay to allow visual feedback before selection
    setTimeout(() => {
      // Call the onSelect callback with the selected item
      if (onSelect) {
        onSelect(menuItems[index]);
      } else {
        // Fallback to direct navigation if no callback provided
        window.location.href = menuItems[index].href;
      }
    }, 100);
  };

  const handleSelectionIndicatorClick = () => {
    // Call the onSelect callback with the selected item
    if (onSelect) {
      onSelect(menuItems[selectedIndexRef.current]);
    } else {
      // Fallback to direct navigation if no callback provided
      window.location.href = menuItems[selectedIndexRef.current].href;
    }
  };

  useEffect(() => {
    const handleSelect = () => {
      // Call the onSelect callback with the selected item
      if (onSelect) {
        onSelect(menuItems[selectedIndexRef.current]);
      } else {
        // Fallback to direct navigation if no callback provided
        window.location.href = menuItems[selectedIndexRef.current].href;
      }
    };

    const handleKeyDown = (event) => {
      switch (event.key) {
        case "ArrowLeft":
          if (layout !== "vertical") {
            setSelectedIndex(prev => {
              const newIndex = prev === 0 ? menuItems.length - 1 : prev - 1;
              selectedIndexRef.current = newIndex;
              return newIndex;
            });
          }
          break;
        case "ArrowRight":
          if (layout !== "vertical") {
            setSelectedIndex(prev => {
              const newIndex = prev === menuItems.length - 1 ? 0 : prev + 1;
              selectedIndexRef.current = newIndex;
              return newIndex;
            });
          }
          break;
        case "ArrowUp":
          if (layout === "vertical") {
            setSelectedIndex(prev => {
              const newIndex = prev === 0 ? menuItems.length - 1 : prev - 1;
              selectedIndexRef.current = newIndex;
              return newIndex;
            });
          }
          break;
        case "ArrowDown":
          if (layout === "vertical") {
            setSelectedIndex(prev => {
              const newIndex = prev === menuItems.length - 1 ? 0 : prev + 1;
              selectedIndexRef.current = newIndex;
              return newIndex;
            });
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
      
      // Check for any button press (any button can be used for selection)
      const anyButtonPressed = gp.buttons.some(button => button.pressed);
      
      // Update gamepad input state
      setGamepadInput({
        x: gp.axes[0].toFixed(2),
        y: gp.axes[1].toFixed(2),
        fire: anyButtonPressed,
        buttons: gp.buttons.map((button, index) => ({ index, pressed: button.pressed, value: button.value }))
      });

      // Handle button presses for selection (separate from navigation)
      if (anyButtonPressed && currentTime - lastButtonTime.current > buttonCooldown) {
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
          setSelectedIndex(prev => {
            const newIndex = prev === 0 ? menuItems.length - 1 : prev - 1;
            selectedIndexRef.current = newIndex;
            return newIndex;
          });
          lastInputTime.current = currentTime;
        } else if (xAxis > deadzone) {
          // Right
          setSelectedIndex(prev => {
            const newIndex = prev === menuItems.length - 1 ? 0 : prev + 1;
            selectedIndexRef.current = newIndex;
            return newIndex;
          });
          lastInputTime.current = currentTime;
        }
      }

      // Vertical navigation (up/down)
      if (Math.abs(yAxis) > deadzone && layout === "vertical") {
        if (yAxis < -deadzone) {
          // Up
          setSelectedIndex(prev => {
            const newIndex = prev === 0 ? menuItems.length - 1 : prev - 1;
            selectedIndexRef.current = newIndex;
            return newIndex;
          });
          lastInputTime.current = currentTime;
        } else if (yAxis > deadzone) {
          // Down
          setSelectedIndex(prev => {
            const newIndex = prev === menuItems.length - 1 ? 0 : prev + 1;
            selectedIndexRef.current = newIndex;
            return newIndex;
          });
          lastInputTime.current = currentTime;
        }
      }
    };

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
    };
  }, [layout, menuItems, onSelect]);

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
