"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Plus,
  Search,
  UsersRound,
  X,
} from "lucide-react";
import TeamWorkspace from "../components/TeamWorkspace";
import styles from "./teams.module.css";
import type { Team, TeamMembership } from "./teamData";
import api from "../lib/axios";

type TeamListMembership = Omit<TeamMembership, "teamId"> & { teamId: Team };

export default function TeamListPage() {
  // Page data and UI state: teams, search text, create form, status message, and loading state.
  const [memberships, setMemberships] = useState<TeamListMembership[]>([]);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);

  // Fetch the signed-in user's teams from the backend and update the page.
  async function fetchTeams() {
    try {
      const response = await api.get("/getAllTeams");
      setMemberships(response.data.teams ?? []);
    } catch (error) {
      console.error("Error fetching teams", error);
      setMessage("Could not load teams.");
    } finally {
      setLoading(false);
    }
  }

  // Load teams once when this page first opens.
  useEffect(() => {
    void fetchTeams();
  }, []);

  // Filter the loaded teams locally as the user types in the search box.
  const filteredMemberships = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return memberships;
    return memberships.filter(({ teamId }) =>
      `${teamId.name} ${teamId.description}`.toLowerCase().includes(normalized),
    );
  }, [query, memberships]);


  // Submit the create-team form, then reload the list to show the new team.
  async function createTeam(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await api.post("/createteam", {
        name: name.trim(),
        description: description.trim(),
      });
      setModalOpen(false);
      setName("");
      setDescription("");
      setMessage("Team created.");
      await fetchTeams();
    } catch (error) {
      console.error("Error creating team", error);
      setMessage("Could not create team.");
    }
  }

  

  // Count memberships where the current user has the manager role.
  const managerCount = memberships.filter(
    ({ role }) => role === "manager",
  ).length;

  return (
    <TeamWorkspace title="My Teams">
      <div className={styles.page}>
        {/* Page title and button that opens the create-team form. */}
        <div className={styles.pageHeading}>
          <div>
            <span className={styles.eyebrow}>Workspace</span>
            <h1>My Teams</h1>
            <p>
              Manage your teams and collaborate with the people moving work
              forward.
            </p>
          </div>
          <button
            className={styles.primaryButton}
            onClick={() => setModalOpen(true)}
          >
            <Plus size={17} /> Create team
          </button>
        </div>
        {/* Summary counts for all teams and teams managed by this user. */}
        <div className={styles.overviewStrip}>
          <div className={styles.overviewCard}>
            <span className={styles.overviewIcon}>
              <UsersRound size={19} />
            </span>
            <span className={styles.overviewText}>
              <b>{memberships.length}</b>
              <span>Teams you belong to</span>
            </span>
          </div>
          <div className={styles.overviewCard}>
            <span className={styles.overviewIcon}>
              <Check size={19} />
            </span>
            <span className={styles.overviewText}>
              <b>{managerCount}</b>
              <span>Teams you manage</span>
            </span>
          </div>
        </div>
        {/* Team search input; filtering is handled by filteredMemberships above. */}
        <div className={styles.toolbar}>
          <div>
            <h2>Your teams</h2>
            <p>Open a team to see its details.</p>
          </div>
          <label className={styles.searchBox}>
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search teams"
              aria-label="Search teams"
            />
          </label>
        </div>



        {/* Show loading, matching team cards, or an empty/search-no-results message. */}
        <div className={styles.teamGrid}>
          {loading ? (
            <p>Loading teams...</p>
          ) : filteredMemberships.length > 0 ? (
            filteredMemberships.map(({ _id, teamId: team, role }) => (
              <article className={styles.teamCard} key={_id}>
                <div className={styles.teamCardTop}>
                  <span className={`${styles.teamIcon} ${styles.toneRed}`}>
                    <UsersRound size={21} />
                  </span>
                  <div className={styles.teamIdentity}>
                    <h3>{team.name}</h3>
                    <p>{team.description}</p>
                  </div>
                  <span className={styles.roleBadge}>{role}</span>
                </div>
                <div className={styles.cardMeta}>
                  <span className={styles.metaItem}>
                    <CalendarDays size={14} />
                    Created {new Date(team.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.cardFooter}>
                  <span />
                  <Link className={styles.viewButton} href={`/teams/${team._id}`}>
                    View team <ArrowRight size={15} />
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className={styles.emptyState}>
              <b>
                {memberships.length === 0
                  ? "No teams found. Create your first team."
                  : "No teams found"}
              </b>
              <p>
                {memberships.length === 0
                  ? "Your teams will appear here once you create or join one."
                  : "Try another search, or create a new team."}
              </p>
            </div>
          )}
        </div>





        {message && (
          <p className={styles.inlineMessage} role="status">
            {message}
          </p>
        )}
      </div>
      {/* Create-team dialog; submitting it calls createTeam above. */}
      {modalOpen && (
        <div
          className={styles.modalBackdrop}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setModalOpen(false);
          }}
        >
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-team-title"
          >
            <div className={styles.modalHeader}>
              <div>
                <h2 id="create-team-title">Create a team</h2>
                <p>
                  Start a workspace for people working toward the same goal.
                </p>
              </div>
              <button
                className={styles.closeButton}
                onClick={() => setModalOpen(false)}
                aria-label="Close"
              >
                <X size={17} />
              </button>
            </div>
            <form className={styles.form} onSubmit={createTeam}>
              <label className={styles.field}>
                Team name
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter team name"
                  required
                  maxLength={60}
                />
              </label>
              <label className={styles.field}>
                Description
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="What will this team work on?"
                  required
                  maxLength={240}
                />
              </label>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.primaryButton}>
                  <Plus size={15} /> Create team
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </TeamWorkspace>
  );
}
