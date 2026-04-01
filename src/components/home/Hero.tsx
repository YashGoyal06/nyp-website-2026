"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import styles from "./Hero.module.css";
import Image from "next/image";
import CountdownTimer from "./CountdownTimer";

export default function Hero() {
  return (
    <section className={styles.heroSection}>
      {/* Parallax Background */}
      <div className={styles.parallaxBg}></div>
      <div className={styles.overlay}></div>

      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={styles.content}
        >
          {/* Banner / Header Image */}
          <motion.div 
            className={styles.headerImageContainer}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
          >
            <Image 
              src="/header.jpeg" 
              alt="Event Header" 
              width={500} 
              height={200} 
              className={styles.headerImage}
              priority
            />
          </motion.div>

          {/* Title Text Image */}
          <motion.div 
            className={styles.textImageContainer}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Image 
              src="/text.png" 
              alt="Viksit Bharat National Youth Parliament" 
              width={1100} 
              height={350} 
              className={styles.textImage}
              priority
            />
          </motion.div>

          <motion.h2
            className={styles.subtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
          >
            Where Young Minds Shape the Nation
          </motion.h2>

          <CountdownTimer />

          <motion.div
            className={styles.buttonGroup}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <Link href="/register/participant" className={styles.primaryButton}>
              Register as Participant
            </Link>
            <Link href="/register/audience" className={styles.secondaryButton}>
              Register as Audience
            </Link>
            <Link href="/login" className={styles.outlineButton}>
              Login
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
