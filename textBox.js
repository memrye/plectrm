class TextBox {
    constructor() {

        const workspaceContext = document.getElementsByClassName('workspaceContainer').item(0);

        const textContainer = document.createElement('div');
        textContainer.classList.add('prototypeContainer','text');
        workspaceContext.appendChild(textContainer);

        const contextMenu = new ContextMenu(textContainer, workspaceContext);
        textContainer.appendChild(contextMenu);

        const textBox = document.createElement('textBox');
        textBox.classList.add('textBox');
        textBox.contentEditable = 'true';
        textBox.spellcheck = false;
        textBox.textContent = 'Type here...'
        textContainer.appendChild(textBox);
        
    }
}

