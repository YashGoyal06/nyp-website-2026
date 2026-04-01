"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Contact.module.css";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <main className={styles.page}>
      <div className={styles.glowLeft} />
      <div className={styles.glowRight} />

      <div className={styles.container}>
        {/* Header */}
        <motion.div
          className={styles.pageHeader}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <p className={styles.overline}>NSS Unit — VIT Bhopal University</p>
          <h1 className={styles.pageTitle}>
            Get in <span className={styles.highlight}>Touch</span>
          </h1>
          <p className={styles.pageSubtitle}>
            Have a question about the event? We&apos;re here to help. Reach out and we&apos;ll get back to you.
          </p>
        </motion.div>

        <div className={styles.grid}>
          {/* Contact Info */}
          <motion.div
            className={styles.infoColumn}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div className={styles.infoCard}>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><Mail size={22} /></div>
                <div>
                  <p className={styles.infoLabel}>Email</p>
                  <a href="mailto:nss@vitbhopal.ac.in" className={styles.infoValue}>
                    nss@vitbhopal.ac.in
                  </a>
                </div>
              </div>

              <div className={styles.divider} />

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><MapPin size={22} /></div>
                <div>
                  <p className={styles.infoLabel}>Location</p>
                  <p className={styles.infoValue}>AB-323 (AB-01) VIT Bhopal University,<br />Sehore, Madhya Pradesh</p>
                </div>
              </div>

              <div className={styles.divider} />

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>🕘</div>
                <div>
                  <p className={styles.infoLabel}>Response Time</p>
                  <p className={styles.infoValue}>Within 24–48 hours</p>
                </div>
              </div>
            </div>

            <div className={styles.eventCard}>
              <h3 className={styles.eventCardTitle}>📅 Event Date</h3>
              <p className={styles.eventCardDate}>8 April 2026</p>
              <p className={styles.eventCardSub}>VIT Bhopal University Campus</p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className={styles.formColumn}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  className={styles.successCard}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <CheckCircle size={56} className={styles.successIcon} />
                  <h2>Details Saved!</h2>
                  <p>
                    Your message has been recorded successfully. Our team will get back to you soon.
                  </p>
                  <button
                    className={styles.resetBtn}
                    onClick={() => setStatus("idle")}
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  className={styles.formCard}
                  onSubmit={handleSubmit}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className={styles.formTitle}>Send us a Message</h2>

                  <AnimatePresence>
                    {status === "error" && (
                      <motion.div
                        className={styles.errorBanner}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <AlertCircle size={18} />
                        Something went wrong. Please try again or email us directly.
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className={styles.formGroup}>
                    <label>Your Name *</label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Your Email *</label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Subject *</label>
                    <select
                      required
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                    >
                      <option value="">Select a subject</option>
                      <option value="Registration Query">Registration Query</option>
                      <option value="Payment Query">Payment Query</option>
                      <option value="Event Information">Event Information</option>
                      <option value="Technical Issue">Technical Issue</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Message *</label>
                    <textarea
                      required
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Write your message here..."
                    />
                  </div>

                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={status === "submitting"}
                  >
                    {status === "submitting" ? (
                      <>
                        <div className={styles.spinner} /> Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} /> Send Message
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
