export interface NotificationSettingsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: NotificationSettings | null;
}

export interface NotificationSettings {
  id?: number;
  newRegistrationAlert: boolean;
  paymentRelatedAlert: boolean;
  supportTicketAlert: boolean;
  dailyAnalyticsSummary: boolean;
  welcomeEmailEnabled: boolean;
  learningRemindersEnabled: boolean;
  achievementNotifications: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type UpdateNotificationSettingsRequest = Omit<
  NotificationSettings,
  "id" | "createdAt" | "updatedAt"
>;
