"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./RecapGallery.module.css";

const galleryItems = [
  { id: 1, src: "/recap_1.jpeg" },
  { id: 2, src: "/recap_2.jpeg" },
  { id: 3, src: "/recap_3.jpeg" },
  { id: 4, src: "/recap_4.jpeg" },
  { id: 5, src: "/recap_5.jpeg" },
];

export default function RecapGallery() {
  return (
    <section id="recap" className={styles.recapSection}>
      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>Recap: <span className={styles.highlight}>NYP 2024</span></h2>
          <p className={styles.subtitle}>Reliving the moments that shaped our last parliamentary session.</p>
        </motion.div>

        <div className={styles.grid}>
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.id}
              className={`${styles.card} ${index === 0 ? styles.featured : ""}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -10 }}
            >
              <div className={styles.imageWrapper}>
                <Image 
                  src={item.src} 
                  alt={`NYP 2024 Gallery Image ${item.id}`} 
                  width={600} 
                  height={400} 
                  className={styles.image}
                  loading="lazy"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
