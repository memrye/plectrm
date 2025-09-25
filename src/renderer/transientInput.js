export class TransientInput {
    constructor() {
        if (document.getElementsByClassName('transientInputContainer').length){
            for (let element of document.getElementsByClassName('transientInputContainer')){
                element.remove();
            }
        }
        this.transientInputContainer = document.createElement('div');
        this.transientInputContainer.classList.add('transientInputContainer');
        document.body.appendChild(this.transientInputContainer);

        this.x = 0;
        this.y = 0;

        const clickHandler = (_event) => {
            if (!this.transientInputContainer.contains(_event.target)){
                this.transientInputContainer.remove();
                document.removeEventListener('mousedown', clickHandler)}
        }

        setTimeout(()=>{
            document.addEventListener('mousedown', clickHandler)
        }, 0);
        

    }

    setPosition(mouseEvent = null, positionOverride = null){
        if (mouseEvent){
            this.x = mouseEvent.pageX;
            this.y = mouseEvent.pageY;
        } else if (positionOverride) {
            this.x = positionOverride.x;
            this.y = positionOverride.y;
        }

        this.transientInputContainer.style.transform = `translate(${this.x}px, ${this.y}px)`;
        
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

    createAndAddTextInput(initialText, submitFn, regex = /[\s\S]*/) {
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
                submitFn(contents)
                this.transientInputContainer.remove();
            }
            //filter for non-character inputs, then apply regex
            if (key.length === 1){
                if (!(regex.test(key))){
                    event.preventDefault();
                }
            }
        })
    }

    createAndAddDivisor(){
        const transientDivisor = document.createElement('div');
        transientDivisor.classList.add('transientItem', 'transientDivisor');
        this.transientInputContainer.appendChild(transientDivisor);
    }

    endTransientInput(){
        const rect = this.transientInputContainer.getBoundingClientRect();
        if (rect.top > 0 && rect.left > 0 && rect.bottom < window.innerHeight && rect.right < window.innerWidth){

        } else {
            const yOffset = rect.height;
            this.transientInputContainer.style.transform = `translate(${this.x}px, ${this.y - yOffset}px)`;
        };
    }

}
