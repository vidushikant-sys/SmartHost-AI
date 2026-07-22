import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useTheme, ACCENTS } from "../../context/ThemeContext";
import { resolveFileUrl } from "../../services/apiClient";
import {
  updateProfile,
  changePassword,
  uploadAvatar,
  getPreferences,
  updatePreferences,
} from "../../services/authService";
import { getAdminActivityLogs } from "../../services/activityLogService";
import "../../styles/settings.css";

const TABS = [
  { key: "appearance", label: "Appearance" },
  { key: "profile", label: "Profile" },
  { key: "security", label: "Security" },
  { key: "notifications", label: "Notifications" },
  { key: "activity", label: "Activity Log" },
];

function Settings() {
  const [activeTab, setActiveTab] = useState("appearance");

  return (
    <DashboardLayout>
      <div className="settings-page">
        <div className="settings-header">
          <div>
            <h1>Settings</h1>
            <p>Manage your appearance, profile, security and notifications.</p>
          </div>
        </div>

        <div className="settings-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`settings-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "appearance" && <AppearanceTab />}
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "security" && <SecurityTab />}
        {activeTab === "notifications" && <NotificationsTab />}
        {activeTab === "activity" && <ActivityTab />}
      </div>
    </DashboardLayout>
  );
}

// ==========================================================
// Small helper: a status pill that fades in/out on save
// ==========================================================
function SavedPill({ show, text = "Saved" }) {
  if (!show) return null;
  return <span className="settings-saved-pill">{text}</span>;
}

