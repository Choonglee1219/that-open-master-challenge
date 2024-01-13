import { ITeam, TeamRole } from "./class/teams"
import { TeamsManager } from "./class/teamsManager"

function toggleModal(id: string) {
  const modal = document.getElementById(id)
  if (modal && modal instanceof HTMLDialogElement) {
    if (modal.open) {
      modal.close()
    } else modal.showModal()
  } else {
    console.warn("The provided modal wasn't found. ID: ", id)
  }
}

const teamsListUI = document.getElementById("teams-list") as HTMLElement
const teamsManager = new TeamsManager(teamsListUI)
const newTeamBtn = document.getElementById("new-team-btn")
const teamForm = document.getElementById("new-team-form")
const cancelNewTeamBtn = document.getElementById("cancel-new-team-btn")
const submitNewTeamBtn = document.getElementById("submit-new-team-btn")
const closeErrorPopup = document.getElementById("close-error-popup")

if (newTeamBtn) {
  newTeamBtn.addEventListener("click", () => {toggleModal("new-team-modal")})
} else {
  console.warn("New projects button was not found")
}

if (closeErrorPopup) {
  closeErrorPopup.addEventListener("click", () => {
    toggleModal("error-popup");
  });
}

if (teamForm && teamForm instanceof HTMLFormElement) {
  submitNewTeamBtn?.addEventListener("click", (e) => {
    e.preventDefault()
    const formData = new FormData(teamForm)
    const teamData: ITeam = {
      teamName: formData.get("teamName") as string,
      teamRole: formData.get("teamRole") as TeamRole,
      teamDescription: formData.get("teamDescription") as string,
      contactName: formData.get("contactName") as string,
      contactPhone: formData.get("contactPhone") as string
    }
    try {
      const team = teamsManager.newTeam(teamData)
      teamForm.reset()
      toggleModal("new-team-modal")
    } catch (err) {
      const errorMessage = document.getElementById("err") as HTMLElement
      errorMessage.textContent = err
      toggleModal("error-popup")
    }
  })
  cancelNewTeamBtn?.addEventListener("click", () => {
    teamForm.reset()
    toggleModal("new-team-modal") 
  })
} else {
  console.warn("The project form was not found. Check the ID!")
}