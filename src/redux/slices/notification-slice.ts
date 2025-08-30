import type { TNotificationRecipient } from "@/types/notification-recipient";
import type { NotificationsState } from "@/types/state.type";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState: NotificationsState = {
  notifications: [],
  unread: 0,
  total: 0,
  isConnected: false,
};

const notificationsSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification: (state, action: PayloadAction<TNotificationRecipient>) => {
      state.notifications.unshift(action.payload);
      state.unread += 1;
    },
    updateNotification: (
      state,
      action: PayloadAction<{ _id: string; read_at: string }>,
    ) => {
      state.notifications = state.notifications.map((recipient) =>
        recipient._id === action.payload._id
          ? {
              ...recipient,
              is_read: true,
              read_at: new Date(action.payload.read_at),
            }
          : recipient,
      );
      state.unread = Math.max(0, state.unread - 1);
    },
    setUnread: (state, action: PayloadAction<number>) => {
      state.unread = action.payload;
    },
    setTotal: (state, action: PayloadAction<number>) => {
      state.total = action.payload;
    },
    setIsConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
  },
});

export const {
  setNotification,
  updateNotification,
  setUnread,
  setTotal,
  setIsConnected,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
