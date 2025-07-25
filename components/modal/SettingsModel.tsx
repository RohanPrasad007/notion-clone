import React from "react";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { userSettings } from "@/hooks/useSettings";
import { Label } from "../ui/label";
import { ModeToggle } from "../ModeToggle";

function SettingsModel() {
  const settings = userSettings();
  return (
    <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">My settings</h2>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <Label>Appearnce</Label>
            <span className="text-[0.8rem] text-muted-foreground">
              Customize how Notion looks on your devive
            </span>
          </div>
          <ModeToggle />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SettingsModel;
