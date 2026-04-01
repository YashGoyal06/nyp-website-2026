"use client";

import { motion } from "framer-motion";
import styles from "./Instructions.module.css";
import Link from "next/link";

const instructions = [
  {
    number: "01",
    title: "Eligibility",
    text: "All participants must be students of VIT Bhopal University.",
  },
  {
    number: "02",
    title: "Login Requirement",
    text: "Registration and login must be done only through your official VIT Bhopal University email ID.",
  },
  {
    number: "03",
    title: "Single Account Access",
    text: "Once logged in with your college email ID, you cannot access the platform using another account unless you log out first.",
  },
  {
    number: "04",
    title: "Application Authenticity",
    text: "All details filled in the form must be accurate and genuine. Any false information may lead to disqualification.",
  },
  {
    number: "05",
    title: "Selection Process",
    text: "The selection decision made by the organizing team will be final and binding.",
  },
  {
    number: "06",
    title: "Ministry Allotment",
    text: "The ministry/role assigned by the organizing team will be final, and no requests for changes will be entertained.",
  },
  {
    number: "07",
    title: "Payment Criteria",
    text: "Only those participants who complete the payment after selection will be eligible to participate in the event.",
  },
  {
    number: "08",
    title: "Attendance Requirement",
    text: "Attendance during the event is mandatory. Failure to attend will result in no certificate issuance.",
  },
  {
    number: "09",
    title: "Code of Conduct",
    bullets: [
      "Participants must maintain discipline and decorum at all times.",
      "Use of appropriate and respectful language is mandatory.",
      "Any form of offensive, abusive, or inappropriate speech will not be tolerated.",
    ],
  },
  {
    number: "10",
    title: "Content Guidelines",
    bullets: [
      "Avoid using names of political parties, individuals, or sensitive remarks.",
      "Discussions should be formal, respectful, and issue-based.",
    ],
  },
  {
    number: "11",
    title: "Screening & Event Conduct",
    bullets: [
      "Your performance during screening and final event should reflect clarity, confidence, and professionalism.",
      "Any misconduct may lead to immediate disqualification.",
    ],
  },
  {
    number: "12",
    title: "Final Authority",
    text: "The organizing committee holds the final authority over all decisions and event proceedings.",
  },
];

export default function InstructionsPage() {
  return (
    <main className={styles.page}>
      <div className={styles.glowTop} />
      <div className={styles.glowBottom} />

      <div className={styles.container}>
        {/* Header */}
        <motion.div
          className={styles.pageHeader}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className={styles.scrollEmoji}>📜</div>
          <h1 className={styles.pageTitle}>
            Instructions
          </h1>
          <p className={styles.eventName}>Viksit Bharat Youth Parliament 2026</p>
          <p className={styles.pageSubtitle}>
            Please read all the instructions carefully before registering for the event.
          </p>
        </motion.div>

        {/* Instructions List */}
        <div className={styles.instructionsList}>
          {instructions.map((item, index) => (
            <motion.div
              key={item.number}
              className={styles.instructionCard}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
            >
              <div className={styles.numberBadge}>{item.number}</div>
              <div className={styles.instructionContent}>
                <h3 className={styles.instructionTitle}>{item.title}</h3>
                {item.text && (
                  <p className={styles.instructionText}>{item.text}</p>
                )}
                {item.bullets && (
                  <ul className={styles.bulletList}>
                    {item.bullets.map((b, i) => (
                      <li key={i} className={styles.bulletItem}>
                        <span className={styles.bullet}>•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Agreement */}
        <motion.div
          className={styles.agreement}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.checkIcon}>✅</div>
          <p className={styles.agreementText}>
            By registering, you agree to follow all the above instructions.
          </p>
          <div className={styles.nssTag}>
            <strong>NSS Unit – VIT Bhopal University</strong>
            <span className={styles.motto}>Not Me But You</span>
          </div>
          <div className={styles.actionRow}>
            <Link href="/register/participant" className={styles.registerBtn}>
              Register as Participant
            </Link>
            <Link href="/register/audience" className={styles.registerBtnOutline}>
              Register as Audience
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
