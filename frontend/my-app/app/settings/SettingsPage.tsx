"use client";

import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import { Bell, Check, ChevronRight, Laptop, LockKeyhole, Monitor, Moon, Palette, Shield, Sun, UserRound, UsersRound } from "lucide-react";
import styles from "./settings.module.css";

type Section = "profile" | "account" | "appearance" | "notifications" | "workspace" | "security";
type Preferences = { name: string; email: string; photo: string; workspace: string; theme: "Dark" | "Light"; accent: string; emailUpdates: boolean; inAppAlerts: boolean };
const preferenceKey = "redsun-settings-v2";
const defaults: Preferences = { name: "", email: "", photo: "", workspace: "", theme: "Dark", accent: "#ef4444", emailUpdates: false, inAppAlerts: false };
const sections: { id: Section; label: string; description: string; icon: typeof UserRound }[] = [
  { id: "profile", label: "My Profile", description: "Your personal information", icon: UserRound },
  { id: "account", label: "Account", description: "Password and account details", icon: LockKeyhole },
  { id: "appearance", label: "Appearance", description: "Theme and accent color", icon: Palette },
  { id: "notifications", label: "Notifications", description: "Email and in-app alerts", icon: Bell },
  { id: "workspace", label: "Workspace", description: "Name and workspace details", icon: UsersRound },
  { id: "security", label: "Security", description: "Sessions and sign-in", icon: Shield },
];
const accents = [{ name: "Red", value: "#ef4444" }, { name: "Orange", value: "#f97316" }, { name: "Violet", value: "#8b5cf6" }, { name: "Blue", value: "#3b82f6" }];

