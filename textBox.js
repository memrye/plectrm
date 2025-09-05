class TextBox {
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
        const index = workspaceContext.ChildObjects.indexOf(this);
        workspaceContext.ChildObjects.splice(index, 1);
        this.textContainer.remove();
    }

    duplicate(){
        const index = workspaceContext.ChildObjects.indexOf(this);
        const cloneTextbox = new TextBox(this.textBox.textContent);
        this.textContainer.insertAdjacentElement('afterend', cloneTextbox.textContainer);
        workspaceContext.ChildObjects.splice(index + 1, 0, cloneTextbox);
    }

    getRootContainer(){
        return this.textContainer;
    }

    getObjectNameAsString(){
        return 'TextBox'
    }

    decPositionInWorkspace(){
        const index = workspaceContext.ChildObjects.indexOf(this);
        workspaceContext.ChildObjects.splice(index, 1);
        workspaceContext.ChildObjects.splice(index - 1, 0, this);
    }

    incPositionInWorkspace(){
        const index = workspaceContext.ChildObjects.indexOf(this);
        workspaceContext.ChildObjects.splice(index, 1);
        workspaceContext.ChildObjects.splice(index + 1, 0, this);
    }
}

