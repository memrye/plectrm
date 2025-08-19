class TextBox {
    constructor() {

        const workspaceContext = document.getElementsByClassName('workspaceContainer').item(0);

        const textContainer = document.createElement('div');
        textContainer.classList.add('prototypeContainer','text');
        workspaceContext.appendChild(textContainer);

        const contextMenu = new ContextMenu(textContainer, workspaceContext);
        textContainer.appendChild(contextMenu);

        this.textBox = document.createElement('div');
        this.textBox.classList.add('textBox');
        this.textBox.contentEditable = 'true';
        this.textBox.spellcheck = false;
        textContainer.appendChild(this.textBox);
        
    }

    parseStringContents(){
        return this.textBox.textContent;
    }
}

