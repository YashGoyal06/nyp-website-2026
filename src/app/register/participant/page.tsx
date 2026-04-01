"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import styles from "./ParticipantRegistration.module.css";
import Link from "next/link";
import { CheckCircle, ExternalLink } from "lucide-react";

export default function ParticipantRegistration() {
  const generateSerialNumber = () => {
    const digits = Math.floor(1000 + Math.random() * 9000); // 4 random digits
    return `VBNYP${digits}`;
  };

  const [formData, setFormData] = useState({
    serialNumber: "",
    fullName: "",
    registrationNumber: "",
    email: "",
    phone: "",
    branch: "",
    year: "1st Year",
    gender: "",
    reason: "",
    experience: "",
    comfortableOutside: false,
    declaration: false,
  });

  useEffect(() => {
    setFormData(prev => ({ ...prev, serialNumber: generateSerialNumber() }));
  }, []);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.declaration) return;

    if (!formData.email.endsWith('@vitbhopal.ac.in')) {
      alert('Please use your official @vitbhopal.ac.in email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          payload.append(key, value.toString());
        }
      });

      const res = await fetch('/api/register/participant', {
        method: 'POST',
        body: payload,
      });

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        alert('Registration failed on server. Please report this error.');
      }
    } catch (err) {
      alert('Network or timeout error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
          <h2>Application Submitted!</h2>

          {/* Show Serial Number Prominently */}
          <div className={styles.serialBlock}>
            <p className={styles.serialLabel}>Your Login Serial Number</p>
            <div className={styles.serialDisplay}>{formData.serialNumber}</div>
            <p className={styles.serialWarning}>⚠️ Save this number! You'll need it to log in along with your VIT Registration Number.</p>
          </div>

          <div className={styles.successMessage}>
            <p>
              If you are shortlisted for the screening process, you will be notified <strong>on this website itself by 4 April 2026, 11:00 PM</strong>. Log in to your profile using your <strong>{formData.serialNumber}</strong> serial number to check your status.
            </p>
            <p>
              The screening round is on <strong>5 April 2026</strong> — so start preparing now!
            </p>
            <p>
              After the screening, if you are selected further, all details such as your assigned ministry, slot, and next steps will also be <strong>available on this website</strong> under your profile.
            </p>
            <br />
            <p>Participants need to join the group for further information:</p>
            <a href="https://chat.whatsapp.com/G8wefwBYXc2EmNvtBxnwAA?mode=gi_t" target="_blank" rel="noopener noreferrer" className={styles.whatsappLink}>
              Join WhatsApp Group
            </a>
          </div>
          <Link href="/" className={styles.primaryBtn} style={{ marginTop: '2rem' }}>Return Home</Link>
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
          <h1>Participant <span className={styles.highlight}>Registration</span></h1>
          <p>Official registration for the core parliamentary simulation.</p>
        </motion.div>

        <motion.div
          className={styles.infoAlert}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className={styles.alertContent}>
            <h3>⚠️ Important Event Information</h3>
            <ul>
              <li><strong>Opportunities:</strong> Selected candidates will get a chance to represent VIT BHOPAL University at state level of National Youth Parliament.</li>
              <li><strong>Mandatory Video:</strong> A 1-minute video on <strong>&quot;Budget 2026&quot;</strong> is required — upload it via the Documents Form linked below.</li>
              <li><strong>OD Eligibility:</strong> Participants will be eligible for OD from 8:30 AM to 4:20 PM on the event day (8 April 2026).</li>
              <li>Only College Email IDs (@vitbhopal.ac.in) are permitted for login.</li>
            </ul>
          </div>
        </motion.div>

        {/* Document Upload Section */}
        <motion.div
          className={styles.uploadNoticeCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className={styles.uploadNoticeContent}>
            <div className={styles.uploadNoticeIcon}>📎</div>
            <div className={styles.uploadNoticeText}>
              <h3>Upload Your Documents Separately</h3>
              <p>
                After filling this form, you must also submit your <strong>1-minute &quot;Budget 2026&quot; video</strong> — via the Google Form below.
              </p>
              <p className={styles.uploadNoticeWarning}>
                ⚠️ Registration will be considered incomplete without document submission.
              </p>
            </div>
          </div>
          <a
            href="https://forms.gle/pe6oEKNayKEQWZvY8"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.googleFormBtn}
          >
            <ExternalLink size={18} />
            Open Document Upload Form
          </a>
        </motion.div>

        <motion.form
          className={styles.formCard}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className={styles.formGrid}>
            {/* Serial Number - Read Only */}
            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
              <label>Your Login Serial Number <span style={{color:'#38BDF8'}}>(Save this — needed for login)</span></label>
              <input
                readOnly
                type="text"
                value={formData.serialNumber}
                className={styles.serialInput}
                style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1.2rem', letterSpacing: '0.1em', cursor: 'not-allowed', color: '#38BDF8', background: 'rgba(56,189,248,0.07)', border: '1px solid rgba(56,189,248,0.3)' }}
              />
              <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '0.4rem' }}>This number is auto-generated. Screenshot or note it down — you cannot recover it later.</p>
            </div>

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
              <input 
                required 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="example@vitbhopal.ac.in" 
                pattern=".*@vitbhopal\.ac\.in$"
                title="Only @vitbhopal.ac.in emails are allowed"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Phone Number *</label>
              <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91" />
            </div>

            <div className={styles.inputGroup}>
              <label>Branch (Example: BAI,BCE etc) *</label>
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

            <div className={styles.inputGroup}>
              <label>Gender (Optional)</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>


          </div>

          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label>Why do you want to participate? *</label>
            <textarea required rows={3} name="reason" value={formData.reason} onChange={handleChange}></textarea>
          </div>

          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label>Previous debate / MUN / parliament experience *</label>
            <textarea required rows={2} name="experience" value={formData.experience} onChange={handleChange}></textarea>
          </div>

          <div className={`${styles.inputGroup} ${styles.fullWidth} ${styles.checkboxRow}`}>
            <input required type="checkbox" id="comfortableOutside" name="comfortableOutside" checked={formData.comfortableOutside} onChange={handleChange} />
            <label htmlFor="comfortableOutside" className={styles.highlightLabel}>If you are selected, are you comfortable to participate in the next level of National Youth Parliament outside University?</label>
          </div>

          <div className={`${styles.checkboxGroup} ${styles.fullWidth}`}>
            <input required type="checkbox" id="declare" name="declaration" checked={formData.declaration} onChange={handleChange} />
            <label htmlFor="declare">I declare that the information provided is true, I understand the rules of the event, and I will submit my documents via the Google Form provided above.</label>
          </div>

          <div className={styles.announcementBlock}>
            <p><strong>Announcement:</strong> After filling out this form make sure to join the whatsapp group for participants where you will get updates about the screening process and other necessary info.</p>
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
