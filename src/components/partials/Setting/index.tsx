"use client";

import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import useSetting from "@/hooks/states/useSetting";
import { Settings as SettingsIcon } from "lucide-react";
import { useState } from "react";
import { SettingOption } from "./Options";

type SettingName = "theme" | "direction" | "sidebar";

const Settings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setting } = useSetting();
  const settingOptions: SettingName[] = ["theme", "direction", "sidebar"];

  return (
    <div className="fixed right-6 bottom-6 z-50">
      {/* Trigger button */}
      <Button
        onClick={() => setIsOpen(true)}
        shape="icon"
        size="lg"
        className="group/button rounded-full"
      >
        <SettingsIcon className="group-hover/button:animate-spin" />
      </Button>

      {/* Drawer component */}
      <Drawer isOpen={isOpen} setIsOpen={setIsOpen} asPortal side="right">
        <Drawer.Backdrop />
        <Drawer.Content className="w-80 max-w-[90vw]" side={"right"}>
          <Drawer.Header className="h-16 border-b">
            <Drawer.Title className="uppercase">Settings</Drawer.Title>
            <Drawer.Close className="size-8 rounded-full" />
          </Drawer.Header>

          <Drawer.Body>
            <div className="mb-4 rounded bg-gray-100 p-4 text-sm text-gray-600">
              <strong>Current Settings:</strong>
              <br />
              Theme: {setting.theme},<br />
              Direction: {setting.direction},<br />
              Sidebar: {setting.sidebar}
            </div>

            <div className="space-y-4">
              {settingOptions.map((option) => (
                <SettingOption key={option} name={option} />
              ))}
            </div>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer>
    </div>
  );
};

export default Settings;
