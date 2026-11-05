"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Check, FolderKanban, Shield, Trash2, UserPlus, UsersRound, X, Pencil } from "lucide-react";
import TeamWorkspace from "../../components/TeamWorkspace";
import styles from "../teams.module.css";
import type { Team, TeamMember } from "../teamData";

type Dialog = "add" | "edit" | "delete" | null;

const avatarTones: Record<TeamMember["tone"], string> = {
  red: styles.toneRed,
  violet: styles.toneViolet,
  blue: styles.toneBlue,
  green: styles.toneGreen,
};

export default function TeamDetailPage({ initialTeam }: { initialTeam: Team }) {
  const router = useRouter();
  const [team, setTeam] = useState(initialTeam);
  const [members, setMembers] = useState(initialTeam.members);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [draftName, setDraftName] = useState(initialTeam.name);
  const [draftDescription, setDraftDescription] = useState(initialTeam.description);
  const isManager = team.role === "Manager";

  function addEmployee(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = memberName.trim();
    const cleanEmail = memberEmail.trim();
    if (!cleanName || !cleanEmail) return;
    const initials = cleanName.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
    setMembers((current) => [...current, { id: `member-${Date.now()}`, name: cleanName, email: cleanEmail, role: "Employee", joined: new Intl.DateTimeFormat("en", { month: "short", day: "2-digit", year: "numeric" }).format(new Date()), initials, tone: "red" }]);
    setMemberName("");
    setMemberEmail("");
    setDialog(null);
  }

  function removeEmployee(id: string) {
    setMembers((current) => current.filter((member) => member.id !== id));
  }

  function saveTeam(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTeam((current) => ({ ...current, name: draftName.trim(), description: draftDescription.trim() }));
    setDialog(null);
  }

  return (
    <TeamWorkspace title={team.name}>
      <div className={styles.page}>
        <div className={styles.detailHeading}>
          <div>
            <Link href="/teams" className={styles.viewButton}><ArrowLeft size={15} /> Back to My Teams</Link>
            <div className={styles.detailTitle} style={{ marginTop: 12 }}>
              <span className={`${styles.teamIcon} ${styles.toneRed}`}><UsersRound size={21} /></span>
              <div><h1>{team.name}</h1><p>{team.description}</p></div>
            </div>
          </div>
          {isManager && <div className={styles.detailActions}>
            <button className={styles.outlineButton} onClick={() => { setDraftName(team.name); setDraftDescription(team.description); setDialog("edit"); }}><Pencil size={14} /> Edit team</button>
            <button className={styles.dangerButton} onClick={() => setDialog("delete")}><Trash2 size={14} /> Delete team</button>
          </div>}
        </div>

        <div className={styles.detailStats}>
          <div className={styles.detailStat}><span>Members</span><b>{members.length}</b></div>
          <div className={styles.detailStat}><span>Team projects</span><b>{team.projects.length}</b></div>
          <div className={styles.detailStat}><span>Your role</span><b>{team.role}</b></div>
        </div>

        <div className={styles.sectionGrid}>
          <section className={styles.sectionCard}>
            <div className={styles.sectionHeader}><div><h2>Team members</h2><p>People who have access to this team.</p></div>{isManager && <button className={styles.primaryButton} onClick={() => setDialog("add")}><UserPlus size={15} /> Add employee</button>}</div>
            <div className={styles.memberList}>
              {members.map((member) => <div className={styles.memberRow} key={member.id}>
                <div className={styles.memberInfo}><span className={`${styles.memberAvatar} ${avatarTones[member.tone]}`}>{member.initials}</span><span className={styles.memberName}><b>{member.name}</b><span>{member.email}</span></span></div>
                <span className={styles.memberRole}>{member.role}</span>
                <span className={styles.joinedDate}>{member.joined}</span>
                {isManager && member.role === "Employee" ? <button className={styles.removeButton} onClick={() => removeEmployee(member.id)} aria-label={`Remove ${member.name}`} title="Remove employee"><Trash2 size={15} /></button> : <span />}
              </div>)}
              {members.length === 0 && <div className={styles.emptyState}><b>No team members yet</b><p>Add employees to start collaborating.</p></div>}
            </div>
          </section>

          <div className={styles.detailSide}>
            <section className={styles.sectionCard}>
              <div className={styles.sectionHeader}><div><h2>Team overview</h2><p>Quick details about your team.</p></div></div>
              <p className={styles.overviewDescription}>{team.description}</p>
              <div className={styles.createdLine}><CalendarDays size={15} /> Created {team.createdAt}</div>
              <div className={styles.managerNote}><Shield size={16} /> You’re a <strong>{team.role.toLowerCase()}</strong> in this team. {isManager ? "You can manage members and team settings." : "Ask a team manager if you need access changes."}</div>
            </section>

            <section className={styles.sectionCard} style={{ marginTop: 15 }}>
              <div className={styles.sectionHeader}><div><h2>Team projects</h2><p>Current work owned by this team.</p></div><FolderKanban size={18} color="#ff7777" /></div>
              {team.projects.length > 0 ? <div className={styles.projectList}>{team.projects.map((project) => <article className={styles.projectItem} key={project.name}>
                <div className={styles.projectItemTop}><b>{project.name}</b><span className={styles.projectStatus}>{project.status}</span></div>
                <div className={styles.progressTrack}><span className={styles.progressFill} style={{ width: `${project.progress}%` }} /></div>
                <div className={styles.projectItemFoot}><span>{project.progress}% complete</span><span>Due {project.due}</span></div>
              </article>)}</div> : <div className={styles.emptyState}><b>No projects yet</b><p>Projects assigned to this team will appear here.</p></div>}
            </section>
          </div>
        </div>
      </div>

      {dialog && <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null); }}>
        {dialog === "add" && <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="add-employee-title">
          <div className={styles.modalHeader}><div><h2 id="add-employee-title">Add an employee</h2><p>Invite a person to join {team.name}.</p></div><button className={styles.closeButton} onClick={() => setDialog(null)} aria-label="Close"><X size={17} /></button></div>
          <form className={styles.form} onSubmit={addEmployee}>
            <label className={styles.field}>Full name<input value={memberName} onChange={(event) => setMemberName(event.target.value)} placeholder="Employee name" required /></label>
            <label className={styles.field}>Email address<input type="email" value={memberEmail} onChange={(event) => setMemberEmail(event.target.value)} placeholder="name@company.com" required /></label>
            <div className={styles.modalActions}><button type="button" className={styles.secondaryButton} onClick={() => setDialog(null)}>Cancel</button><button type="submit" className={styles.primaryButton}><UserPlus size={15} /> Add employee</button></div>
          </form>
        </section>}
        {dialog === "edit" && <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="edit-team-title">
          <div className={styles.modalHeader}><div><h2 id="edit-team-title">Edit team</h2><p>Update the team name or description.</p></div><button className={styles.closeButton} onClick={() => setDialog(null)} aria-label="Close"><X size={17} /></button></div>
          <form className={styles.form} onSubmit={saveTeam}>
            <label className={styles.field}>Team name<input value={draftName} onChange={(event) => setDraftName(event.target.value)} required maxLength={60} /></label>
            <label className={styles.field}>Description<textarea value={draftDescription} onChange={(event) => setDraftDescription(event.target.value)} required maxLength={240} /></label>
            <div className={styles.modalActions}><button type="button" className={styles.secondaryButton} onClick={() => setDialog(null)}>Cancel</button><button type="submit" className={styles.primaryButton}><Check size={15} /> Save changes</button></div>
          </form>
        </section>}
        {dialog === "delete" && <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="delete-team-title">
          <div className={styles.modalHeader}><div><h2 id="delete-team-title">Delete {team.name}?</h2><p>This removes the team from your current workspace view.</p></div><button className={styles.closeButton} onClick={() => setDialog(null)} aria-label="Close"><X size={17} /></button></div>
          <div className={styles.modalActions}><button className={styles.secondaryButton} onClick={() => setDialog(null)}>Cancel</button><button className={styles.dangerButton} onClick={() => router.push("/teams")}><Trash2 size={15} /> Delete team</button></div>
        </section>}
      </div>}
    </TeamWorkspace>
  );
}
