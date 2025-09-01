import useNotification from "@/hooks/states/useNotification";
import { fetchNotificationRecipientsBySelf } from "@/services/notification-recipient.service";
import type { TNotificationRecipient } from "@/types/notification-recipient";
import type { TUserState } from "@/types/state.type";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";

const NotificationApplier = () => {
  const {
    setTotal,
    setUnread,
    setIsConnected,
    setNotification,
    updateNotification,
  } = useNotification();

  const { data } = useQuery({
    queryKey: ["notifications-count"],
    queryFn: () => fetchNotificationRecipientsBySelf({ is_count_only: true }),
  });

  useEffect(() => {
    if (data?.data) {
      setUnread(Number(data?.meta?.statistics?.unread || 0));
      setTotal(Number(data?.meta?.total || 0));
    }
  }, [data]);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    const user: TUserState | null = userString
      ? (JSON.parse(userString) as TUserState)
      : null;

    if (!user?.token) return;

    const socket: Socket = io(import.meta.env.VITE_API_URL, {
      auth: { token: user.token },
    });

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on(
      "notification-recipient-created",
      (recipient: TNotificationRecipient) => {
        setNotification(recipient);

        if (Notification.permission === "granted") {
          new Notification(recipient.notification.title, {
            body: recipient.notification.message,
            icon: "/notification.svg",
          });
        }
      },
    );

    socket.on(
      "notification-recipient-updated",
      (data: { _id: string; read_at: string }) => {
        updateNotification(data);
      },
    );

    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
};

export default NotificationApplier;
