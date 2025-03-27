
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui-components/Card";

export function ExportSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Settings</CardTitle>
        <CardDescription>Customize your export preferences.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {/* Export settings content here */}
      </CardContent>
    </Card>
  );
}
