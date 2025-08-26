class StaveBox {
    constructor(gridWidth, localTuning) {

        const workspaceContext = document.getElementsByClassName('workspaceContainer').item(0);
        //TODO: pass in settings from workspace context (tuning, strings, length etc)

        const Direction = {
            Horizontal: 'Horizontal',
            Vertical: 'Vertical'
        }

        let entryDirection = Direction.Horizontal;

        this.staveContainer = document.createElement('div');
        this.staveContainer.classList.add('prototypeContainer','stave');
        workspaceContext.appendChild(this.staveContainer);

        this.contextMenu = new ContextMenu(this, workspaceContext);
        this.staveContainer.appendChild(this.contextMenu);

        this.staveBox = document.createElement('div');
        this.staveBox.classList.add('staveBox');
        this.staveContainer.appendChild(this.staveBox);

        this.stringLabels = document.createElement('div');
        this.stringLabels.classList.add('stringLabels');

        this.staveEnd = document.createElement('div');
        this.staveEnd.classList.add('staveEnd');
        this.staveEnd.textContent = '|\r'.repeat(localTuning.length);

        const resizeHandler = (event) => {
            const mouseX = event.clientX;
            const gridRect = this.staveBoxGrid.getBoundingClientRect();
            const cellWidth = gridRect.width / gridWidth;
            const tempWidth = Math.max(parseInt((mouseX - gridRect.left) / cellWidth), 1);
            document.body.style.cursor = 'col-resize'
            if (tempWidth != gridWidth){
                gridWidth = tempWidth;
                this.cellArray.length = 0;
                this.staveBoxGrid.replaceChildren();
                drawGrid(this.staveBoxGrid);
            }
        }
        this.staveEnd.addEventListener('mousedown', (event) => {
            document.addEventListener('mouseup', () => {
                document.body.style.cursor = 'auto';
                this.staveEnd.classList.remove('focus');
                document.removeEventListener('mousemove', resizeHandler)
            }, {once: true})

            document.addEventListener('mousemove', resizeHandler)
            this.staveEnd.focus();
            this.staveEnd.classList.add('focus');


        });
        this.staveBox.appendChild(this.staveEnd);

        this.setTuning = (_tuning) => {
            this.stringLabels.textContent = '';
            let tuning = _tuning;
            let labelText = '';
            for (let i = tuning.length - 1; i >= 0; i--){
                labelText += tuning.charAt(i) + '|\r';
            }
            this.stringLabels.textContent = labelText;
            this.staveEnd.textContent = '|\r'.repeat(localTuning.length);
        };

        this.setTuning(localTuning);
        this.staveBox.appendChild(this.stringLabels);

        

        this.cellArray = [];

        const drawGrid = (staveGrid, staveValues = false) => {

            let gridHeight = localTuning.length;

            staveGrid.style.gridTemplateColumns = `repeat(${gridWidth}, 1.04em)`
            staveGrid.style.gridTemplateRows = `repeat(${gridHeight}, 1.04em)`
            
            for (let row = 0; row < gridHeight; row++){
                for (let col = 0; col < gridWidth; col++){
                    const index = (gridWidth * row) + (col);
                    const staveGridCell = document.createElement('div');
                    let focused = false;
                    staveGridCell.classList.add('staveGridCell');
                    staveGridCell.textContent = '-';

                    staveGridCell.addEventListener('click', (event) => {
                        
                        document.querySelectorAll(".staveGridCell.highlight").forEach((cell) => cell.classList.remove('highlight'));

                        //handle clicks initial
                        const clickHandler = (event) => {
                            if (!staveGridCell.contains(event.target)) {
                                focused = false;
                                staveGridCell.classList.remove('focus');
                                document.querySelectorAll(".staveGridCell.highlight").forEach((cell) => cell.classList.remove('highlight'));
                                document.removeEventListener('click', clickHandler);
                                document.removeEventListener('keydown', keydownHandler);
                            } else {
                                if (entryDirection === Direction.Horizontal){
                                    entryDirection = Direction.Vertical;
                                } else {
                                    entryDirection = Direction.Horizontal;
                                };
                            }
                        }

                        //handle keydowns
                        const keydownHandler = (event) => {
                            event.preventDefault();
                            const key = event.key;
                            const altHeld = event.altKey;

                            // arrow key traversal
                            // TODO: fix out of range: make vertical go to lowest cell of next column etc
                            if (key === 'ArrowRight'){
                                if (!altHeld){entryDirection = Direction.Horizontal;}
                                const nextcell = this.cellArray[index+1];
                                const event = new CustomEvent('click');

                                document.dispatchEvent(event);
                                nextcell.dispatchEvent(event);
                                return;
                            } else if (key === 'ArrowLeft'){
                                if (!altHeld){entryDirection = Direction.Horizontal;}
                                const nextcell = this.cellArray[index-1];
                                const event = new CustomEvent('click');

                                document.dispatchEvent(event);
                                nextcell.dispatchEvent(event);
                                return;
                            } else if (key === 'ArrowUp'){
                                //TODO: pressing up on top-rightmost cell goes out of bounds
                                if (!altHeld){entryDirection = Direction.Vertical;}
                                let nextcell = this.cellArray[index-gridWidth];
                                if (nextcell === undefined){
                                    nextcell = this.cellArray[index + (gridWidth * (localTuning.length - 1) + 1)];
                                }
                                const event = new CustomEvent('click');

                                document.dispatchEvent(event);
                                nextcell.dispatchEvent(event);
                                return;
                            } else if (key === 'ArrowDown'){
                                if (!altHeld){entryDirection = Direction.Vertical;}
                                let nextcell = this.cellArray[index+gridWidth];
                                const event = new CustomEvent('click');
                                if (nextcell === undefined){
                                    nextcell = this.cellArray[index - 1];
                                }

                                document.dispatchEvent(event);
                                nextcell.dispatchEvent(event);
                                return;
                            }

                            //backspace
                            if (key === 'Backspace'){
                                staveGridCell.textContent = '-';

                                if(altHeld){return;}
                                
                                if (entryDirection === Direction.Vertical){
                                    const nextcell = this.cellArray[index+gridWidth];
                                    const event = new CustomEvent('click');

                                    document.dispatchEvent(event);
                                    nextcell.dispatchEvent(event);
                                    return;
                                } else {
                                    entryDirection = Direction.Horizontal;
                                    const nextcell = this.cellArray[index-1];
                                    const event = new CustomEvent('click');

                                    document.dispatchEvent(event);
                                    nextcell.dispatchEvent(event);
                                    return;
                                }
                            }

                            
                            if (key === ' '){
                                if (entryDirection === Direction.Horizontal){
                                    entryDirection = Direction.Vertical;
                                    const event = new CustomEvent('click');
                                    document.dispatchEvent(event);
                                    staveGridCell.dispatchEvent(event);
                                } else {
                                    entryDirection = Direction.Horizontal;
                                    const event = new CustomEvent('click');
                                    document.dispatchEvent(event);
                                    staveGridCell.dispatchEvent(event);
                                }
                            }

                            //key input
                            if (/^[a-zA-Z0-9\/~-]$/.test(key)) {
                                staveGridCell.textContent = key;

                                if(altHeld){return;}

                                if (entryDirection === Direction.Vertical){
                                    let nextcell = this.cellArray[index-gridWidth];
                                    const event = new CustomEvent('click');
                                    if (nextcell === undefined){
                                    nextcell = this.cellArray[index + (gridWidth * (localTuning.length - 1) + 1)];
                                    }

                                    document.dispatchEvent(event);
                                    nextcell.dispatchEvent(event);
                                    return;
                                } else {
                                    entryDirection = Direction.Horizontal;
                                    const nextcell = this.cellArray[index+1];
                                    const event = new CustomEvent('click');

                                    document.dispatchEvent(event);
                                    nextcell.dispatchEvent(event);
                                    return;
                                }
                            }
                        }

                        //grid cell focused
                        if (!focused){
                            focused = true;
                            staveGridCell.classList.add('focus');
                            document.addEventListener('click', clickHandler);
                            document.addEventListener('keydown', keydownHandler);
                        }

                        //draw highlight to show entry direction
                        if (entryDirection === Direction.Horizontal){
                            const rowIndex = Math.floor(index/gridWidth);
                            const highlighedCells = this.cellArray.slice((rowIndex * gridWidth), ((rowIndex + 1) * gridWidth));
                            for (let cell = 0; cell < highlighedCells.length; cell++){
                                highlighedCells[cell].classList.add('highlight');
                            }
                        } else {
                            const columnIndex = index % gridWidth;
                            for (let cell = 0; cell < this.cellArray.length; cell++){
                                if ((cell % gridWidth) == columnIndex){
                                    this.cellArray[cell].classList.add('highlight');
                                }
                            }
                        };



                    })

                    staveGrid.appendChild(staveGridCell);
                    this.cellArray.push(staveGridCell);
                }
            }
        }

        this.staveBoxGrid = document.createElement('div');
        this.staveBoxGrid.classList.add('staveGrid');
        this.staveBox.appendChild(this.staveBoxGrid);
        drawGrid(this.staveBoxGrid);
        

        this.stringLabels.addEventListener('dblclick', () => {
            
            const outsideClickHandler = (event) => {
            if (!this.stringLabels.contains(event.target)) {
                this.stringLabels.classList.remove('focus');
                transientInput.removeEventListener('keydown', changeTuning);
                transientInput.remove()
                document.removeEventListener('click', outsideClickHandler);
            }
            };

            this.stringLabels.classList.add('focus');
            document.addEventListener('click', outsideClickHandler);

            const transientInput = document.createElement('div');
            transientInput.classList.add('transientInput');
            transientInput.contentEditable = 'true';
            transientInput.spellcheck = false;
            this.stringLabels.appendChild(transientInput);
            transientInput.textContent = localTuning;

            //moves cursor to end of text
            const range = document.createRange();
            range.selectNodeContents(transientInput);
            range.collapse(false);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            transientInput.focus();

            const changeTuning = (event) => {
                let key = event.key
                if (key === 'Enter'){
                    //add confirmation if stave has been edited at all
                    event.preventDefault();
                    const userInput = transientInput.textContent;
                    if(/^[a-zA-Z]+$/.test(userInput)){
                        localTuning = userInput;
                        this.cellArray.length = 0;
                        this.staveBoxGrid.replaceChildren();
                        drawGrid(this.staveBoxGrid);

                        this.setTuning(userInput);
                        
                        const event = new CustomEvent('click');
                        document.dispatchEvent(event);
                    }
                }
            }

            transientInput.addEventListener('keydown', changeTuning)
        });
    }

    parseStringContents(){
        return;
    }

    remove(){
        this.staveContainer.remove();
    }

    getRootContainer(){
        return this.staveContainer;
    }
}

