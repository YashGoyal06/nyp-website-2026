"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, LogIn } from "lucide-react";
import styles from "./login.module.css";

export default function LoginPage() {
  const [tab, setTab] = useState<"participant" | "admin">("participant");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Participant Form State
  const [email, setEmail] = useState("");
  const [regNum, setRegNum] = useState("");

  // Admin Form State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = tab === "participant"
      ? { type: "participant", email, registrationNumber: regNum }
      : { type: "admin", username, password };

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        if (tab === "admin") {
          router.push("/admin");
        } else {
          router.push("/profile");
        }
      } else {
        setError(data.error || "Login Failed");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Log in to the Viksit Bharat Portal</p>

        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${tab === "participant" ? styles.activeTab : ""}`}
            onClick={() => { setTab("participant"); setError(null); }}
          >
            Participant
          </button>
          <button
            type="button"
            className={`${styles.tab} ${tab === "admin" ? styles.activeTab : ""}`}
            onClick={() => { setTab("admin"); setError(null); }}
          >
            Administrator
          </button>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              className={styles.error}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin}>
          <AnimatePresence mode="wait">
            {tab === "participant" ? (
              <motion.div
                key="participant-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.formGroup}>
                  <label className={styles.label}>Serial Number</label>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    placeholder="e.g. VBNYP1234"
                  />
                  <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.4rem' }}>Use the VBNYP serial number from your registration form.</p>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Registration Number</label>
                  <input
                    type="text"
                    required
                    value={regNum}
                    onChange={(e) => setRegNum(e.target.value)}
                    className={styles.input}
                    placeholder="e.g. 24XXXXXXX"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="admin-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.formGroup}>
                  <label className={styles.label}>Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.input}
                    placeholder="Admin username"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                    placeholder="••••••••"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? (
              <>
                <div className={styles.spinner} /> Authenticating...
              </>
            ) : (
              <>
                Login <LogIn size={18} />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