// ==========================================================
// Appearance tab — theme color + light/dark mode
// (state lives in ThemeContext, already synced with backend)
// ==========================================================
function AppearanceTab() {
  const { accent, mode, setAccent, setMode } = useTheme();
  const [savedPing, setSavedPing] = useState(false);

  function ping() {
    setSavedPing(true);
    window.clearTimeout(ping._t);
    ping._t = window.setTimeout(() => setSavedPing(false), 1500);
  }

  return (
    <section className="settings-card">
      <div className="settings-card-head">
        <div className="settings-card-head-row">
          <h2>Appearance</h2>
          <SavedPill show={savedPing} />
        </div>
        <p>Choose an accent color and a light or dark background for the dashboard. Saved to your account, so it follows you on any device.</p>
      </div>

      <div className="settings-block">
        <h3>Theme color</h3>
        <div className="theme-swatch-grid">
          {Object.entries(ACCENTS).map(([key, cfg]) => (
            <button
              key={key}
              type="button"
              className={`theme-swatch ${accent === key ? "active" : ""}`}
              onClick={() => {
                setAccent(key);
                ping();
              }}
              aria-pressed={accent === key}
              aria-label={cfg.label}
            >
              <span className="theme-swatch-dot" style={{ background: cfg.swatch }}>
                {accent === key && (
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className="theme-swatch-label">{cfg.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="settings-block">
        <h3>Background mode</h3>
        <div className="mode-toggle-group">
          <button
            type="button"
            className={`mode-toggle ${mode === "light" ? "active" : ""}`}
            onClick={() => { setMode("light"); ping(); }}
          >
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.7" />
              <path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            Light
          </button>
          <button
            type="button"
            className={`mode-toggle ${mode === "dark" ? "active" : ""}`}
            onClick={() => { setMode("dark"); ping(); }}
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            </svg>
            Dark
          </button>
        </div>
      </div>

      <div className="settings-block">
        <h3>Preview</h3>
        <div className="theme-preview-card">
          <div className="theme-preview-topbar">
            <span className="theme-preview-dot" />
            <span className="theme-preview-dot" />
            <span className="theme-preview-dot" />
          </div>
          <div className="theme-preview-body">
            <div className="theme-preview-btn">Primary Button</div>
            <div className="theme-preview-text">
              This is how buttons, links and highlights look with the selected color and background mode.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================================
// Profile tab — full name, phone, avatar (backend connected)
// ==========================================================
function ProfileTab() {
  const { admin, updateAdmin } = useAuth();
  const [fullName, setFullName] = useState(admin?.full_name || "");
  const [phone, setPhone] = useState(admin?.phone || "");
  const [avatarUrl, setAvatarUrl] = useState(admin?.avatar_url || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const initial = (fullName || "A").charAt(0).toUpperCase();

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const url = await uploadAvatar(file);
      setAvatarUrl(url);
    } catch (err) {
      setError(err.message || "Failed to upload avatar");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim(),
        avatar_url: avatarUrl,
      });
      const updatedAdmin = res?.admin || res;
      updateAdmin(updatedAdmin);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1500);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="settings-card">
      <div className="settings-card-head">
        <div className="settings-card-head-row">
          <h2>Profile</h2>
          <SavedPill show={saved} />
        </div>
        <p>Update your name, phone number and profile photo.</p>
      </div>

      <form onSubmit={handleSave}>
        <div className="settings-avatar-row">
          <div className="settings-avatar">
            {avatarUrl ? (
              <img src={resolveFileUrl(avatarUrl)} alt="Avatar" />
            ) : (
              <span>{initial}</span>
            )}
          </div>
          <div>
            <label className="settings-upload-btn">
              {uploading ? "Uploading..." : "Change photo"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleAvatarChange}
                disabled={uploading}
                hidden
              />
            </label>
            <p className="settings-hint">PNG, JPG or WEBP.</p>
          </div>
        </div>

        <div className="settings-field">
          <label>Full name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
          />
        </div>

        <div className="settings-field">
          <label>Email</label>
          <input type="email" value={admin?.email || ""} disabled />
          <p className="settings-hint">Email cannot be changed here.</p>
        </div>

        <div className="settings-field">
          <label>Phone number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. +91 98765 43210"
          />
        </div>

        {error && <p className="settings-error">{error}</p>}

        <button className="settings-save-btn" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </section>
  );
}

// ==========================================================
// Security tab — change password (backend connected)
// ==========================================================
function SecurityTab() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!currentPassword || !newPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match");
      return;
    }

    setSaving(true);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1500);
    } catch (err) {
      setError(err.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="settings-card">
      <div className="settings-card-head">
        <div className="settings-card-head-row">
          <h2>Security</h2>
          <SavedPill show={saved} text="Password changed" />
        </div>
        <p>Change your account password.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="settings-field">
          <label>Current password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
          />
        </div>

        <div className="settings-field">
          <label>New password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 6 characters"
          />
        </div>

        <div className="settings-field">
          <label>Confirm new password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
          />
        </div>

        {error && <p className="settings-error">{error}</p>}

        <button className="settings-save-btn" type="submit" disabled={saving}>
          {saving ? "Updating..." : "Change password"}
        </button>
      </form>
    </section>
  );
}

// ==========================================================
// Notifications tab — toggle preferences (backend connected)
// ==========================================================
const NOTIF_ITEMS = [
  { key: "email_alerts", label: "Email alerts", desc: "General account and system emails." },
  { key: "fee_reminders", label: "Fee due reminders", desc: "Alerts when a student fee is due or overdue." },
  { key: "complaint_updates", label: "Complaint updates", desc: "Notify when a complaint status changes." },
  { key: "notice_alerts", label: "New notice alerts", desc: "Notify when a new notice is published." },
];

function NotificationsTab() {
  const [prefs, setPrefs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savedKey, setSavedKey] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getPreferences()
      .then((res) => {
        if (cancelled) return;
        setPrefs(res?.preferences?.notification_prefs || res?.notification_prefs || {});
      })
      .catch((err) => !cancelled && setError(err.message || "Failed to load preferences"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  async function toggle(key) {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    try {
      await updatePreferences({ notification_prefs: { [key]: next[key] } });
      setSavedKey(key);
      window.setTimeout(() => setSavedKey(null), 1200);
    } catch (err) {
      setPrefs(prefs); // revert on failure
      setError(err.message || "Failed to save preference");
    }
  }

  return (
    <section className="settings-card">
      <div className="settings-card-head">
        <h2>Notifications</h2>
        <p>Choose what you want to be notified about.</p>
      </div>

      {loading && <p className="settings-hint">Loading preferences...</p>}
      {error && <p className="settings-error">{error}</p>}

      {!loading && prefs && (
        <div className="notif-list">
          {NOTIF_ITEMS.map((item) => (
            <div className="notif-row" key={item.key}>
              <div>
                <p className="notif-label">{item.label}</p>
                <p className="notif-desc">{item.desc}</p>
              </div>
              <div className="notif-row-right">
                {savedKey === item.key && <span className="settings-saved-pill small">Saved</span>}
                <button
                  type="button"
                  className={`notif-switch ${prefs[item.key] ? "on" : ""}`}
                  onClick={() => toggle(item.key)}
                  aria-pressed={!!prefs[item.key]}
                >
                  <span className="notif-switch-knob" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ==========================================================
// Activity Log tab — read-only history (backend connected)
// ==========================================================
function ActivityTab() {
  const { admin } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!admin?.id) return;
    let cancelled = false;
    getAdminActivityLogs(admin.id)
      .then((res) => {
        if (cancelled) return;
        setLogs(Array.isArray(res) ? res : res?.data || []);
      })
      .catch((err) => !cancelled && setError(err.message || "Failed to load activity log"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [admin?.id]);

  return (
    <section className="settings-card">
      <div className="settings-card-head">
        <h2>Activity Log</h2>
        <p>A history of actions performed on your account.</p>
      </div>

      {loading && <p className="settings-hint">Loading activity...</p>}
      {error && <p className="settings-error">{error}</p>}

      {!loading && !error && logs.length === 0 && (
        <p className="settings-hint">No activity recorded yet.</p>
      )}

      {!loading && logs.length > 0 && (
        <ul className="activity-list">
          {logs.map((log) => (
            <li className="activity-item" key={log.id}>
              <span className={`activity-badge activity-${log.action?.toLowerCase()}`}>
                {log.action}
              </span>
              <div className="activity-body">
                <p className="activity-desc">{log.description}</p>
                <p className="activity-meta">
                  {log.module} • {log.created_at ? new Date(log.created_at).toLocaleString() : ""}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default Settings;
