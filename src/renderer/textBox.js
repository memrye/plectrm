import { ContextMenu } from "./contextMenu";
import { Workspace } from "./workspace";

export class TextBox {
    constructor(textContent = '') {

        const workspaceContext = document.getElementsByClassName('workspaceContainer').item(0);

        this.textContainer = document.createElement('div');
        this.textContainer.classList.add('prototypeContainer','text');
        workspaceContext.appendChild(this.textContainer);

        const contextMenu = new ContextMenu(this, workspaceContext);
        this.textContainer.appendChild(contextMenu);

        this.textBox = document.createElement('div');
        this.textBox.classList.add('textBox');
        this.textBox.contentEditable = 'true';
        this.textBox.spellcheck = false;
        this.textBox.textContent = textContent;
        this.textContainer.appendChild(this.textBox);
        
    }

    parseStringContents(){
        const textBuffer = this.textBox.textContent + '\n'
        return textBuffer;
    }

    remove(){
        const index = Workspace.ChildObjects.indexOf(this);
        Workspace.ChildObjects.splice(index, 1);
        this.textContainer.remove();
    }

    duplicate(){
        const index = Workspace.ChildObjects.indexOf(this);
        const cloneTextbox = new TextBox(this.textBox.textContent);
        this.textContainer.insertAdjacentElement('afterend', cloneTextbox.textContainer);
        Workspace.ChildObjects.splice(index + 1, 0, cloneTextbox);
    }

    getRootContainer(){
        return this.textContainer;
    }

    getObjectNameAsString(){
        return 'TextBox'
    }

    decPositionInWorkspace(){
        const index = Workspace.ChildObjects.indexOf(this);
        Workspace.ChildObjects.splice(index, 1);
        Workspace.ChildObjects.splice(index - 1, 0, this);
    }

    incPositionInWorkspace(){
        const index = Workspace.ChildObjects.indexOf(this);
        Workspace.ChildObjects.splice(index, 1);
        Workspace.ChildObjects.splice(index + 1, 0, this);
    }
}

