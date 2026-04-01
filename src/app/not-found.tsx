"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.glowLeft} />
      <div className={styles.glowRight} />

      <div className={styles.container}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Big 404 */}
          <div className={styles.errorCode}>
            <span className={styles.digit}>4</span>
            <span className={styles.circle}>
              <span className={styles.circleInner}>🏛️</span>
            </span>
            <span className={styles.digit}>4</span>
          </div>

          <h1 className={styles.title}>Session Adjourned</h1>
          <p className={styles.subtitle}>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            The Parliament is in session — head back to the main chamber.
          </p>

          <div className={styles.actions}>
            <Link href="/" className={styles.primaryBtn}>
              Return to Home
            </Link>
            <Link href="/register/participant" className={styles.outlineBtn}>
              Register Now
            </Link>
          </div>

          <div className={styles.footer}>
            <span className={styles.tag}>VBNYP 2026</span>
            <span className={styles.sep}>·</span>
            <span className={styles.tag}>NSS Unit, VIT Bhopal</span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
