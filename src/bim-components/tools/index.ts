import * as OBC from "openbim-components"
import * as THREE from "three"
import { ToDoCard } from "./src/ToDoCard"

type ToDoPriority = "Low" | "Medium" | "High"

interface ToDo {
    description: string
    date: Date
    fragmentMap: OBC.FragmentIdMap
    camera: {position: THREE.Vector3, target: THREE.Vector3}
    priority: ToDoPriority
}

// Create and export a class named just like the folder, all tools must extend from component class
export class ToDoCreator extends OBC.Component<ToDo[]> implements OBC.UI {
    static uuid = "be178b9a-0ee1-4d3d-b83a-49d4c5f3e34b" //Mandatory and must be called "uuid"
    enable = true
    uiElement = new OBC.UIElement<{
        activationButton: OBC.Button
        toDoList: OBC.FloatingWindow
    }>()
    private _components: OBC.Components 
    private _list: ToDo[] = []
    
    constructor(components: OBC.Components) {
        super(components) //Special built in method to run the constructor
        this._components = components
        components.tools.add(ToDoCreator.uuid, this)
        this.setUI()
    }

    async setup() {
        const highlighter = await this._components.tools.get(OBC.FragmentHighlighter)
        highlighter.add(`${ToDoCreator.uuid}-priority-Low`, [new THREE.MeshStandardMaterial({color: 0x59bc59})])
        highlighter.add(`${ToDoCreator.uuid}-priority-Normal`, [new THREE.MeshStandardMaterial({color: 0x597cff})])
        highlighter.add(`${ToDoCreator.uuid}-priority-High`, [new THREE.MeshStandardMaterial({color: 0xff7676})])
    }

    deleteToDo() {
        
    }

    async addToDo(description: string, priority: ToDoPriority) {
        const camera = this._components.camera
        if (!(camera instanceof OBC.OrthoPerspectiveCamera)) {
            throw new Error("ToDoCreator needs the OrthoPerspectiveCamera in order to work")
        }

        const position = new THREE.Vector3()
        camera.controls.getPosition(position)
        const target = new THREE.Vector3()
        camera.controls.getTarget(target)
        const toDoCamera = {position, target}

        const highlighter = await this._components.tools.get(OBC.FragmentHighlighter)
        const toDo: ToDo = {
            camera: toDoCamera,
            description,
            date: new Date(),
            fragmentMap: highlighter.selection.select,
            priority
        }

        this._list.push(toDo)

        const toDoCard = new ToDoCard(this._components)
        toDoCard.description = toDo.description
        toDoCard.date = toDo.date
        toDoCard.onCardClick.add(() => {
            camera.controls.setLookAt(
                toDo.camera.position.x,
                toDo.camera.position.y,
                toDo.camera.position.z,
                toDo.camera.target.x,
                toDo.camera.target.y,
                toDo.camera.target.z,
                true
            )
            const fragmentMapLenght = Object.keys(toDo.fragmentMap).length
            if (fragmentMapLenght === 0) {return}
            highlighter.highlightByID("select", toDo.fragmentMap)
        })
        const toDoList = this.uiElement.get("toDoList")
        toDoList.addChild(toDoCard)
    }

    private async setUI() {
        const activationButton = new OBC.Button(this._components)
        activationButton.materialIcon = "construction"

        const newToDoBtn = new OBC.Button(this._components, {name: "Create"})
        activationButton.addChild(newToDoBtn)

        const form = new OBC.Modal(this._components)
        this._components.ui.add(form)
        form.title = "Create New To Do"

        const descriptionInput = new OBC.TextArea(this._components)
        descriptionInput.label = "Description"
        form.slots.content.addChild(descriptionInput)

        const priorityDropdown = new OBC.Dropdown(this._components)
        priorityDropdown.label = "Priority"
        priorityDropdown.addOption("Low", "Normal", "High")
        priorityDropdown.value = "Normal"
        form.slots.content.addChild(priorityDropdown)

        form.slots.content.get().style.padding = "20px"
        form.slots.content.get().style.display = "flex"
        form.slots.content.get().style.flexDirection = "column"
        form.slots.content.get().style.rowGap = "20px"

        form.onAccept.add(() => {
            this.addToDo(descriptionInput.value, priorityDropdown.value as ToDoPriority)
            descriptionInput.value = ""
            form.visible = false
        })

        form.onCancel.add(() => form.visible = false)

        newToDoBtn.onClick.add(() => form.visible = true)

        const toDoList = new OBC.FloatingWindow(this._components)
        this._components.ui.add(toDoList)
        toDoList.visible = false
        toDoList.title = "To Do List" 

        const toDoListToolbar = new OBC.SimpleUIComponent(this._components)
        toDoList.addChild(toDoListToolbar)

        const colorizeBtn = new OBC.Button(this._components)
        colorizeBtn.materialIcon = "format_color_fill"
        toDoListToolbar.addChild(colorizeBtn)

        const highlighter = await this._components.tools.get(OBC.FragmentHighlighter)
        colorizeBtn.onClick.add(() => {
            colorizeBtn.active = !colorizeBtn.active
            if (colorizeBtn.active) {
                for (const toDo of this._list) {
                    const fragmentMapLenght = Object.keys(toDo.fragmentMap).length
                    if(fragmentMapLenght === 0) {return}
                    highlighter.highlightByID(`${ToDoCreator.uuid}-priority-${toDo.priority}`, toDo.fragmentMap)
                }
            } else {
                highlighter.clear(`${ToDoCreator.uuid}-priority.Low`)
                highlighter.clear(`${ToDoCreator.uuid}-priority.Normal`)
                highlighter.clear(`${ToDoCreator.uuid}-priority.High`)
            }
        })
        
        const toDoListBtn = new OBC.Button(this._components, {name: "List"})
        activationButton.addChild(toDoListBtn)
        toDoListBtn.onClick.add(() => toDoList.visible = !toDoList.visible)

        this.uiElement.set({activationButton, toDoList})
    }

    get(): ToDo[] {
        return this._list
    }
}
