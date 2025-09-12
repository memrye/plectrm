import './style.css'; 
import { initWorkspace, Workspace} from './workspace.js';
import { TextBox } from "./textBox.js";
import { StaveBox } from "./staveBox.js";
import { AddTextBoxButton } from "./ribbonButtons.js";
import { AddStaveBoxButton } from "./ribbonButtons.js";
import { exportFile } from './exportFile.js';

document.addEventListener('DOMContentLoaded', () => {

const workspaceDOM = document.getElementsByClassName('workspaceContainer').item(0);
initWorkspace(workspaceDOM);
const ribbon = document.getElementsByClassName('ribbonContainer').item(0);
const exportButton = document.getElementsByClassName('exportButton').item(0);
exportButton.innerHTML = window.electronAPI.getIcon('saveFile');

AddTextBoxButton(ribbon, workspaceDOM);
AddStaveBoxButton(ribbon, workspaceDOM);

Workspace.ChildObjects.push(new TextBox())
Workspace.ChildObjects.push(new StaveBox(24, 'EADGBe'))

exportButton.onclick = () => {
    let textBuffer = ``
    Workspace.ChildObjects.forEach(element => {
        textBuffer += element.parseStringContents();
        textBuffer += `\n`;
    });
    exportFile(textBuffer);
}
});

