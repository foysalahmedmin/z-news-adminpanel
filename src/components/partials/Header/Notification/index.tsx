import { Drawer } from "@/components/ui/Drawer";
import useSetting from "@/hooks/states/useSetting";
import { BellIcon, MoveLeft, MoveRight } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router";

const Notification: React.FC = () => {
  const { setting } = useSetting();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex h-full items-center">
      <button onClick={() => setIsOpen(true)} className="relative">
        <BellIcon className="size-6 cursor-pointer" />
        <span className="bg-accent text-accent-foreground absolute -top-1 -right-1 inline-flex h-4 min-w-4 transform items-center justify-center rounded-full text-xs">
          0
        </span>
      </button>
      <Drawer isOpen={isOpen} setIsOpen={setIsOpen} asPortal side="right">
        <Drawer.Backdrop />
        <Drawer.Content
          className="flex h-screen w-80 max-w-[90vw] flex-col"
          side={setting.direction == "rtl" ? "left" : "right"}
        >
          <Drawer.Header className="h-16 border-b">
            <Drawer.Title className="uppercase">Notification</Drawer.Title>
            <Drawer.Close className="size-8 rounded-full" />
          </Drawer.Header>

          <Drawer.Body className="flex-1 overflow-y-auto">
            <div className="bg-muted text-muted-foreground mb-4 flex flex-wrap items-center gap-2 rounded p-4 text-left text-sm"></div>

            <div className="space-y-4"></div>
          </Drawer.Body>
          <Drawer.Footer className="flex h-16 items-center justify-center border-t">
            <Link
              to={"/notification"}
              className="flex items-center gap-2 hover:underline"
            >
              View All Notifications{" "}
              {setting.direction === "ltr" ? (
                <MoveRight strokeWidth={1} />
              ) : (
                <MoveLeft strokeWidth={1} />
              )}
            </Link>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
    </div>
  );
};

export default Notification;
