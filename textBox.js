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
        return this.textBox.textContent;
    }

    remove(){
        this.textContainer.remove();
    }

    getRootContainer(){
        return this.textContainer;
    }
}

