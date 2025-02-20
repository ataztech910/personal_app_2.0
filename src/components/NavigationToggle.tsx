"use client";

import { useState } from "react";

export default function NavigationToggle() {
  const [navigationToggle, setNavigationToggle] = useState(false);

  const handleNavigationToggler = () => {
    setNavigationToggle(!navigationToggle);
  };

  return (
    <button onClick={handleNavigationToggler} className="mi-header-toggler">
      {!navigationToggle ? "Menu" : "Close"}
    </button>
  );
}
