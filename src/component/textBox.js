import { ContextMenu } from "@/component/contextMenu.js";

export class TextBox {
    constructor(workspace, textContent = '') {

        this.parentWorkspace = workspace;

        this.textContainer = document.createElement('div');
        this.textContainer.classList.add('prototypeContainer','text');
        this.parentWorkspace.el.appendChild(this.textContainer);

        const contextMenu = new ContextMenu(this, this.parentWorkspace.el);
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
        const index = this.parentWorkspace.ChildObjects.indexOf(this);
        this.parentWorkspace.ChildObjects.splice(index, 1);
        this.textContainer.remove();
    }

    duplicate(){
        const index = this.parentWorkspace.ChildObjects.indexOf(this);
        const cloneTextbox = new TextBox(this.parentWorkspace, this.textBox.textContent);
        this.textContainer.insertAdjacentElement('afterend', cloneTextbox.textContainer);
        this.parentWorkspace.ChildObjects.splice(index + 1, 0, cloneTextbox);
    }

    getRootContainer(){
        return this.textContainer;
    }

    getObjectNameAsString(){
        return 'TextBox'
    }

    decPositionInWorkspace(){
        const index = this.parentWorkspace.ChildObjects.indexOf(this);
        this.parentWorkspace.ChildObjects.splice(index, 1);
        this.parentWorkspace.ChildObjects.splice(index - 1, 0, this);
    }

    incPositionInWorkspace(){
        const index = this.parentWorkspace.ChildObjects.indexOf(this);
        this.parentWorkspace.ChildObjects.splice(index, 1);
        this.parentWorkspace.ChildObjects.splice(index + 1, 0, this);
    }
}

