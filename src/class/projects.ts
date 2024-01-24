// Importing necessary dependencies and modules
import { v4 as uuidv4 } from 'uuid';

// Define types for project status, project type, and team role
export type ProjectStatus = "Pending" | "Active" | "Finished";
export type ProjectType = "Residential" | "Commercial" | "Institutional" | "Mixed-use" | "Industrial" | "Heavy civil";
export type TeamRole = "BIM Manager" | "Structural" | "MEP" | "Architect" | "Contractor";

// Define the structure for a team
export interface ITeam {
  teamName: string;
  teamRole: TeamRole;
  teamDescription: string;
  contactName: string;
  contactPhone: string;
}

// Define the structure for a project
export interface IProject {
  projectName: string;
  projectDescription: string;
  projectStatus: ProjectStatus;
  projectCost: string;
  projectType: ProjectType;
  projectAddress: string;
  projectFinishDate: Date;
  projectProgress: string;
  projectTeams: ITeam;
}

// Function to toggle a modal based on its ID
export function toggleModal(id: string) {
  const modal = document.getElementById(id);
  if (modal && modal instanceof HTMLDialogElement) {
    if (modal.open) {
      modal.close();
    } else modal.showModal();
  } else {
    console.warn("The provided modal wasn't found. ID: ", id);
  }
}

// DOM element to display team information
const teamInfo = document.getElementById("team-info") as HTMLElement;

// Function to update team information in the UI
function updateTeamInfo(team: Team) {
  if (team) {
    teamInfo.innerHTML = `
      <p>Company in charge: ${team.teamName}</p>
      <p>Company's role: ${team.teamRole}</p>
      <p>Description: ${team.teamDescription}</p>
      <p>Contact Name: ${team.contactName}</p>
      <p>Phone number: ${team.contactPhone}</p>`;
  }
}

// Class representing a project
export class Project implements IProject {
  // Properties to satisfy IProject
  projectName: string;
  projectDescription: string;
  projectStatus: "Pending" | "Active" | "Finished";
  projectCost: string;
  projectType: "Residential" | "Commercial" | "Institutional" | "Mixed-use" | "Industrial" | "Heavy civil";
  projectAddress: string;
  projectFinishDate: Date;
  projectProgress: string;

  // Class internals
  projectTeams: Team;
  ui: HTMLLIElement;
  id: string;

  constructor(data: IProject) {
    // Initialize properties with data
    for (const key in data) {
      this[key] = data[key];
    }
    // Generate a unique ID for the project
    this.id = uuidv4();
    // Set up the UI for the project
    this.setUI();
  }

  // Method to set up the UI for the project
  setUI() {
    // Check if UI element already exists
    if (this.ui) { return; }
    // Map project type to corresponding material icon
    const roleToIcon: Record<ProjectType, string> = {
      "Residential": "home",
      "Commercial": "corporate_fare",
      "Institutional": "school",
      "Mixed-use": "emoji_transportation",
      "Industrial": "factory",
      "Heavy civil": "stadium"
    };
    // Select the appropriate icon or use a default ("home")
    const icon = roleToIcon[this.projectType] || "home";
    // Create a list item element for the project
    this.ui = document.createElement("li");
    this.ui.className = "nav-project-btn";
    this.ui.id = "nav-project-btn";
    // Set inner HTML with material icon and project name
    this.ui.innerHTML = `<span class="material-icons-round">${icon}</span>${this.projectName}`;
  }
}

// Class representing a team
export class Team implements ITeam {
  // Properties to satisfy ITeam
  teamName: string;
  teamRole: "BIM Manager" | "Structural" | "MEP" | "Architect" | "Contractor";
  teamDescription: string;
  contactName: string;
  contactPhone: string;

  // Class internals
  ui: HTMLDivElement;
  id: string;

  constructor(data: ITeam) {
    // Initialize properties with data
    for (const key in data) {
      this[key] = data[key];
    }
    // Generate a unique ID for the team
    this.id = uuidv4();
    // Set up the UI for the team
    this.setTeamUI();
  }

  // Method to create the team card UI
  setTeamUI() {
    // Check if UI element already exists
    if (this.ui) { return; }
    // Map team role to corresponding material icon
    const roleToIcon: Record<TeamRole, string> = {
      "BIM Manager": "computer",
      "Structural": "foundation",
      "MEP": "plumbing",
      "Architect": "architecture",
      "Contractor": "construction"
    };
    // Select the appropriate icon or use a default ("computer")
    const icon = roleToIcon[this.teamRole] || "computer";
    // Create a div element for the team card
    this.ui = document.createElement("div");
    this.ui.className = "team-card";
    // Set inner HTML with material icon, team role, and team name
    this.ui.innerHTML = `
    <span class="material-icons-round" style="padding: 10px; background-color: #686868; border-radius: 10px; font-size: 20px;">${icon}</span>
    <p>${this.teamRole}</p>
    <p>${this.teamName}</p>
    `;
    // Add click interaction to display team information
    this.ui.addEventListener("click", (e) => {
      e.preventDefault();
      updateTeamInfo(this);
      toggleModal("team-info-popup");
    });
  }
}
