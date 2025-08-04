class TextBox {
    constructor() {

        const createContextMenu = () => {
            const contextMenu = document.createElement('div');
            contextMenu.classList.add('contextMenu');
            return contextMenu;
        }

        const textContainer = document.createElement('div');
        textContainer.classList.add('prototypeContainer','text');
        workspaceContext.appendChild(textContainer);

        const contextMenu = createContextMenu();
        textContainer.appendChild(contextMenu);

        const textBox = document.createElement('textBox');
        textBox.classList.add('textBox');
        textBox.contentEditable = 'true';
        textBox.spellcheck = false;
        textBox.textContent = 'Type here...'
        textContainer.appendChild(textBox);
        
    }
}

