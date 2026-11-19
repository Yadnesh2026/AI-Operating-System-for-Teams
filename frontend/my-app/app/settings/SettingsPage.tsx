"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { isAxiosError } from "axios";
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
import api from "../lib/axios";

type Section = "profile" | "account" | "security";

type ProfileValues = { name: string; email: string; photo: string };
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

// Active session ---------------------
type Session = {
  _id: string;
  device: string;
  lastActive: string;
  createdAt: string;
  isCurrent: boolean;
}; // ------------------------

export default function SettingsPage() {
  const [active, setActive] = useState<Section>("profile");
  const [values, setValues] = useState(defaults);
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  // ----------Sessions---------------------------------------------------
  async function fetchSessions() {
    try {
      const response = await api.get("/sessions");
      setSessions(response.data.sessions);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    } finally {
      setSessionsLoading(false);
    }
  }

  async function handleRevokeSession(sessionId: string) {
  try {
    await api.delete(`/sessions/${sessionId}`);

    setSessions((prev) =>
      prev.filter((session) => session._id !== sessionId)
    );

    setMessage("Device signed out successfully.");
  } catch (error: unknown) {
    const errorMessage = isAxiosError<{ message?: string }>(error)
      ? error.response?.data?.message
      : undefined;
    setMessage(errorMessage || "Failed to sign out device.");
  }

  window.setTimeout(() => setMessage(""), 2600);
} // ----------------------------------------------------------------------------------

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Fetch active sessions after this page mounts.
    fetchSessions();
  }, []);

  useEffect(()=>{
    const fetchProfile = async()=>{
      try{
        const response = await api.get("/profile")
        const user = response.data.user

        setValues({
          name: user.name || "",
          email: user.email || "",
          photo: user.profilePhoto || ""
        })

      }catch(err){
        console.log("Fetch data error",err)
        setMessage("Failed to load the profile")
      }finally{
        setLoaded(true)
      }
    }


    fetchProfile()
  },[])

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try{
      const response = await api.put("/profile",{
        name: values.name,
        email: values.email,
        profilePhoto: values.photo
      })

      const user = response.data.user

      setValues({
        name: user.name,
        email: user.email,
        photo: user.profilePhoto || " "
      })

      setMessage("Your profile has been saved.")

    }catch(err){
      console.log("Save profile error", err)
      setMessage("Failed to update profile")
    }

    window.setTimeout(()=> setMessage(""),2500);
  }

  async function handleChangePassword() {
     if (!currentPassword || !newPassword || !confirmPassword) {
    setMessage("Please fill all password fields.");
    return;
  }

  if (newPassword !== confirmPassword) {
    setMessage("New passwords do not match.");
    return;
  }

  if (newPassword.length < 8) {
    setMessage("Password must be at least 8 characters.");
    return;
  }

  try{
    const response = await api.put("change-password",{
      newPassword, currentPassword
    });

    setMessage("Password has been Chnaged Successfully")


  }catch(err){
    console.log(err)
    setMessage("Failed to change password")
  }

  window.setTimeout(()=> setMessage(""),2500)
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

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Choose an image smaller than 5 MB.");
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
          <div
            className={`${styles.toast} ${
              message.toLowerCase().includes("failed")
                ? styles.toastError
                : styles.toastSuccess
            }`}
          >
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
                    value={currentPassword}
                    onChange={(e)=> setCurrentPassword(e.target.value)}
                  />
                </label>
                <div className={styles.formGrid}>
                  <label>
                    New password
                    <input
                      type="password"
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      value={newPassword}
                      onChange={(e)=> setNewPassword(e.target.value)}
                    />
                  </label>
                  <label>
                    Confirm new password
                    <input
                      type="password"
                      autoComplete="new-password"
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e)=> setConfirmPassword(e.target.value)}
                    />
                  </label>
                </div>
                <div className={styles.formFooter}>
                  <span>Password changes require the account service.</span>
                  <button type="button" className={styles.primaryButton} onClick={handleChangePassword}>
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
                {sessionsLoading ? (
                  <p>Loading active sessions...</p>
                ) : sessions.length === 0 ? (
                  <p>No active sessions found.</p>
                ) : (
                  sessions.map((session) => (
                    <article key={session._id} className={styles.sessionCard}>
                      <span className={styles.sessionIcon}>
                        {session.isCurrent ? (
                          <Monitor size={18} />
                        ) : (
                          <Laptop size={18} />
                        )}
                      </span>

                      <div>
                        <b>
                          {session.isCurrent ? "Current session" : session.device}
                        </b>
                        <small>
                          Last active: {new Date(session.lastActive).toLocaleString()}
                        </small>
                      </div>

                      {session.isCurrent ? (
                        <span className={styles.currentSession}>Current</span>
                      ) : (
                       <button
                          className={styles.signOutButton}
                          onClick={() => handleRevokeSession(session._id)}
                        >
                          Sign out
                        </button>
                      )}
                    </article>
                  ))
                )}
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
