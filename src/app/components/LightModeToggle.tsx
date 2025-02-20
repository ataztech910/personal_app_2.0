"use client";
import { useState, useEffect } from "react";
import * as Icon from "react-feather";
import Cookies from "js-cookie";

export default function LightModeToggle({ defaultMode }: { defaultMode: boolean }) {
  const [lightMode, setLightMode] = useState(defaultMode);

  useEffect(() => {
    if (lightMode) {
      document.body.classList.add("light");
      Cookies.set("lightMode", "true", { expires: 365 });
    } else {
      document.body.classList.remove("light");
      Cookies.set("lightMode", "false", { expires: 365 });
    }
  }, [lightMode]);

  return (
    <div className="light-switch">
      <span className="icon">
              <Icon.Sun />
            </span>
      <button
        className={lightMode ? "light-mode-switch active" : "light-mode-switch"}
        onClick={() => setLightMode(!lightMode)}
      >
        
      </button>
    </div>
  );
}
