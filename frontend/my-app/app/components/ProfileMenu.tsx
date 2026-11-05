"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import styles from "./profile-menu.module.css";

type Profile = { name: string; email: string; photo: string };
const defaultProfile: Profile = { name: "Your profile", email: "Account not connected", photo: "" };

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(defaultProfile);
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const initials = profile.name === "Your profile" ? "?" : profile.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "?";

  useEffect(() => {
    const saved = window.localStorage.getItem("redsun-settings-v2");
    if (saved) {
      try { setProfile({ ...defaultProfile, ...(JSON.parse(saved) as Partial<Profile>) }); } catch { /* Keep the default profile if local data is invalid. */ }
    }
    function closeOnOutsideClick(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return <div className={styles.profileMenu} ref={rootRef}>
    <button className={styles.trigger} onClick={() => setOpen((current) => !current)} aria-label="Open profile menu" aria-haspopup="menu" aria-expanded={open}>
      <span className={styles.avatar}>{profile.photo ? <img src={profile.photo} alt="" /> : initials}</span><ChevronDown size={13} className={open ? styles.chevronOpen : ""} />
    </button>
    {open && <div className={styles.dropdown} role="menu">
      <div className={styles.identity}><span className={styles.identityAvatar}>{profile.photo ? <img src={profile.photo} alt="" /> : initials}</span><span><b>{profile.name}</b><small>{profile.email}</small></span></div>
      <div className={styles.divider} />
      <Link href="/settings" className={styles.menuItem} role="menuitem" onClick={() => setOpen(false)}><UserRound size={16} /><span>My Profile</span></Link>
      <button className={`${styles.menuItem} ${styles.logout}`} role="menuitem" onClick={() => { setOpen(false); router.push("/login"); }}><LogOut size={16} /><span>Log out</span></button>
    </div>}
  </div>;
}
