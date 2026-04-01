"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./RecapGallery.module.css";

const galleryItems = [
  { id: 1, src: "/recap_1.jpeg" },
  { id: 2, src: "/recap_2.jpeg" },
  { id: 3, src: "/recap_3_v2.jpeg" },
  { id: 4, src: "/recap_4.jpeg" },
];

export default function RecapGallery() {
  return (
    <section id="recap" className={styles.recapSection}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.id}
              className={styles.card}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
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
