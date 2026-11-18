"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
  Camera,
  Check,
  ChevronRight,
  Laptop,
  LockKeyhole,
  Mail,
  Monitor,
  Shield,
  Upload,
  UserRound,
} from "lucide-react";
import styles from "./settings.module.css";

type Section = "profile" | "account" | "security";
type ProfileValues = { name: string; email: string; photo: string };
const preferenceKey = "redsun-settings-v2";
const defaults: ProfileValues = { name: "", email: "", photo: "" };


const sections: {
  id: Section;
  label: string;
  description: string;
  icon: typeof UserRound;
}[] = [
  {
    id: "profile",
    label: "My Profile",
    description: "Your personal information",
    icon: UserRound,
  },
  {
    id: "account",
    label: "Account",
    description: "Password and account details",
    icon: LockKeyhole,
  },
  {
    id: "security",
    label: "Security",
    description: "Sessions and sign-in",
    icon: Shield,
  },
];

export default function SettingsPage() {
  const [active, setActive] = useState<Section>("profile");
  const [values, setValues] = useState(defaults);
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(preferenceKey);
    if (saved) {
      try {
        setValues({
          ...defaults,
          ...(JSON.parse(saved) as Partial<ProfileValues>),
        });
      } catch {
        window.localStorage.removeItem(preferenceKey);
      }
    }
    setLoaded(true);
  }, []);

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.localStorage.setItem(preferenceKey, JSON.stringify(values));
    setMessage("Your profile has been saved.");
    window.setTimeout(() => setMessage(""), 2600);
  }

  function updateProfile<K extends keyof ProfileValues>(
    key: K,
    value: ProfileValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Choose an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage("Choose an image smaller than 2 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string")
        updateProfile("photo", reader.result);
    };
    reader.onerror = () =>
      setMessage("Could not read that image. Try another one.");
    reader.readAsDataURL(file);
  }

  const initials =
    values.name
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";
  const activeSection = sections.find((section) => section.id === active)!;

  if (!loaded) return <main className={styles.page} aria-busy="true" />;

  return (
    <main className={styles.page}>
      <header className={styles.pageHeading}>
        <div>
          <h1>Settings</h1>
          <p>Manage your profile and account security.</p>
        </div>
        {message && (
          <div className={styles.toast}>
            <Check size={15} />
            {message}
          </div>
        )}
      </header>
      <div className={styles.settingsLayout}>
        <nav className={styles.sectionNav} aria-label="Settings sections">
          {sections.map(({ id, label, description, icon: Icon }) => (
            <button
              key={id}
              className={active === id ? styles.selectedNav : ""}
              onClick={() => {
                setActive(id);
                setMessage("");
              }}
            >
              <span className={styles.navIcon}>
                <Icon size={17} />
              </span>
              <span className={styles.navText}>
                <b>{label}</b>
                <small>{description}</small>
              </span>
              <ChevronRight size={15} className={styles.navArrow} />
            </button>
          ))}
        </nav>

        <section className={styles.settingsContent}>
          <div className={styles.contentHeading}>
            <div>
              <h2>{activeSection.label}</h2>
              <p>{activeSection.description}</p>
            </div>
          </div>

          {active === "profile" && (
            <form className={styles.form} onSubmit={saveProfile}>
              <div className={styles.profileEditLayout}>
                <div className={styles.profilePhotoPanel}>
                  <div className={styles.profileAvatarWrap}>
                    <span className={styles.profileAvatar}>
                      {values.photo ? (
                        <img src={values.photo} alt="Profile" />
                      ) : (
                        initials
                      )}
                    </span>
                    <span className={styles.profileCameraBadge}>
                      <Camera size={13} />
                    </span>
                  </div>
                  <div className={styles.profilePhotoText}>
                    <b>Profile photo</b>
                    <small>
                      Use a clear photo so teammates can recognize you.
                    </small>
                  </div>
                  <label className={styles.photoUpload}>
                    <Upload size={14} />
                    Change photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      aria-label="Upload profile picture"
                    />
                  </label>
                </div>
                <div className={styles.profileFields}>
                  <label>
                    Full name
                    <div className={styles.profileInputWrap}>
                      <UserRound size={15} />
                      <input
                        value={values.name}
                        onChange={(event) =>
                          updateProfile("name", event.target.value)
                        }
                        placeholder="Your name"
                      />
                    </div>
                  </label>
                  <label>
                    Email address
                    <div className={styles.profileInputWrap}>
                      <Mail size={15} />
                      <input
                        type="email"
                        value={values.email}
                        onChange={(event) =>
                          updateProfile("email", event.target.value)
                        }
                        placeholder="you@example.com"
                      />
                    </div>
                  </label>
                </div>
              </div>
              <div className={styles.formFooter}>
                <span>Keep your profile details up to date.</span>
                <button className={styles.primaryButton}>Save profile</button>
              </div>
            </form>
          )}

          {active === "account" && (
            <div className={styles.sectionStack}>
              <article className={styles.infoCard}>
                <span className={styles.infoIcon}>
                  <UserRound size={17} />
                </span>
                <div>
                  <b>Account details</b>
                  <small>
                    {values.email ||
                      "Account details appear after authentication is connected."}
                  </small>
                </div>
                <span className={styles.verified}>Not connected</span>
              </article>
              <div className={styles.form}>
                <div className={styles.subheading}>
                  <h3>Change password</h3>
                  <p>Use a strong password you don’t use elsewhere.</p>
                </div>
                <label>
                  Current password
                  <input
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter current password"
                  />
                </label>
                <div className={styles.formGrid}>
                  <label>
                    New password
                    <input
                      type="password"
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                    />
                  </label>
                  <label>
                    Confirm new password
                    <input
                      type="password"
                      autoComplete="new-password"
                      placeholder="Repeat new password"
                    />
                  </label>
                </div>
                <div className={styles.formFooter}>
                  <span>Password changes require the account service.</span>
                  <button type="button" className={styles.primaryButton}>
                    Update password
                  </button>
                </div>
              </div>
            </div>
          )}

          {active === "security" && (
            <div className={styles.sectionStack}>
              <div className={styles.subheading}>
                <h3>Active sessions</h3>
                <p>Session details appear after authentication is connected.</p>
              </div>
              <article className={styles.sessionCard}>
                <span className={styles.sessionIcon}>
                  <Monitor size={18} />
                </span>
                <div>
                  <b>Current session</b>
                  <small>No session information available yet.</small>
                </div>
                <span className={styles.currentSession}>Unavailable</span>
              </article>
              <article className={styles.sessionCard}>
                <span className={styles.sessionIcon}>
                  <Laptop size={18} />
                </span>
                <div>
                  <b>Other sessions</b>
                  <small>
                    Connect account security to review active sessions.
                  </small>
                </div>
                <button className={styles.signOutButton} disabled>
                  Sign out
                </button>
              </article>
              <div className={styles.securityNote}>
                <Shield size={16} />
                <span>
                  Session controls will be available when authentication and
                  session APIs are connected.
                </span>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
