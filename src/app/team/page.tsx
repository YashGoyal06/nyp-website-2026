"use client";

import { motion } from "framer-motion";
import styles from "./Team.module.css";

const WEBSITE_TEAM = [
  { name: "Yash Goyal", role: "Developer", img: "/3.jpeg" },
  { name: "Pratyush Dubey", role: "Developer", img: "/2.jpeg" },
  { name: "Aditya Jain", role: "Developer", img: "/1.jpeg" },
];

const PROGRAM_OFFICERS = [
  { name: "Dr. Vinod Bhatt", role: "Program Officer", img: "/4.jpg" },
  { name: "Dr. Dev Brat Gupta", role: "Program Officer", img: "5.jpg" },
  { name: "Dr. Geetanjali Giri", role: "Program Officer", img: "6.jpg" },
  { name: "Ms. Dipti Bhojwani", role: "Program Officer", img: "7.jpg" },
];

function TeamCard({ member, index }: { member: { name: string; role: string; img: string }; index: number }) {
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(member.name)}&backgroundType=gradientLinear&backgroundColor=b6e3f4,c0aede`;

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
    >
      <div className={styles.photoWrapper}>
        <div className={styles.photoRing}>
          <img
            src={member.img || avatarUrl}
            alt={`Photo of ${member.name}`}
            className={styles.photo}
            onError={(e) => {
              (e.target as HTMLImageElement).src = avatarUrl;
            }}
          />
        </div>
        <div className={styles.photoGlow} />
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.memberName}>{member.name}</h3>
        <span className={styles.memberRole}>{member.role}</span>
      </div>
    </motion.div>
  );
}

export default function TeamPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  };

  return (
    <main className={styles.page}>
      <div className={styles.glowLeft} />
      <div className={styles.glowRight} />

      <div className={styles.container}>
        {/* Page Header */}
        <motion.div
          className={styles.pageHeader}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <p className={styles.overline}>NSS Unit — VIT Bhopal University</p>
          <h1 className={styles.pageTitle}>
            Meet Our <span className={styles.highlight}>Team</span>
          </h1>
          <p className={styles.pageSubtitle}>
            The dedicated individuals who built and manage the Viksit Bharat Youth Parliament 2026.
          </p>
        </motion.div>

        {/* Website Development Team */}
        <section className={styles.section}>
          <motion.div
            className={styles.sectionHeader}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className={styles.sectionBadge}>💻</div>
            <h2 className={styles.sectionTitle}>Website Development Team</h2>
            <div className={styles.sectionDivider} />
          </motion.div>

          <div className={styles.grid}>
            {WEBSITE_TEAM.map((member, i) => (
              <TeamCard key={member.name} member={member} index={i} />
            ))}
          </div>
        </section>

        {/* Program Officers */}
        <section className={styles.section}>
          <motion.div
            className={styles.sectionHeader}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className={styles.sectionBadge}>🎓</div>
            <h2 className={styles.sectionTitle}>Program Officers</h2>
            <div className={styles.sectionDivider} />
          </motion.div>

          <div className={styles.grid}>
            {PROGRAM_OFFICERS.map((member, i) => (
              <TeamCard key={member.name} member={member} index={i} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
