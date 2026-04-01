"use client";

import { motion } from "framer-motion";
import styles from "./About.module.css";
import Image from "next/image";

export default function About() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <main className={styles.aboutPage}>
      {/* Decorative Glows */}
      <div className={styles.glowTopRight}></div>
      <div className={styles.glowCenter}></div>

      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h1 className={styles.title}>About <span className={styles.highlight}>The Event</span></h1>
          <p className={styles.subtitle}>
            A real-time parliamentary simulation under the Ministry of Parliamentary Affairs, organized by the NSS Unit, VIT Bhopal University.
          </p>
        </motion.div>

        <motion.section 
          className={styles.section}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <div className={styles.textContent}>
            <h2>Event Description</h2>
            <p>
              The NSS Unit of VIT Bhopal University is organizing the Viksit Bharat Youth Parliament 2026 on <strong>8 April 2026</strong> in the university campus. This initiative aims to ignite political awareness, encourage critical thinking, and provide students with a deeper understanding of India&apos;s democratic and parliamentary processes.
            </p>
            <p>
              The event will replicate the structure and functioning of the Indian Parliament, offering students a real-time mock parliamentary experience. Participants will take on roles such as Members of Parliament, Ministers, Parliamentary Leaders, and Key House Positions.
            </p>
            
            <div className={styles.goalsList}>
              <div className={styles.goalItem}>
                <span className={styles.checkIcon}>✓</span>
                <span>Build awareness about parliamentary functioning</span>
              </div>
              <div className={styles.goalItem}>
                <span className={styles.checkIcon}>✓</span>
                <span>Improve critical thinking on public issues</span>
              </div>
              <div className={styles.goalItem}>
                <span className={styles.checkIcon}>✓</span>
                <span>Enhance public speaking and debate</span>
              </div>
              <div className={styles.goalItem}>
                <span className={styles.checkIcon}>✓</span>
                <span>Develop structured discussion skills</span>
              </div>
              <div className={styles.goalItem}>
                <span className={styles.checkIcon}>✓</span>
                <span>Nurture leadership and decision-making abilities</span>
              </div>
            </div>
            <p className={styles.emphasized}>
              This event will serve as an excellent platform for students to learn, express, and represent themselves as responsible and aware citizens.
            </p>
          </div>
        </motion.section>

        <motion.section 
          className={styles.twoColumnSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <div className={styles.card}>
            <h3>4+ Years of Legacy</h3>
            <p>
              The NSS Unit has been organizing this event for the past 4 years. This event has helped many students and volunteers gain extraordinary exposure. Several volunteers have gone on to represent at state-level youth parliament opportunities.
            </p>
            <p>
              It has become a strong platform for youth voice, public speaking, democratic understanding, and leadership development.
            </p>
          </div>
          
          <div className={`${styles.card} ${styles.highlightCard}`}>
            <h3>Why This Event Matters</h3>
            <p>
              India needs informed youth voices. Democracy becomes stronger when youth participate actively and constructively in governance discussions.
            </p>
            <p>
              The Youth Parliament builds awareness, responsibility, and provides a stage for the leaders of tomorrow to formulate their vision.
            </p>
          </div>
        </motion.section>

        <motion.section 
          className={styles.certificateSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <div className={styles.certificateCard}>
            <div className={styles.certificateIcon}>📜</div>
            <div className={styles.certificateContent}>
              <h2>Official Recognition</h2>
              <p>
                Participants will receive an <strong>official certificate under the Ministry of Parliamentary Affairs</strong>, making this event a valuable addition to their academic and leadership profile.
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
