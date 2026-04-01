"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User, CheckCircle, Clock } from "lucide-react";
import styles from "./profile.module.css";
import { ParticipantRow } from "@/lib/google-sheets";

export default function ProfilePage() {
  const [participant, setParticipant] = useState<ParticipantRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const router = useRouter();

  // 11 Hours in MS
  const PAYMENT_WINDOW_MS = 11 * 60 * 60 * 1000;

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    // Countdown Timer logic if Selected
    if (participant?.ministryStatus === "Selected" && participant.selectionTimestamp) {
      const selectionTime = new Date(participant.selectionTimestamp).getTime();
      const deadline = selectionTime + PAYMENT_WINDOW_MS;

      const updateTimer = () => {
        const now = Date.now();
        const remaining = deadline - now;
        if (remaining > 0) {
          setTimeLeft(remaining);
        } else {
          setTimeLeft(0);
        }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [participant]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setParticipant(data.participant);
      } else {
        router.push("/login");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const formatTime = (ms: number) => {
    if (ms <= 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <div className={styles.bigSpinner} />
          <p>Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (!participant) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <p>Failed to load profile. Please try logging in again.</p>
          <button className={styles.logoutBtn} onClick={handleLogout}>Back to Login</button>
        </div>
      </div>
    );
  }

  const isSelected = participant.ministryStatus === "Selected";
  const hasRound1Result = participant.status === "Selected" || participant.status === "Not Selected";
  const hasMinistryResult = participant.ministryStatus === "Selected" || participant.ministryStatus === "Not Selected";
  const statusClass = participant.status as keyof typeof styles;
  const ministryStatusClass = participant.ministryStatus as keyof typeof styles;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Participant Profile</h1>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className={styles.grid}>
        {/* Basic Info */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}><User size={20} /> Personal Details</h2>
          <div className={styles.infoRow}>
            <span className={styles.label}>Full Name</span>
            <span className={styles.value}>{participant.fullName}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Registration Number</span>
            <span className={styles.value} style={{ fontFamily: "monospace" }}>{participant.registrationNumber}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Email Address</span>
            <span className={styles.value}>{participant.email}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Phone Number</span>
            <span className={styles.value}>{participant.phone}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Institution / Branch</span>
            <span className={styles.value}>{participant.branch} ({participant.year})</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Date of Registration</span>
            <span className={styles.value}>
              {new Date(participant.timestamp).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Application Status Card — only shown once Round 1 result is set */}
        {hasRound1Result ? (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}><CheckCircle size={20} /> Application Status</h2>

            <div className={styles.infoRow}>
              <span className={styles.label}>Round 1 Status</span>
              <div>
                <span className={`${styles.badge} ${styles[statusClass]}`}>
                  {participant.status}
                </span>
              </div>
            </div>

            {/* Screening slot — only if assigned */}
            {participant.screeningSlot && (
              <div className={styles.infoRow} style={{ marginTop: '1.5rem' }}>
                <span className={styles.label}>Assigned Screening Slot</span>
                <span className={styles.importantValue}>
                  {participant.screeningSlot}
                </span>
              </div>
            )}

            {/* Ministry section — only if ministry result is set */}
            {hasMinistryResult && (
              <>
                <div className={styles.infoRow} style={{ marginTop: '1.5rem' }}>
                  <span className={styles.label}>Ministry Selection</span>
                  <div>
                    <span className={`${styles.badge} ${styles[ministryStatusClass]}`}>
                      {participant.ministryStatus}
                    </span>
                  </div>
                </div>

                {isSelected && participant.ministry && (
                  <div className={styles.infoRow} style={{ marginTop: '1.5rem' }}>
                    <span className={styles.label}>Assigned Ministry</span>
                    <span className={styles.importantValue}>
                      {participant.ministry}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          /* Pending state — shown while awaiting Round 1 result */
          <div className={styles.card} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '1rem', padding: '3rem 2rem' }}>
            <Clock size={40} style={{ color: '#64748B' }} />
            <h2 className={styles.cardTitle} style={{ margin: 0 }}>Result Awaited</h2>
            <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: 280 }}>
              Your application is under review. Round 1 results will be announced by <strong style={{ color: '#CBD5E1' }}>4 April 2026, 11:00 PM</strong>. Check back here to see your status.
            </p>
          </div>
        )}
      </div>

      {/* Payment Card Logic */}
      {isSelected && (
        <div className={styles.grid} style={{ gridTemplateColumns: "1fr", marginTop: "2rem" }}>
          {timeLeft !== null && timeLeft > 0 ? (
            <div className={styles.paymentCard}>
              <h2 className={styles.paymentTitle}>Congratulations! You have been selected.</h2>
              <p className={styles.paymentText}>
                You are selected in the screening process.
              </p>
              <p className={styles.paymentText}>
                Please complete your registration payment to secure your spot.
                This link will expire in exactly 11 hours from your selection.
              </p>
              <p className={styles.paymentText} style={{ fontWeight: 500, color: '#60A5FA', marginTop: '0.5rem' }}>
                Upon successful payment confirmation, you will receive an exclusive link to join the official participant WhatsApp group.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <span className={styles.label} style={{ color: "rgba(255,255,255,0.7)" }}>Time Remaining to Pay</span>
                <div className={styles.countdown}>
                  <Clock size={32} style={{ verticalAlign: 'middle', marginRight: '1rem' }} />
                  {formatTime(timeLeft)}
                </div>

                <a
                  href="https://forms.gle/placeholder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.paymentBtn}
                >
                  Proceed to Payment
                </a>
              </div>
            </div>
          ) : timeLeft === 0 ? (
            <div className={styles.expiredCard}>
              <h2 className={styles.expiredTitle}>Payment Link Expired</h2>
              <p>
                The 11-hour window to complete your payment has passed.
                Please contact the administrators if you believe this is a mistake.
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
