class TextBox {
    constructor() {

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

