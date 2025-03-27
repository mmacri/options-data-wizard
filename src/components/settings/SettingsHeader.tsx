
import React from "react";
import { Button } from "@/components/ui/button";

interface SettingsHeaderProps {
  onReset: () => void;
  onSave: () => void;
}

export function SettingsHeader({ onReset, onSave }: SettingsHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-light">Settings</h1>
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={onReset}>
          Reset to Defaults
        </Button>
        <Button onClick={onSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
