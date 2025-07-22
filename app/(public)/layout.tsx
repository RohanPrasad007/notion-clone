import React from "react";

function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full flex dark:bg-[#1f1f1f]">
      <main className="w-full">{children}</main>
    </div>
  );
}

export default layout;
