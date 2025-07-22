"use client";
import React, { useEffect, useState } from "react";
import SettingsModel from "../modal/SettingsModel";
import CoverImageModal from "../modal/CoverImageModal";

function ModalProvider() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <SettingsModel />
      <CoverImageModal />
    </>
  );
}

export default ModalProvider;
