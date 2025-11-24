import { initWorkspace, Workspace} from '@/lib/workspace.js';
import { TextBox } from "@/component/textBox.js";
import { StaveBox } from "@/component/staveBox.js";
import { AddTextBoxButton, AddStaveBoxButton } from "@/component/ribbon.js";
import { exportFile } from '@/exportFile.js';

document.addEventListener('DOMContentLoaded', () => {

const workspaceDOM = document.getElementsByClassName('workspaceContainer').item(0);
initWorkspace(workspaceDOM);
const ribbon = document.getElementsByClassName('ribbonContainer').item(0);
const exportButton = document.getElementsByClassName('exportButton').item(0);
exportButton.innerHTML = window.electronAPI.getIcon('saveFile');

AddTextBoxButton(ribbon, workspaceDOM);
AddStaveBoxButton(ribbon, workspaceDOM);

Workspace.ChildObjects.push(new TextBox())
Workspace.ChildObjects.push(new StaveBox(24, 'E/Ab/D/G/B/e/'))

exportButton.onclick = () => {
    let textBuffer = ``
    Workspace.ChildObjects.forEach(element => {
        textBuffer += element.parseStringContents();
        textBuffer += `\n`;
    });
    exportFile(textBuffer);
}
});

