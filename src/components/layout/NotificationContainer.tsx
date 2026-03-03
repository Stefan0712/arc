import { clsx } from 'clsx';
import { useNotificationStore } from '../../store/useNotificationStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useSettingsStore } from '../../store/useSettingsStore';

export const NotificationContainer = () => {
  const {notifications, hideNotification} = useNotificationStore();
  const settings = useSettingsStore();

  const typeStyles = {
    success: "bg-notification-success text-notification-success-text",
    error: "bg-notification-error text-notification-error-text",
    info: "bg-notification-info text-notification-info-text",
  };

  if (!settings.notificationsEnabled) return null;
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[999] flex flex-col gap-3 w-full max-w-md px-4 pointer-events-none">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            onClick={()=>hideNotification(n.id)}
            className={clsx(
              "p-4 cursor-pointer rounded-button border border-notification-border shadow-2xl pointer-events-auto flex items-center justify-between",
              typeStyles[n.type]
            )}
          >
            <span className="font-medium">{n.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};