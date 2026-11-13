
// Compatibility exports for team pages; canonical backend shapes live in backendTypes.
export type { TeamRole } from "../lib/backendTypes";
export type Team = import("../lib/backendTypes").TeamRecord;
export type TeamMembership = Omit<import("../lib/backendTypes").TeamMembershipRecord, "teamId"> & {
  teamId: Team | string;
};
export type TeamMember = Pick<import("../lib/backendTypes").UserRecord, "_id" | "name" | "email">;
