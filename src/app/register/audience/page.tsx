"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import styles from "./AudienceRegistration.module.css";
import Link from "next/link";
import { CheckCircle, AlertTriangle } from "lucide-react";

export default function AudienceRegistration() {
  const [formData, setFormData] = useState({
    fullName: "",
    registrationNumber: "",
    email: "",
    phone: "",
    branch: "",
    year: "1st Year",
    consent: false,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/register/audience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setIsSubmitted(true);
      } else {
        alert('Server returned an error. Please try again.');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  if (isSubmitted) {
    return (
      <main className={styles.pageWrap}>
        <motion.div 
          className={styles.successCard}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <CheckCircle className={styles.successIcon} size={64} />
          <h2>Thank you for registering as an audience.</h2>
          <div className={styles.successMessage}>
            <p>You will be notified soon with further instructions via email.</p>
            <br/>
            <p>Join the WhatsApp Group for further details :</p>
            <a href="https://chat.whatsapp.com/HnkUBcJDLdU0pxtaHsarmZ?mode=hqctswa" target="_blank" rel="noopener noreferrer" className={styles.whatsappLink}>
              Join WhatsApp Group
            </a>
          </div>
          <Link href="/" className={styles.primaryBtn} style={{marginTop: '2rem'}}>Return Home</Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className={styles.pageWrap}>
      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>Audience <span className={styles.highlight}>Registration</span></h1>
          <p>Register to witness the parliamentary proceedings and debates live.</p>
        </motion.div>

        <motion.div 
          className={styles.warningAlert}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className={styles.alertContent}>
            <AlertTriangle className={styles.warningIcon} size={28} />
            <div>
              <h3>IMPORTANT NOTICE</h3>
              <p>OD will not be provided to audience.</p>
            </div>
          </div>
        </motion.div>

        <motion.form 
          className={styles.formCard}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label>Full Name *</label>
              <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="First Last" />
            </div>

            <div className={styles.inputGroup}>
              <label>Registration Number *</label>
              <input required type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} placeholder="e.g. 21BCE10000" />
            </div>

            <div className={styles.inputGroup}>
              <label>College Email ID *</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@vitbhopal.ac.in" />
            </div>

            <div className={styles.inputGroup}>
              <label>Phone Number *</label>
              <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91" />
            </div>

            <div className={styles.inputGroup}>
              <label>Branch *</label>
              <input required type="text" name="branch" value={formData.branch} onChange={handleChange} placeholder="What is your branch?" />
            </div>

            <div className={styles.inputGroup}>
              <label>Year of Study *</label>
              <select required name="year" value={formData.year} onChange={handleChange}>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
          </div>

          <div className={`${styles.checkboxGroup} ${styles.fullWidth}`}>
            <input required type="checkbox" id="consent" name="consent" checked={formData.consent} onChange={handleChange} />
            <label htmlFor="consent">I understand that OD is not provided and agree to abide by the audience rules.</label>
          </div>

          <div className={styles.submitRow}>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Registration"}
            </button>
          </div>
        </motion.form>
      </div>
    </main>
  );
}
