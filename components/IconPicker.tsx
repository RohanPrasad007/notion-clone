"use client";

import { useTheme } from "next-themes";
import React, { useState, useCallback } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { EmojiClickData, Theme } from "emoji-picker-react";

const EmojiPicker = React.lazy(() => import("emoji-picker-react"));

interface IconPickerProps {
  onChange: (icon: string) => void;
  children: React.ReactNode;
  asChild?: boolean;
}

function IconPicker({ onChange, children, asChild }: IconPickerProps) {
  const { resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const currentTheme = (resolvedTheme || "light") as "dark" | "light";

  const themeMap = {
    dark: Theme.DARK,
    light: Theme.LIGHT,
  };
  const theme = themeMap[currentTheme];

  const handleEmojiClick = useCallback(
    (data: EmojiClickData) => {
      onChange(data.emoji);
      setIsOpen(false);
    },
    [onChange]
  );

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      // Pre-load the component when popover opens
      if (open && !hasLoaded) {
        setHasLoaded(true);
      }
    },
    [hasLoaded]
  );

  const handleMouseEnter = useCallback(() => {
    // Pre-load on hover for even better UX
    if (!hasLoaded) {
      setHasLoaded(true);
    }
  }, [hasLoaded]);

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild={asChild} onMouseEnter={handleMouseEnter}>
        {children}
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[350px] border-none shadow-none">
        {isOpen && (
          <React.Suspense
            fallback={
              <div className="h-[350px] w-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            }
          >
            <EmojiPicker
              height={350}
              width="100%"
              theme={theme}
              lazyLoadEmojis
              onEmojiClick={handleEmojiClick}
              searchPlaceholder="Search emojis..."
              previewConfig={{
                showPreview: false,
              }}
            />
          </React.Suspense>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default React.memo(IconPicker);
