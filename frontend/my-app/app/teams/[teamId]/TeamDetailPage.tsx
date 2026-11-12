"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, Check, Pencil, Shield, Trash2, UserPlus, UsersRound, X } from "lucide-react";
import TeamWorkspace from "../../components/TeamWorkspace";
import styles from "../teams.module.css";
import type { Team, TeamMember, TeamMembership } from "../teamData";
import api from "../../lib/axios";

type TeamDetails = { team: Team; membership: TeamMembership[] };
type PopulatedMembership = Omit<TeamMembership, "userId"> & { userId: TeamMember };
type Dialog = "add" | "edit" | "delete" | null;

export default function TeamDetailPage({ teamId }: { teamId: string }) {
  const router = useRouter();
  const [details, setDetails] = useState<TeamDetails | null>(null);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [userId, setUserId] = useState("");
  const [draftName, setDraftName] = useState("");
  const [draftDescription, setDraftDescription] = useState("");
  const [message, setMessage] = useState("");
  const role = details?.membership[0]?.role;
  const isManager = role === "manager";

  async function fetchDetails() {
    try {
      const response = await api.get(`/getDetails/${teamId}`);
      const nextDetails = response.data as TeamDetails;
      setDetails(nextDetails);
      setDraftName(nextDetails.team.name);
      setDraftDescription(nextDetails.team.description);
    } catch (error) {
      console.error("Error fetching team details", error);
      setMessage("Could not load team details.");
    }
  }

  useEffect(() => { void fetchDetails(); }, [teamId]);

  async function addEmployee(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await api.post(`/addEmployee/${teamId}/members`, { userId: userId.trim() });
      setUserId("");
      setDialog(null);
      await fetchDetails();
    } catch (error) {
      console.error("Error adding team member", error);
      setMessage("Could not add this member.");
    }
  }

  async function saveTeam(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await api.put(`/updateTeam/${teamId}`, { name: draftName.trim(), description: draftDescription.trim() });
      setDialog(null);
      await fetchDetails();
    } catch (error) {
      console.error("Error updating team", error);
      setMessage("Could not update the team.");
    }
  }

  async function deleteTeam() {
    try {
      await api.delete(`/deleteTeam/${teamId}`);
      router.push("/teams");
    } catch (error) {
      console.error("Error deleting team", error);
      setMessage("Could not delete the team.");
    }
  }

  if (!details) return <TeamWorkspace title="Team"><div className={styles.page}><p>{message || "Loading team…"}</p></div></TeamWorkspace>;

  const team = details.team;
  const memberships = details.membership as PopulatedMembership[];

  return (
    <TeamWorkspace title={team.name}>
      <div className={styles.page}>
        <div className={styles.detailHeading}>
          <div><Link href="/teams" className={styles.viewButton}><ArrowLeft size={15} /> Back to My Teams</Link><div className={styles.detailTitle} style={{ marginTop: 12 }}><span className={`${styles.teamIcon} ${styles.toneRed}`}><UsersRound size={21} /></span><div><h1>{team.name}</h1><p>{team.description}</p></div></div></div>
          {isManager && <div className={styles.detailActions}><button className={styles.outlineButton} onClick={() => setDialog("edit")}><Pencil size={14} /> Edit team</button><button className={styles.dangerButton} onClick={() => setDialog("delete")}><Trash2 size={14} /> Delete team</button></div>}
        </div>
        <div className={styles.detailStats}><div className={styles.detailStat}><span>Memberships returned</span><b>{memberships.length}</b></div><div className={styles.detailStat}><span>Created</span><b>{new Date(team.createdAt).toLocaleDateString()}</b></div><div className={styles.detailStat}><span>Your role</span><b>{role}</b></div></div>
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}><div><h2>Team memberships</h2><p>Membership records returned by the team API.</p></div>{isManager && <button className={styles.primaryButton} onClick={() => setDialog("add")}><UserPlus size={15} /> Add employee</button>}</div>
          <div className={styles.memberList}>{memberships.map((membership) => <div className={styles.memberRow} key={membership._id}><div className={styles.memberInfo}><span className={`${styles.memberAvatar} ${styles.toneRed}`}>{membership.userId.name.slice(0, 2).toUpperCase()}</span><span className={styles.memberName}><b>{membership.userId.name}</b><span>{membership.userId.email}</span></span></div><span className={styles.memberRole}>{membership.role}</span><span className={styles.joinedDate}>{membership.createdAt ? new Date(membership.createdAt).toLocaleDateString() : ""}</span><span /></div>)}{memberships.length === 0 && <div className={styles.emptyState}><b>No memberships found</b></div>}</div>
          <div className={styles.createdLine}><CalendarDays size={15} /> Team created {new Date(team.createdAt).toLocaleDateString()}</div>
          <div className={styles.managerNote}><Shield size={16} /> You’re a <strong>{role}</strong> in this team. {isManager ? "You can manage team settings." : "Ask a team manager if you need access changes."}</div>
        </section>
        {message && <p className={styles.inlineMessage} role="status">{message}</p>}
      </div>
      {dialog && <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null); }}>
        {dialog === "add" && <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="add-employee-title"><div className={styles.modalHeader}><div><h2 id="add-employee-title">Add an employee</h2><p>Enter the user ID expected by the backend membership endpoint.</p></div><button className={styles.closeButton} onClick={() => setDialog(null)} aria-label="Close"><X size={17} /></button></div><form className={styles.form} onSubmit={addEmployee}><label className={styles.field}>User ID<input value={userId} onChange={(event) => setUserId(event.target.value)} required /></label><div className={styles.modalActions}><button type="button" className={styles.secondaryButton} onClick={() => setDialog(null)}>Cancel</button><button type="submit" className={styles.primaryButton}><UserPlus size={15} /> Add employee</button></div></form></section>}
        {dialog === "edit" && <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="edit-team-title"><div className={styles.modalHeader}><div><h2 id="edit-team-title">Edit team</h2><p>Update the team name or description.</p></div><button className={styles.closeButton} onClick={() => setDialog(null)} aria-label="Close"><X size={17} /></button></div><form className={styles.form} onSubmit={saveTeam}><label className={styles.field}>Team name<input value={draftName} onChange={(event) => setDraftName(event.target.value)} required maxLength={60} /></label><label className={styles.field}>Description<textarea value={draftDescription} onChange={(event) => setDraftDescription(event.target.value)} required maxLength={240} /></label><div className={styles.modalActions}><button type="button" className={styles.secondaryButton} onClick={() => setDialog(null)}>Cancel</button><button type="submit" className={styles.primaryButton}><Check size={15} /> Save changes</button></div></form></section>}
        {dialog === "delete" && <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="delete-team-title"><div className={styles.modalHeader}><div><h2 id="delete-team-title">Delete {team.name}?</h2><p>This removes the team and its memberships.</p></div><button className={styles.closeButton} onClick={() => setDialog(null)} aria-label="Close"><X size={17} /></button></div><div className={styles.modalActions}><button className={styles.secondaryButton} onClick={() => setDialog(null)}>Cancel</button><button className={styles.dangerButton} onClick={deleteTeam}><Trash2 size={15} /> Delete team</button></div></section>}
      </div>}
    </TeamWorkspace>
  );
}
