import { StaveBox } from "@/component/staveBox";
import { TextBox } from "@/component/textBox";

export function initStartscreen(foreground, workspace) {

    foreground.newWindow(() => {
        foreground.active(true);
        const startscreenContainer = document.createElement('div');
        startscreenContainer.classList.add('startscreen-container');
        startscreenContainer.innerHTML = `
        <div class='logo-container'>${window.electronAPI.getIcon('plectrmLogo')}</div>
        <h1>Welcome to Plectrm!</h1>
        <h2>Create or import a new project</h2>
        <div class='menu-container'>
            <button class='menuButton' id='newProject'>
                ${window.electronAPI.getIcon('projectFile')}
                New Project
            </button>
            <button class='menuButton' id='importProject' disabled>
                ${window.electronAPI.getIcon('importProject')}
                Import Project
            </button>
        </div>
        `;
        foreground.el.appendChild(startscreenContainer);

        const newProjectButton = document.querySelector('#newProject');
        if (!newProjectButton) {
            console.warn('error initialising startscreen: cannot find new project button');
            return false;
        };

        newProjectButton.addEventListener('click', () => {
            workspace.ChildObjects.push(new TextBox(workspace));
            workspace.ChildObjects.push(new StaveBox(workspace, 24, 'E/A/D/G/B/e/'));
            foreground.active(false);
            startscreenContainer.classList.toggle('hidden', true);
            setTimeout(() => { startscreenContainer.remove() }, 500)
        })
    })
}