export default function SettingsPage() {
  const [active, setActive] = useState<Section>("profile");
  const [values, setValues] = useState(defaults);
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  useEffect(() => {
    const saved = window.localStorage.getItem(preferenceKey);
    if (saved) {
      try { setValues({ ...defaults, ...(JSON.parse(saved) as Partial<Preferences>) }); } catch { window.localStorage.removeItem(preferenceKey); }
    }
    const savedNotificationPrefs = window.localStorage.getItem("redsun-notifications-settings-v2");
    if (savedNotificationPrefs) {
      try {
        const notificationPrefs = JSON.parse(savedNotificationPrefs) as Pick<Preferences, "emailUpdates" | "inAppAlerts">;
        setValues((current) => ({ ...current, ...notificationPrefs }));
      } catch { window.localStorage.removeItem("redsun-notifications-settings-v2"); }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = values.theme.toLowerCase();
    document.documentElement.style.setProperty("--accent-red", values.accent);
  }, [values.theme, values.accent]);

  function saveValues(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    window.localStorage.setItem(preferenceKey, JSON.stringify(values));
    window.localStorage.setItem("redsun-notifications-settings-v2", JSON.stringify({ emailUpdates: values.emailUpdates, inAppAlerts: values.inAppAlerts }));
    setMessage("Your settings have been saved.");
    window.setTimeout(() => setMessage(""), 2600);
  }

  function savePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (newPassword.length < 8) { setMessage("Use at least 8 characters for your new password."); return; }
    if (newPassword !== confirmPassword) { setMessage("The new passwords do not match."); return; }
    setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    setMessage("Password change is ready to connect to your account API.");
    window.setTimeout(() => setMessage(""), 3200);
  }

  function update<K extends keyof Preferences>(key: K, value: Preferences[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }
  const initials = values.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "?";
  const activeSection = sections.find((section) => section.id === active)!;

  if (!loaded) return <main className={styles.page} aria-busy="true" />;

  return <main className={styles.page}>
    <header className={styles.pageHeading}><div><span className={styles.eyebrow}>Workspace</span><h1>Settings</h1><p>Manage your profile, workspace, and preferences.</p></div>{message && <div className={styles.toast}><Check size={15} />{message}</div>}</header>
    <div className={styles.settingsLayout}>
      <nav className={styles.sectionNav} aria-label="Settings sections">{sections.map(({ id, label, description, icon: Icon }) => <button key={id} className={active === id ? styles.selectedNav : ""} onClick={() => { setActive(id); setMessage(""); }}><span className={styles.navIcon}><Icon size={17} /></span><span className={styles.navText}><b>{label}</b><small>{description}</small></span><ChevronRight size={15} className={styles.navArrow} /></button>)}</nav>

      <section className={styles.settingsContent}>
        <div className={styles.contentHeading}><div><h2>{activeSection.label}</h2><p>{activeSection.description}</p></div></div>

        {active === "profile" && <form className={styles.form} onSubmit={saveValues}>
          <div className={styles.profilePictureRow}><span className={styles.profileAvatar}>{values.photo ? <img src={values.photo} alt="Profile" /> : initials}</span><div><b>Profile picture</b><small>Shown to your teammates across RedSun.</small></div><label className={styles.photoInput}>Photo URL<input value={values.photo} onChange={(event) => update("photo", event.target.value)} placeholder="Paste an image URL" /></label></div>
          <div className={styles.formGrid}><label>Full name<input value={values.name} onChange={(event) => update("name", event.target.value)} placeholder="Your name" /></label><label>Email address<input type="email" value={values.email} onChange={(event) => update("email", event.target.value)} placeholder="you@example.com" /></label></div>
          <div className={styles.formFooter}><span>Keep your profile details up to date.</span><button className={styles.primaryButton}>Save profile</button></div>
        </form>}

        {active === "account" && <div className={styles.sectionStack}>
          <article className={styles.infoCard}><span className={styles.infoIcon}><UserRound size={17} /></span><div><b>Account details</b><small>{values.email || "Account details appear after authentication is connected."}</small></div><span className={styles.verified}>Not connected</span></article>
          <form className={styles.form} onSubmit={savePassword}><div className={styles.subheading}><h3>Change password</h3><p>Use a strong password you don’t use elsewhere.</p></div><label>Current password<input type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required placeholder="Enter current password" /></label><div className={styles.formGrid}><label>New password<input type="password" autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required placeholder="At least 8 characters" /></label><label>Confirm new password<input type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required placeholder="Repeat new password" /></label></div><div className={styles.formFooter}><span>Password changes require the account service.</span><button className={styles.primaryButton}>Update password</button></div></form>
        </div>}

        {active === "appearance" && <div className={styles.sectionStack}><div className={styles.subheading}><h3>Theme</h3><p>Choose how RedSun looks on this device.</p></div><div className={styles.themeOptions}><button type="button" className={`${styles.themeOption} ${values.theme === "Dark" ? styles.themeSelected : ""}`} onClick={() => update("theme", "Dark")}><span className={`${styles.themePreview} ${styles.darkPreview}`}><Moon size={18} /><i /><i /><i /></span><span><b>Dark</b><small>Easy on the eyes</small></span>{values.theme === "Dark" && <Check size={16} />}</button><button type="button" className={`${styles.themeOption} ${values.theme === "Light" ? styles.themeSelected : ""}`} onClick={() => update("theme", "Light")}><span className={`${styles.themePreview} ${styles.lightPreview}`}><Sun size={18} /><i /><i /><i /></span><span><b>Light</b><small>Bright and clear</small></span>{values.theme === "Light" && <Check size={16} />}</button><button type="button" className={`${styles.themeOption} ${styles.systemOption}`} disabled><span className={`${styles.themePreview} ${styles.systemPreview}`}><Monitor size={18} /></span><span><b>System</b><small>Use device setting</small></span><small className={styles.comingSoon}>Coming soon</small></button></div><div className={styles.subheading}><h3>Accent color</h3><p>Choose the highlight color used across your workspace.</p></div><div className={styles.accentOptions}>{accents.map((accent) => <button key={accent.value} type="button" className={values.accent === accent.value ? styles.accentSelected : ""} style={{ "--swatch": accent.value } as CSSProperties} onClick={() => update("accent", accent.value)} aria-label={`${accent.name} accent`}><span />{accent.name}{values.accent === accent.value && <Check size={14} />}</button>)}</div><div className={styles.formFooter}><span>Preferences are saved in this browser.</span><button className={styles.primaryButton} onClick={() => saveValues()}>Save appearance</button></div></div>}

        {active === "notifications" && <div className={styles.sectionStack}><div className={styles.subheading}><h3>Notification preferences</h3><p>Control which updates you receive.</p></div><label className={styles.toggleRow}><span className={styles.toggleIcon}><Bell size={17} /></span><span className={styles.toggleText}><b>In-app notifications</b><small>Show task, project, and team updates in RedSun.</small></span><input type="checkbox" checked={values.inAppAlerts} onChange={(event) => update("inAppAlerts", event.target.checked)} /></label><label className={styles.toggleRow}><span className={styles.toggleIcon}><Laptop size={17} /></span><span className={styles.toggleText}><b>Email notifications</b><small>Send important workspace updates to {values.email}.</small></span><input type="checkbox" checked={values.emailUpdates} onChange={(event) => update("emailUpdates", event.target.checked)} /></label><div className={styles.formFooter}><span>Notification choices are stored locally for now.</span><button className={styles.primaryButton} onClick={() => saveValues()}>Save preferences</button></div></div>}

        {active === "workspace" && <form className={styles.form} onSubmit={saveValues}><div className={styles.workspaceHero}><span className={styles.workspaceMark}>{values.workspace.slice(0, 1).toUpperCase() || "W"}</span><span><b>{values.workspace || "Workspace"}</b><small>Workspace data not connected</small></span></div><label>Workspace name<input value={values.workspace} onChange={(event) => update("workspace", event.target.value)} placeholder="Enter workspace name" /></label><div className={styles.formGrid}><label>Workspace URL<input value="" placeholder="Available when workspace data is connected" readOnly /></label><label>Plan<input value="" placeholder="Available when workspace data is connected" readOnly /></label></div><div className={styles.formFooter}><span>Workspace details are visible to its members.</span><button className={styles.primaryButton}>Save workspace</button></div></form>}

        {active === "security" && <div className={styles.sectionStack}><div className={styles.subheading}><h3>Active sessions</h3><p>Session details appear after authentication is connected.</p></div><article className={styles.sessionCard}><span className={styles.sessionIcon}><Monitor size={18} /></span><div><b>Current session</b><small>No session information available yet.</small></div><span className={styles.currentSession}>Unavailable</span></article><article className={styles.sessionCard}><span className={styles.sessionIcon}><Laptop size={18} /></span><div><b>Other sessions</b><small>Connect account security to review active sessions.</small></div><button className={styles.signOutButton} disabled>Sign out</button></article><div className={styles.securityNote}><Shield size={16} /><span>Session controls will be available when authentication and session APIs are connected.</span></div></div>}
      </section>
    </div>
  </main>;
}
