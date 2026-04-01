"use client";

import { motion } from "framer-motion";
import styles from "./Timeline.module.css";

const timelineEvents = [
  {
    id: 1,
    date: "1 April 2026",
    title: "Registration Opens",
    description: "Registration form opens at 10:00 PM",
    icon: "🚀"
  },
  {
    id: 2,
    date: "4 April 2026",
    title: "Registration Closes & Slot Announcement",
    description: "Registration closes at 9:00 PM. By 12:00 PM, shortlisted participants for screening will be able to see their screening slot on the website.",
    icon: "⏳"
  },
  {
    id: 3,
    date: "5 April 2026",
    title: "Screening Round",
    description: "Shortlisted participants will appear for the screening round. Participants will be given a topic to speak on. Speaking skills, confidence, structure, and expression will be evaluated.",
    icon: "🎤"
  },
  {
    id: 4,
    date: "5 April 2026",
    title: "Final Screening Result",
    description: "Selected participants will be informed by 11:00 PM. A payment mail will also be sent to selected participants.",
    icon: "✅"
  },
  {
    id: 5,
    date: "6 April 2026",
    title: "Ministry Allotment",
    description: "Selected participants will receive their assigned ministry/role by 10:00 AM.",
    icon: "🏛️"
  },
  {
    id: 6,
    date: "7 April 2026",
    title: "Online Demo Meeting",
    description: "An online briefing/demo run will be conducted for all selected participants.",
    icon: "💻"
  },
  {
    id: 7,
    date: "8 April 2026",
    title: "Final Event Day",
    description: "Final event will be conducted on campus from 8:30 AM to 4:20 PM. OD will be provided for all eligible participants.",
    icon: "🏆"
  }
];

export default function Timeline() {
  return (
    <main className={styles.timelinePage}>
      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={styles.title}>Official <span className={styles.highlight}>Timeline</span></h1>
          <p className={styles.subtitle}>
            Your roadmap to the Viksit Bharat Youth Parliament 2026. Stay on track with these critical dates.
          </p>
        </motion.div>

        <div className={styles.timelineWrapper}>
          <div className={styles.line}></div>
          
          {timelineEvents.map((event, index) => (
            <motion.div 
              key={event.id}
              className={`${styles.timelineItem} ${index % 2 === 0 ? styles.left : styles.right}`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 * (index % 3) }}
            >
              <div className={styles.dot}>
                <span className={styles.icon}>{event.icon}</span>
              </div>
              <div className={styles.card}>
                <div className={styles.date}>{event.date}</div>
                <h3 className={styles.cardTitle}>{event.title}</h3>
                <p className={styles.cardDescription}>{event.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
