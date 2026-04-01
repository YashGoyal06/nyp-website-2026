"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Save, Check } from "lucide-react";
import styles from "./admin.module.css";
import { ParticipantRow } from "@/lib/google-sheets";

export default function AdminDashboard() {
  const [participants, setParticipants] = useState<ParticipantRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStr, setUpdatingStr] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      const res = await fetch("/api/admin/participants");
      if (res.ok) {
        const data = await res.json();
        setParticipants(data.participants);
      } else if (res.status === 401) {
        router.push("/login"); // Unauthorized
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

  const handleFieldChange = (rowIndex: number, field: string, value: string) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.rowIndex === rowIndex ? { ...p, [field]: value } : p
      )
    );
  };

  const handleUpdate = async (participant: ParticipantRow) => {
    setUpdatingStr(participant.rowIndex.toString());
    try {
      const res = await fetch("/api/admin/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rowIndex: participant.rowIndex,
          data: {
            status: participant.status,
            screeningSlot: participant.screeningSlot,
            attendance: participant.attendance,
            marks: participant.marks,
            ministry: participant.ministry,
            ministryStatus: participant.ministryStatus,
          },
        }),
      });

      if (res.ok) {
        setUpdatingStr(participant.rowIndex.toString() + "-success");
        setTimeout(() => setUpdatingStr(null), 2000);
      } else {
        alert("Failed to update this row.");
        setUpdatingStr(null);
      }
    } catch (error) {
      console.error(error);
      setUpdatingStr(null);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <div className={styles.bigSpinner} />
          <p>Loading Participants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </button>
      </header>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Reg. No</th>
              <th className={styles.th}>Branch / Year</th>
              <th className={styles.th}>Status (Round 1)</th>
              <th className={styles.th}>Ministry (Name)</th>
              <th className={styles.th}>Ministry Status</th>
              <th className={styles.th}>Screening Slot</th>
              <th className={styles.th}>Attendance (Eval)</th>
              <th className={styles.th}>Marks (Eval)</th>
              <th className={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p) => (
              <tr key={p.rowIndex} className={styles.tr}>
                <td className={styles.td}>
                  <strong>{p.fullName}</strong>
                  <br />
                  <span style={{ fontSize: "0.80rem", color: "#94A3B8" }}>{p.phone}</span>
                </td>
                <td className={styles.td} style={{ fontFamily: "monospace" }}>
                  {p.registrationNumber}
                </td>
                <td className={styles.td}>
                  {p.branch} - {p.year}
                </td>

                {/* Editable Status */}
                <td className={styles.td}>
                  <select
                    className={styles.select}
                    value={p.status}
                    onChange={(e) => handleFieldChange(p.rowIndex, "status", e.target.value)}
                  >
                    <option value="None">None</option>
                    <option value="Selected">Selected</option>
                    <option value="Not Selected">Not Selected</option>
                  </select>
                </td>

                <td className={styles.td}>
                  <input
                    type="text"
                    className={styles.input}
                    value={p.ministry || ""}
                    placeholder="e.g. Finance"
                    onChange={(e) => handleFieldChange(p.rowIndex, "ministry", e.target.value)}
                  />
                </td>

                <td className={styles.td}>
                  <select
                    className={styles.select}
                    value={p.ministryStatus || "None"}
                    onChange={(e) => handleFieldChange(p.rowIndex, "ministryStatus", e.target.value)}
                  >
                    <option value="None">None</option>
                    <option value="Selected">Selected</option>
                    <option value="Not Selected">Not Selected</option>
                  </select>
                </td>

                {/* Editable Slot */}
                <td className={styles.td}>
                  <input
                    type="text"
                    className={styles.input}
                    value={p.screeningSlot}
                    placeholder="e.g. Day 1, 9AM"
                    onChange={(e) => handleFieldChange(p.rowIndex, "screeningSlot", e.target.value)}
                  />
                </td>

                {/* Editable Attendance */}
                <td className={styles.td}>
                  <select
                    className={styles.select}
                    value={p.attendance}
                    onChange={(e) => handleFieldChange(p.rowIndex, "attendance", e.target.value)}
                  >
                    <option value="Absent">Absent</option>
                    <option value="Present">Present</option>
                  </select>
                </td>

                {/* Editable Marks */}
                <td className={styles.td}>
                  <input
                    type="number"
                    className={styles.input}
                    value={p.marks}
                    placeholder="0-100"
                    onChange={(e) => handleFieldChange(p.rowIndex, "marks", e.target.value)}
                    style={{ width: "80px" }}
                  />
                </td>

                <td className={styles.td}>
                  <button
                    className={`${styles.updateBtn} ${updatingStr === p.rowIndex.toString() + "-success" ? styles.success : ""}`}
                    onClick={() => handleUpdate(p)}
                    disabled={updatingStr === p.rowIndex.toString()}
                  >
                    {updatingStr === p.rowIndex.toString() ? (
                      <div className={styles.smallSpinner} />
                    ) : updatingStr === p.rowIndex.toString() + "-success" ? (
                      <><Check size={16} /> Saved</>
                    ) : (
                      <><Save size={16} /> Save</>
                    )}
                  </button>
                </td>
              </tr>
            ))}
            {participants.length === 0 && (
              <tr>
                <td colSpan={8} align="center" style={{ padding: '2rem', color: '#94A3B8' }}>
                  No participants registered yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
