"use client";

import { useEffect, useState } from "react";
import { Bell, Trash2 } from "lucide-react";
import styles from "./notifications.module.css";
import api from "../lib/axios";

type Notice = {
  _id: string;
  userId: string;
  message: string;
  createdAt: string;
};

export default function NotificationsPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loaded, setLoaded] = useState(false);  // Used as for loading measn in to show notifcations on while

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await api.get("/notifications");
        setNotices(response.data.notifications ?? []);
      } catch (error) {
        console.error("Could not fetch notifications", error);
      } finally {
        setLoaded(true);
      }
    }

    fetchNotifications();
  }, []);

  async function deleteNotification(id: string) {
    try {
      await api.delete(`/notifications/${id}`);
      setNotices((currentNotices) =>
        currentNotices.filter((notice) => notice._id !== id),
      );
    } catch (error) {
      console.error("Could not delete notification", error);
    }
  }

  if (!loaded) return <main className={styles.page} aria-busy="true" />;

  return (
    <main className={styles.page}>
      <header className={styles.pageHeading}>
        <div>
          <h1>
            Notifications
          </h1>
          <p>Stay up to date with your tasks, projects, and teams.</p>
        </div>
      </header>

      <section className={styles.noticePanel}>
        <div className={styles.toolbar}>
          <div className={styles.filters}>
            <span>All</span>
            <span>{notices.length}</span>
          </div>
          <span className={styles.activityLabel}>
            <Bell size={14} />
            Recent activity
          </span>
        </div>

        <div className={styles.noticeList}>
          {notices.length ? (
            notices.map((notice) => (
              <article className={styles.noticeRow} key={notice._id}>
                <div className={styles.noticeLink}>
                  <span className={styles.noticeIcon}>
                    <Bell size={18} />
                  </span>

                  <span className={styles.noticeContent}>
                    <span className={styles.noticeTitle}>Notification</span>
                    <span className={styles.message}>{notice.message}</span>
                    <span className={styles.related}>RedSun Activity</span>
                  </span>

                  <span className={styles.noticeTime}>
                    {new Date(notice.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className={styles.noticeActions}>
                  <button
                    className={styles.readButton}
                    onClick={() => deleteNotification(notice._id)}
                    aria-label="Delete notification"
                    title="Delete notification"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className={styles.empty}>
              <span><Bell size={22} /></span>
              <h2>No notifications yet</h2>
              <p>New updates from your teams will show up here.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
