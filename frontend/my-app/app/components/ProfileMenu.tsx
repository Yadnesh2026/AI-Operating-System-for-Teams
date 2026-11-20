"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import styles from "./profile-menu.module.css";
import { useCurrentUser } from "../hooks/useCurrentUser";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const user = useCurrentUser();
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const initials = user?.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "?";

  useEffect(() => {
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

  function logOut() {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("redsun-user-profile");
    setOpen(false);
    router.push("/login");
  }

  return <div className={styles.profileMenu} ref={rootRef}>
    <button className={styles.trigger} onClick={() => setOpen((current) => !current)} aria-label="Open profile menu" aria-haspopup="menu" aria-expanded={open}>
      <span className={styles.avatar}>{user?.profilePhoto ? <img src={user.profilePhoto} alt="" /> : initials}</span><ChevronDown size={13} className={open ? styles.chevronOpen : ""} />
    </button>
    {open && <div className={styles.dropdown} role="menu">
      <div className={styles.identity}><span className={styles.identityAvatar}>{user?.profilePhoto ? <img src={user.profilePhoto} alt="" /> : initials}</span><span><b>{user?.name || "Your profile"}</b><small>{user?.email || "Sign in to connect"}</small></span></div>
      <div className={styles.divider} />
      <Link href="/settings" className={styles.menuItem} role="menuitem" onClick={() => setOpen(false)}><UserRound size={16} /><span>My Profile</span></Link>
      <button className={`${styles.menuItem} ${styles.logout}`} role="menuitem" onClick={logOut}><LogOut size={16} /><span>Log out</span></button>
    </div>}
  </div>;
}
