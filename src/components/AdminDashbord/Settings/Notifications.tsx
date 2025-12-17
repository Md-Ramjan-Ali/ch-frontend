import React, { useEffect, useState } from "react";
import ToggleSwitch from "./ToggleSwitch";
import { useGetNotificationSettingsQuery, useUpdateNotificationSettingsMutation } from "@/redux/features/notificationSettings/notificationSettingsApi";
import toast from "react-hot-toast";
 

const NotificationItem: React.FC<{
  title: string;
  description: string;
  toggled: boolean;
  onToggle: (checked: boolean) => void;
}> = ({ title, description, toggled, onToggle }) => (
  <div className="flex items-center justify-between">
    <div>
      <h4 className="text-sm font-medium text-slate-800 dark:text-gray-100">
        {title}
      </h4>
      <p className="text-sm text-slate-500 dark:text-gray-400">
        {description}
      </p>
    </div>
    <ToggleSwitch checked={toggled} onChange={onToggle} />
  </div>
);

const Notifications: React.FC = () => {
  // Fetch notification settings
  const {
    data: settingsResponse,
    isLoading,
    isFetching,
  } = useGetNotificationSettingsQuery();

  const [updateSettings, { isLoading: isUpdating }] =
    useUpdateNotificationSettingsMutation();

  // Local UI state
  const [newUserReg, setNewUserReg] = useState(false);
  const [paymentNotifications, setPaymentNotifications] = useState(false);
  const [supportAlerts, setSupportAlerts] = useState(false);
  const [analyticsSummary, setAnalyticsSummary] = useState(false);
  const [welcomeEmail, setWelcomeEmail] = useState(false);
  const [learningReminders, setLearningReminders] = useState(false);
  const [achievementNotifications, setAchievementNotifications] =
    useState(false);

  // Sync API → state
  useEffect(() => {
    if (settingsResponse?.data) {
      const d = settingsResponse.data;
      setNewUserReg(d.newRegistrationAlert);
      setPaymentNotifications(d.paymentRelatedAlert);
      setSupportAlerts(d.supportTicketAlert);
      setAnalyticsSummary(d.dailyAnalyticsSummary);
      setWelcomeEmail(d.welcomeEmailEnabled);
      setLearningReminders(d.learningRemindersEnabled);
      setAchievementNotifications(d.achievementNotifications);
    }
  }, [settingsResponse]);

  // Save/Update handler
  const handleSave = async () => {
    try {
      await updateSettings({
        newRegistrationAlert: newUserReg,
        paymentRelatedAlert: paymentNotifications,
        supportTicketAlert: supportAlerts,
        dailyAnalyticsSummary: analyticsSummary,
        welcomeEmailEnabled: welcomeEmail,
        learningRemindersEnabled: learningReminders,
        achievementNotifications: achievementNotifications,
      }).unwrap();

    toast.success("Notification settings updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update notification settings.");
    }
  };

  if (isLoading || isFetching)
    return (
      <div className="p-8 text-slate-700 dark:text-gray-300">
        Loading notification settings...
      </div>
    );

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700 transition-colors">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-gray-100">
        Notification Settings
      </h2>
      <p className="text-slate-500 dark:text-gray-400 mt-1 text-sm">
        Configure system notifications and alerts
      </p>

      <div className="mt-8 space-y-8 divide-y divide-slate-200 dark:divide-gray-700">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100">
            Email Notifications
          </h3>
          <NotificationItem
            title="New User Registration"
            description="Get notified when new users register"
            toggled={newUserReg}
            onToggle={setNewUserReg}
          />
          <NotificationItem
            title="Payment Notifications"
            description="Alerts for successful and failed payments"
            toggled={paymentNotifications}
            onToggle={setPaymentNotifications}
          />
          <NotificationItem
            title="Support Ticket Alerts"
            description="New support tickets and urgent issues"
            toggled={supportAlerts}
            onToggle={setSupportAlerts}
          />
          <NotificationItem
            title="Daily Analytics Summary"
            description="Daily email with key metrics"
            toggled={analyticsSummary}
            onToggle={setAnalyticsSummary}
          />
        </div>

        <div className="pt-8 space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100">
            User Communication
          </h3>
          <NotificationItem
            title="Welcome Email"
            description="Send welcome email to new users"
            toggled={welcomeEmail}
            onToggle={setWelcomeEmail}
          />
          <NotificationItem
            title="Learning Reminders"
            description="Send study reminders to inactive users"
            toggled={learningReminders}
            onToggle={setLearningReminders}
          />
          <NotificationItem
            title="Achievement Notifications"
            description="Celebrate user milestones and achievements"
            toggled={achievementNotifications}
            onToggle={setAchievementNotifications}
          />
        </div>
      </div>

      <div className="flex justify-start pt-8 mt-4">
        <button
          type="button"
          disabled={isUpdating}
          onClick={handleSave}
          className={`inline-flex cursor-pointer justify-center py-2 px-4 shadow-sm text-sm font-medium rounded-md text-white transition-colors
            ${
              isUpdating
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } `}
        >
          {isUpdating ? "Saving..." : "Save Notification Settings"}
        </button>
      </div>
    </div>
  );
};

export default Notifications;
