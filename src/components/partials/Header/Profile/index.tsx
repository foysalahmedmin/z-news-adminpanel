import useUser from "@/hooks/states/useUser";
import { UserIcon } from "lucide-react";
import React from "react";

const Profile: React.FC = () => {
  const { user } = useUser();
  const {
    name = "Foysal Ahmed",
    email = "tDx0R@example.com",
    image,
    role = "admin",
  } = user?.info || {};
  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="text-end">
          <div className="text-sm font-semibold">{name}</div>
          <div className="text-muted-foreground text-xs font-bold capitalize">
            {role}
          </div>
        </div>
        <div className="size-10 overflow-hidden rounded-md">
          {image ? (
            <img src="" alt="" />
          ) : (
            <div className="bg-accent text-accent-foreground flex size-full items-center justify-center">
              <UserIcon className="size-6" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
