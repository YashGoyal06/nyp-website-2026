"use client";

import { motion } from "framer-motion";
import styles from "./Team.module.css";

const WEBSITE_TEAM = [
  {
    name: "Yash Goyal",
    role: "Developer",
    img: "/3.jpeg",
    instagram: "https://www.instagram.com/__yash__06__?igsh=MTZqOGZjM281aDk2cQ==",
    linkedin: "https://www.linkedin.com/in/yashgoyal06?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  },
  {
    name: "Pratyush Dubey",
    role: "Developer",
    img: "/2.jpeg",
    instagram: "https://www.instagram.com/pratyush__dubey/",
    linkedin: "https://www.linkedin.com/in/dubeypratyush/",
  },
  { name: "Aditya Jain", role: "Developer", img: "/1.jpeg" },
];

const PROGRAM_OFFICERS = [
  { name: "Dr. Vinod Bhatt", role: "Program Officer", img: "/4.jpg" },
  { name: "Dr. Dev Brat Gupta", role: "Program Officer", img: "5.jpg" },
  { name: "Dr. Geetanjali Giri", role: "Program Officer", img: "6.jpg" },
  { name: "Ms. Dipti Bhojwani", role: "Program Officer", img: "7.jpg" },
];

interface TeamMember {
  name: string;
  role: string;
  img: string;
  instagram?: string;
  linkedin?: string;
}

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
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

      {(member.instagram || member.linkedin) && (
        <div className={styles.socials}>
          {member.instagram && (
            <a href={member.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.socialIcon}>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          )}
          {member.linkedin && (
            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.socialIcon}>
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          )}
        </div>
      )}
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

        {/* Program Officers — Now first */}
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
      </div>
    </main>
  );
}
