
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui-components/Card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeOption } from "@/types/settings";

interface AppearanceSettingsProps {
  theme: ThemeOption;
  compactMode: boolean;
  showWelcomeScreen: boolean;
  onThemeChange: (theme: ThemeOption) => void;
  onCompactModeChange: (checked: boolean) => void;
  onShowWelcomeScreenChange: (checked: boolean) => void;
}

export function AppearanceSettings({
  theme,
  compactMode,
  showWelcomeScreen,
  onThemeChange,
  onCompactModeChange,
  onShowWelcomeScreenChange
}: AppearanceSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance Settings</CardTitle>
        <CardDescription>Customize the look and feel of your application.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="theme">Theme</Label>
          <Select
            value={theme}
            onValueChange={(value) => onThemeChange(value as ThemeOption)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between rounded-md border p-4">
          <div className="space-y-1 leading-none">
            <Label htmlFor="compact-mode">Compact Mode</Label>
            <p className="text-sm text-muted-foreground">Display data in a denser layout.</p>
          </div>
          <Switch 
            id="compact-mode" 
            checked={compactMode}
            onCheckedChange={onCompactModeChange}
          />
        </div>
        
        <div className="flex items-center justify-between rounded-md border p-4">
          <div className="space-y-1 leading-none">
            <Label htmlFor="show-welcome-screen">Show Welcome Screen</Label>
            <p className="text-sm text-muted-foreground">Display the welcome screen on first launch.</p>
          </div>
          <Switch 
            id="show-welcome-screen"
            checked={showWelcomeScreen}
            onCheckedChange={onShowWelcomeScreenChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
