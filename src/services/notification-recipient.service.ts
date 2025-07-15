import api from "@/lib/api";
import type {
  TNotificationRecipientResponse,
  TNotificationRecipientsResponse,
} from "@/types/notification-recipient";

export async function fetchNotificationRecipientsBySelf(query?: {
  page?: number;
  limit?: number;
  is_read?: boolean;
  is_count_only?: boolean;
}): Promise<TNotificationRecipientsResponse> {
  const params = new URLSearchParams();

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });

  const url = `/api/v1/notification-recipient/bulk/self?${params.toString()}`;
  const response = await api.get(url);

  return response.data;
}

export async function fetchNotificationRecipientBySelf(
  _id: string,
): Promise<TNotificationRecipientResponse> {
  const url = `/api/v1/notification-recipient/one/${_id}/self`;
  const response = await api.get(url);

  return response.data;
}

export async function updateNotificationRecipientBySelf(
  _id: string,
  payload: { is_read: boolean },
): Promise<TNotificationRecipientResponse> {
  const url = `/api/v1/notification-recipient/one/${_id}/self`;
  const response = await api.patch(url, payload);

  return response.data;
}
