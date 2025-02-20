// app/components/NavigationToggler.tsx
"use client";

import { useState } from "react";
import LineIcon from "react-lineicons";

export default function NavigationToggler() {
  const [navigationToggler, setNavigationToggler] = useState(false);

  const handleNavigationToggler = () => {
    setNavigationToggler(!navigationToggler);
  };

  return (
    <button onClick={handleNavigationToggler} className="mi-header-toggler">
      {!navigationToggler ? <LineIcon name="menu" /> : <LineIcon name="close" />}
    </button>
  );
}
