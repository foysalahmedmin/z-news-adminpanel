import {
  fetchNotificationRecipientsBySelf,
  readAllNotificationRecipientBySelf,
} from "@/services/notification-recipient.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFetchNotifications = (page = 1, limit = 20) =>
  useQuery({
    queryKey: ["notifications", page, limit],
    queryFn: () => fetchNotificationRecipientsBySelf({ page, limit }),
  });

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (_id: string) =>
      readAllNotificationRecipientBySelf(_id, { is_read: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-count"] });
    },
  });
};
