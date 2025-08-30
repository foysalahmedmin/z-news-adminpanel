import {
  setIsConnected as setIsConnectedSlice,
  setNotification as setNotificationSlice,
  setTotal as setTotalSlice,
  setUnread as setUnreadSlice,
  updateNotification as updateNotificationSlice,
} from "@/redux/slices/notification-slice";
import type { AppDispatch, RootState } from "@/redux/store";
import type { TNotificationRecipient } from "@/types/notification-recipient";
import { useDispatch, useSelector } from "react-redux";

const useNotification = () => {
  const dispatch = useDispatch<AppDispatch>();
  const notificationState = useSelector(
    (state: RootState) => state.notification,
  );

  // Action dispatchers
  const setNotification = (notification: TNotificationRecipient) =>
    dispatch(setNotificationSlice(notification));

  const updateNotification = (payload: { _id: string; read_at: string }) =>
    dispatch(updateNotificationSlice(payload));

  const setUnread = (count: number) => dispatch(setUnreadSlice(count));
  const setTotal = (count: number) => dispatch(setTotalSlice(count));

  const setIsConnected = (status: boolean) =>
    dispatch(setIsConnectedSlice(status));

  return {
    // State
    notifications: notificationState.notifications,
    unread: notificationState.unread,
    total: notificationState.total,
    isConnected: notificationState.isConnected,

    // Actions
    setNotification,
    updateNotification,
    setUnread,
    setTotal,
    setIsConnected,
  };
};

export default useNotification;
