import React, { useEffect, useState } from "react";

function useOrigin() {
  const [mountend, setMountend] = useState(false);
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  useEffect(() => {
    setMountend(true);
  }, []);

  if (!mountend) {
    return "";
  }

  return origin;
}

export default useOrigin;
