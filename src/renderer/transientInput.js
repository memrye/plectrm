export class TransientInput {
    constructor() {
        this.transientInputContainer = document.createElement('div');
        this.transientInputContainer.classList.add('transientInputContainer');
        document.body.appendChild(this.transientInputContainer);

        document.addEventListener('click', (event) => {
            if (!this.transientInputContainer.contains(event.target)){
                this.transientInputContainer.remove();
            }
        })
    }

    click(mouseEvent){
        this.transientInputContainer.style.transform = `translate(${mouseEvent.pageX}px, ${mouseEvent.pageY + 10}px)`;
    }

    createAndAddButton(textLabel, clickFn) {
        const transientButton = document.createElement('div');
        transientButton.classList.add('transientItem', 'transientButton');
        transientButton.textContent = textLabel;
        this.transientInputContainer.appendChild(transientButton)

        transientButton.addEventListener('click', (event) => {
            clickFn();
            this.transientInputContainer.remove();
        })
    }

    createAndAddLabel(textLabel) {
        const transientLabel = document.createElement('div');
        transientLabel.classList.add('transientItem', 'transientLabel');
        transientLabel.textContent = textLabel;
        this.transientInputContainer.appendChild(transientLabel);
    }

    createAndAddTextInput(initialText, submitFn) {
        const transientTextInput = document.createElement('div');
        transientTextInput.classList.add('transientItem', 'transientInput');
        transientTextInput.textContent = initialText;
        transientTextInput.contentEditable = 'true';
        transientTextInput.spellcheck = false;
        this.transientInputContainer.appendChild(transientTextInput);

        //moves cursor to end of text
        const range = document.createRange();
        range.selectNodeContents(transientTextInput);
        range.collapse(false);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        transientTextInput.focus();

        transientTextInput.addEventListener('keydown', (event) => {
            let key = event.key
            if (key === 'Enter'){
                event.preventDefault();
                const contents = transientTextInput.textContent;
                if(/^[a-zA-Z]+$/.test(contents)){
                    submitFn(contents)
                    this.transientInputContainer.remove();
                }
            }
        })
    }

}