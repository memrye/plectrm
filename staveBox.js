class StaveBox {
    constructor(gridWidth, localTuning) {

        this.localTuning = localTuning;
        this.gridWidth = gridWidth;
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
        this.staveEnd.textContent = '|\r'.repeat(this.localTuning.length);

        const resizeHandler = (event) => {
            const mouseX = event.clientX;
            const gridRect = this.staveBoxGrid.getBoundingClientRect();
            const cellWidth = gridRect.width / this.gridWidth;
            const tempWidth = Math.max(parseInt((mouseX - gridRect.left) / cellWidth), 1);
            document.body.style.cursor = 'col-resize'

            if (tempWidth != this.gridWidth){
                
                const gridHeight = this.localTuning.length;
                let tempCellArray = [];
                for (let i = 0; i < gridHeight; i++){
                    tempCellArray.push(this.cellArray.slice(this.gridWidth * i, this.gridWidth * (i + 1)));
                };


                if (tempWidth < this.gridWidth){
                    for (let row = 0; row < tempCellArray.length; row++){
                        tempCellArray[row] = tempCellArray[row].slice(0, tempWidth - this.gridWidth);
                    };
                } else if (tempWidth > this.gridWidth){
                    for (let row = 0; row < tempCellArray.length; row++){
                        const size = tempWidth - this.gridWidth;
                        const diffArray = Array.from({ length: size }, () => ({ textContent: '-' }));
                        tempCellArray[row].push(...diffArray);
                    };
                }

                tempCellArray = tempCellArray.flat()

                this.gridWidth = tempWidth;
                this.cellArray.length = 0;
                this.staveBoxGrid.replaceChildren();
                drawGrid(this.staveBoxGrid, tempCellArray);
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
            this.staveEnd.textContent = '|\r'.repeat(this.localTuning.length);
        };

        this.setTuning(this.localTuning);
        this.staveBox.appendChild(this.stringLabels);

        

        this.cellArray = [];

        const drawGrid = (staveGrid, staveValues = false) => {

            let gridHeight = this.localTuning.length;


            staveGrid.style.gridTemplateColumns = `repeat(${this.gridWidth}, 1.04em)`
            staveGrid.style.gridTemplateRows = `repeat(${gridHeight}, 1.04em)`
            
            for (let row = 0; row < gridHeight; row++){
                for (let col = 0; col < this.gridWidth; col++){
                    const index = (this.gridWidth * row) + (col);
                    const staveGridCell = document.createElement('div');
                    let focused = false;
                    staveGridCell.classList.add('staveGridCell');
                    staveGridCell.textContent = staveValues[index]?.textContent ?? '-';
                    

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
                                let nextcell = this.cellArray[index-this.gridWidth];
                                if (nextcell === undefined){
                                    nextcell = this.cellArray[index + (this.gridWidth * (this.localTuning.length - 1) + 1)];
                                }
                                const event = new CustomEvent('click');

                                document.dispatchEvent(event);
                                nextcell.dispatchEvent(event);
                                return;
                            } else if (key === 'ArrowDown'){
                                if (!altHeld){entryDirection = Direction.Vertical;}
                                let nextcell = this.cellArray[index+this.gridWidth];
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
                                    const nextcell = this.cellArray[index+this.gridWidth];
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
                                    let nextcell = this.cellArray[index-this.gridWidth];
                                    const event = new CustomEvent('click');
                                    if (nextcell === undefined){
                                    nextcell = this.cellArray[index + (this.gridWidth * (this.localTuning.length - 1) + 1)];
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
                            const rowIndex = Math.floor(index/this.gridWidth);
                            const highlighedCells = this.cellArray.slice((rowIndex * this.gridWidth), ((rowIndex + 1) * this.gridWidth));
                            for (let cell = 0; cell < highlighedCells.length; cell++){
                                highlighedCells[cell].classList.add('highlight');
                            }
                        } else {
                            const columnIndex = index % this.gridWidth;
                            for (let cell = 0; cell < this.cellArray.length; cell++){
                                if ((cell % this.gridWidth) == columnIndex){
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
        

        this.stringLabels.addEventListener('dblclick', (event) => {
            if (document.getElementsByClassName('transientInputContainer').length){
                for (let element of document.getElementsByClassName('transientInputContainer')){
                    element.remove();
                }
            }

            const popUpContextMenu = new TransientInput;
            popUpContextMenu.click(event);
            popUpContextMenu.createAndAddLabel('tuning:')
            popUpContextMenu.createAndAddTextInput(this.localTuning, (contents) => {
                this.localTuning = contents;
                this.cellArray.length = 0;
                this.staveBoxGrid.replaceChildren();
                drawGrid(this.staveBoxGrid);

                this.setTuning(contents);

            })
            
        });
    }

    parseStringContents(){
        let textBuffer = ``;
        for (let row = 0; row < this.localTuning.length; row++){
            textBuffer += `${this.localTuning.charAt(this.localTuning.length - (row + 1))}`;
            textBuffer += '|';
            const cellrow = this.cellArray.slice(this.gridWidth * row, (this.gridWidth * row) + (this.gridWidth));
            cellrow.forEach((cell) =>{
                textBuffer += cell.textContent;
            });
            textBuffer += '|\n'
        }
        return textBuffer;
    }

    remove(){
        const index = workspaceContext.ChildObjects.indexOf(this);
        workspaceContext.ChildObjects.splice(index, 1);
        this.staveContainer.remove();
    }

    getRootContainer(){
        return this.staveContainer;
    }

    getObjectNameAsString(){
        return 'StaveBox'
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

