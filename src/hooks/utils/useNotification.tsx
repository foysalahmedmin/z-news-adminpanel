import {
  fetchNotificationRecipientsBySelf,
  updateNotificationRecipientBySelf,
} from "@/services/notification-recipient.service";
import type { TNotificationRecipient } from "@/types/notification-recipient";
import type { TUserState } from "@/types/state.type";
import { useCallback, useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<TNotificationRecipient[]>(
    [],
  );
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Initialize socket connection
  useEffect(() => {
    const userString = localStorage.getItem("user");
    const user: TUserState | null = userString
      ? (JSON.parse(userString) as TUserState)
      : null;

    if (!user?.token) return;

    const socketInstance: Socket = io(import.meta.env.VITE_BASE_URL, {
      auth: { token: user.token },
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to notification server");
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      console.log("Disconnected from notification server");
    });

    socketInstance.on(
      "notification-recipient-created",
      (recipient: TNotificationRecipient) => {
        setNotifications((prev) => [recipient, ...prev]);
        setUnreadCount((prev) => prev + 1);

        if (Notification.permission === "granted") {
          new Notification(recipient.notification.title, {
            body: recipient.notification.message,
            icon: "/notification-icon.png",
          });
        }
      },
    );

    socketInstance.on(
      "notification-recipient-updated",
      (data: { _id: string; read_at: string }) => {
        setNotifications((prev) =>
          prev.map((recipient) =>
            recipient._id === data._id
              ? {
                  ...recipient,
                  is_read: true,
                  read_at: new Date(data.read_at),
                }
              : recipient,
          ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      },
    );

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Fetch notifications
  const fetchNotifications = useCallback(async (page = 1, limit = 20) => {
    try {
      const { data } = await fetchNotificationRecipientsBySelf({ page, limit });

      if (data) {
        setNotifications(data);
        return data;
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, []);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const { success, meta } = await fetchNotificationRecipientsBySelf({
        is_read: false,
        is_count_only: true,
      });

      if (success && meta) {
        setUnreadCount(meta?.total || 0);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        const { success } = await updateNotificationRecipientBySelf(
          notificationId,
          { is_read: true },
        );
        if (success) {
          socket?.emit("markAsRead", { notificationId });
        }
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    },
    [socket],
  );

  const requestNotificationPermission = useCallback(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  return {
    notifications,
    unreadCount,
    isConnected,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    requestNotificationPermission,
  };
};
