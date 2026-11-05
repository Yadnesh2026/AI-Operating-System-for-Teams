"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Check, FolderKanban, Plus, Search, UsersRound, X } from "lucide-react";
import TeamWorkspace from "../components/TeamWorkspace";
import styles from "./teams.module.css";
import { teams as initialTeams, type Team } from "./teamData";

const tones: Record<Team["color"], string> = {
  red: styles.toneRed,
  violet: styles.toneViolet,
  blue: styles.toneBlue,
  green: styles.toneGreen,
};

const avatarTones: Record<Team["members"][number]["tone"], string> = {
  red: styles.toneRed,
  violet: styles.toneViolet,
  blue: styles.toneBlue,
  green: styles.toneGreen,
};

export default function TeamListPage() {
  const [teamList, setTeamList] = useState(initialTeams);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [createdMessage, setCreatedMessage] = useState("");

  const filteredTeams = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return teamList;
    return teamList.filter((team) => `${team.name} ${team.description}`.toLowerCase().includes(normalized));
  }, [query, teamList]);

  function createTeam(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanDescription = description.trim();
    if (!cleanName || !cleanDescription) return;
    const createdTeam: Team = {
      id: `new-team-${Date.now()}`,
      name: cleanName,
      description: cleanDescription,
      createdAt: "Nov 5, 2026",
      role: "Manager",
      color: "red",
      members: [{ id: "jordan", name: "Jordan Davis", email: "jordan@acme.co", role: "Manager", joined: "Nov 5, 2026", initials: "JD", tone: "red" }],
      projects: [],
    };
    setTeamList((current) => [createdTeam, ...current]);
    setModalOpen(false);
    setName("");
    setDescription("");
    setCreatedMessage(`${cleanName} is ready. You can open it to add members and projects.`);
  }

  const memberTotal = teamList.reduce((total, team) => total + team.members.length, 0);
  const managerCount = teamList.filter((team) => team.role === "Manager").length;

  return (
    <TeamWorkspace title="My Teams">
      <div className={styles.page}>
        <div className={styles.pageHeading}>
          <div>
            <span className={styles.eyebrow}>Workspace</span>
            <h1>My Teams</h1>
            <p>Manage your teams and collaborate with the people moving work forward.</p>
          </div>
          <button className={styles.primaryButton} onClick={() => setModalOpen(true)}><Plus size={17} /> Create team</button>
        </div>

        <div className={styles.overviewStrip}>
          <div className={styles.overviewCard}><span className={styles.overviewIcon}><UsersRound size={19} /></span><span className={styles.overviewText}><b>{teamList.length}</b><span>Teams you belong to</span></span></div>
          <div className={styles.overviewCard}><span className={styles.overviewIcon}><FolderKanban size={19} /></span><span className={styles.overviewText}><b>{memberTotal}</b><span>People across your teams</span></span></div>
          <div className={styles.overviewCard}><span className={styles.overviewIcon}><Check size={19} /></span><span className={styles.overviewText}><b>{managerCount}</b><span>Teams you manage</span></span></div>
        </div>

        <div className={styles.toolbar}>
          <div><h2>Your teams</h2><p>Open a team to see its members and projects.</p></div>
          <label className={styles.searchBox}><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search teams" aria-label="Search teams" /></label>
        </div>

        <div className={styles.teamGrid}>
          {filteredTeams.map((team) => {
            const href = `/teams/${team.id}?name=${encodeURIComponent(team.name)}&description=${encodeURIComponent(team.description)}&createdAt=${encodeURIComponent(team.createdAt)}&role=${team.role}`;
            return (
              <article className={styles.teamCard} key={team.id}>
                <div className={styles.teamCardTop}>
                  <span className={`${styles.teamIcon} ${tones[team.color]}`}><UsersRound size={21} /></span>
                  <div className={styles.teamIdentity}><h3>{team.name}</h3><p>{team.description}</p></div>
                  <span className={`${styles.roleBadge} ${team.role === "Employee" ? styles.roleEmployee : ""}`}>{team.role}</span>
                </div>
                <div className={styles.cardMeta}>
                  <span className={styles.metaItem}><UsersRound size={14} /> {team.members.length} {team.members.length === 1 ? "member" : "members"}</span>
                  <span className={styles.metaItem}><CalendarDays size={14} /> Created {team.createdAt}</span>
                </div>
                <div className={styles.cardFooter}>
                  <div className={styles.memberStack} aria-label={`${team.members.length} team members`}>
                    {team.members.slice(0, 4).map((member) => <span key={member.id} className={`${styles.miniAvatar} ${avatarTones[member.tone]}`} title={member.name}>{member.initials}</span>)}
                    {team.members.length > 4 && <span className={styles.moreMembers}>+{team.members.length - 4}</span>}
                  </div>
                  <Link className={styles.viewButton} href={href}>View team <ArrowRight size={15} /></Link>
                </div>
              </article>
            );
          })}
          {filteredTeams.length === 0 && <div className={styles.emptyState}><b>No teams found</b><p>Try another search, or create a new team.</p></div>}
        </div>
        {createdMessage && <p className={styles.inlineMessage} role="status">{createdMessage}</p>}
      </div>

      {modalOpen && (
        <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}>
          <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="create-team-title">
            <div className={styles.modalHeader}><div><h2 id="create-team-title">Create a team</h2><p>Start a workspace for people working toward the same goal.</p></div><button className={styles.closeButton} onClick={() => setModalOpen(false)} aria-label="Close"><X size={17} /></button></div>
            <form className={styles.form} onSubmit={createTeam}>
              <label className={styles.field}>Team name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Customer success" required maxLength={60} /></label>
              <label className={styles.field}>Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What will this team work on?" required maxLength={240} /></label>
              <div className={styles.modalActions}><button type="button" className={styles.secondaryButton} onClick={() => setModalOpen(false)}>Cancel</button><button type="submit" className={styles.primaryButton}><Plus size={15} /> Create team</button></div>
            </form>
          </section>
        </div>
      )}
    </TeamWorkspace>
  );
}
