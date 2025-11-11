import { ContextMenu } from "./contextMenu";
import { TransientInput } from "./transientInput";
import { Workspace } from "./workspace";

export class StaveBox {

    constructor(gridWidth, localTuning, cellArray = []) {

        this.resizeHandler = this.resizeHandler.bind(this);
        this.localTuning = localTuning;
        this.gridWidth = gridWidth;
        const workspaceContext = document.getElementsByClassName('workspaceContainer').item(0);

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

        this.staveEnd.addEventListener('mousedown', (event) => {
            document.addEventListener('mouseup', () => {
                document.body.style.cursor = 'auto';
                this.staveEnd.classList.remove('focus');
                document.removeEventListener('mousemove', this.resizeHandler)
            })

            document.addEventListener('mousemove', this.resizeHandler)
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

        this.cellArray = [...cellArray];
        this.cellArray.hasFocus = false;

        this.drawGrid = (staveGrid, staveValues = false) => {

            let gridHeight = this.localTuning.length;


            staveGrid.style.gridTemplateColumns = `repeat(${this.gridWidth}, 1.04em)`
            staveGrid.style.gridTemplateRows = `repeat(${gridHeight}, 1.04em)`
            
            for (let row = 0; row < gridHeight; row++){
                for (let col = 0; col < this.gridWidth; col++){
                    const index = (this.gridWidth * row) + (col);
                    const staveGridCell = document.createElement('div');
                    let focused = false;
                    this.cellArray.hasFocus = false;
                    staveGridCell.classList.add('staveGridCell');
                    staveGridCell.textContent = staveValues[index]?.textContent ?? '-';
                    

                    staveGridCell.addEventListener('click', (event) => {
                        
                        document.querySelectorAll(".staveGridCell.highlight").forEach((cell) => cell.classList.remove('highlight'));

                        //handle clicks initial
                        const clickHandler = (event) => {
                            if (!staveGridCell.contains(event.target)) {
                                focused = false;
                                this.cellArray.hasFocus = false;
                                staveGridCell.classList.remove('focus');
                                document.querySelectorAll(".staveGridCell.highlight").forEach((cell) => cell.classList.remove('highlight'));
                                document.removeEventListener('click', clickHandler);
                                document.removeEventListener('keydown', keydownHandler);
                            }
                        }

                        //handle keydowns
                        const keydownHandler = (event) => {
                            event.preventDefault();
                            const key = event.key;
                            const altHeld = event.altKey;

                            // arrow key traversal
                            if (key === 'ArrowRight'){
                                let nextcell, event;
                                if (!altHeld){entryDirection = Direction.Horizontal}

                                if (altHeld && (Math.trunc((index+1) / this.gridWidth) != Math.trunc((index) / this.gridWidth))){
                                    nextcell = this.cellArray[index - this.gridWidth + 1];
                                } else {
                                    nextcell = this.cellArray[index + 1];
                                }

                                if (nextcell === undefined) { return; }

                                event = new CustomEvent('click');
                                document.dispatchEvent(event);
                                nextcell.dispatchEvent(event);
                                return;
                            } else if (key === 'ArrowLeft'){
                                let nextcell, event;
                                if (!altHeld){entryDirection = Direction.Horizontal}

                                if (altHeld && (Math.trunc((index-1) / this.gridWidth) != Math.trunc((index) / this.gridWidth))){
                                    nextcell = this.cellArray[index + this.gridWidth - 1];
                                } else {
                                    nextcell = this.cellArray[index - 1];
                                }

                                if (nextcell === undefined) { return; }

                                event = new CustomEvent('click');
                                document.dispatchEvent(event);
                                nextcell.dispatchEvent(event);
                                return;
                            } else if (key === 'ArrowUp'){
                                let nextcell, event;
                                if (!altHeld){entryDirection = Direction.Vertical}

                                nextcell = this.cellArray[index - this.gridWidth];

                                if (nextcell === undefined){
                                    if (altHeld) {nextcell =    this.cellArray[index + (this.gridWidth * (this.localTuning.length - 1))]}
                                    else {nextcell =            this.cellArray[index + (this.gridWidth * (this.localTuning.length - 1)) - 1]}
                                }

                                if (nextcell === undefined) { return; }

                                event = new CustomEvent('click');
                                document.dispatchEvent(event);
                                nextcell.dispatchEvent(event);
                                return;
                            } else if (key === 'ArrowDown'){
                                let nextcell, event;
                                if (!altHeld){entryDirection = Direction.Vertical;}
                                nextcell = this.cellArray[index+this.gridWidth];
                                
                                if (nextcell === undefined){
                                    if (altHeld) {nextcell =    this.cellArray[index - (this.gridWidth * (this.localTuning.length - 1))]}
                                    else {nextcell =            this.cellArray[index - (this.gridWidth * (this.localTuning.length - 1)) - 1]}
                                }

                                if (nextcell === undefined) { return; }
                                event = new CustomEvent('click');
                                document.dispatchEvent(event);
                                nextcell.dispatchEvent(event);
                            }

                            //backspace
                            if (key === 'Backspace'){
                                let nextcell, event;
                                staveGridCell.textContent = '-';

                                if (entryDirection === Direction.Vertical){
                                    nextcell = this.cellArray[index+this.gridWidth];
                                
                                    if (nextcell === undefined){
                                        if (altHeld) {nextcell =    this.cellArray[index - (this.gridWidth * (this.localTuning.length - 1))]}
                                        else {nextcell =            this.cellArray[index - (this.gridWidth * (this.localTuning.length - 1)) - 1]}
                                    }

                                    if (nextcell === undefined) { return; }
                                    event = new CustomEvent('click');
                                    document.dispatchEvent(event);
                                    nextcell.dispatchEvent(event);
                                } else {
                                    entryDirection = Direction.Horizontal;

                                    if (altHeld && (Math.trunc((index-1) / this.gridWidth) != Math.trunc((index) / this.gridWidth))){
                                        nextcell = this.cellArray[index + this.gridWidth - 1];
                                    } else {
                                        nextcell = this.cellArray[index - 1];
                                    }

                                    if (nextcell === undefined) { return; }

                                    event = new CustomEvent('click');
                                    document.dispatchEvent(event);
                                    nextcell.dispatchEvent(event);
                                }

                                //if cell is still undefined then dont move
                                if (nextcell === undefined) { return; }

                                document.dispatchEvent(event);
                                nextcell.dispatchEvent(event);
                                return;
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

                                let nextcell, event;

                                if (entryDirection === Direction.Vertical){

                                    nextcell = this.cellArray[index - this.gridWidth];

                                    if (nextcell === undefined){ nextcell = this.cellArray[index + (this.gridWidth * (this.localTuning.length - 1)) - 1] }

                                    if (nextcell === undefined) { return; }

                                    event = new CustomEvent('click');
                                    document.dispatchEvent(event);
                                    nextcell.dispatchEvent(event);
                                    return;
                                } else {

                                    nextcell = this.cellArray[index + 1];
                                    if (nextcell === undefined) { return; }

                                    event = new CustomEvent('click');
                                    document.dispatchEvent(event);
                                    nextcell.dispatchEvent(event);
                                    return;
                                }
                            }
                        }

                        //grid cell focused
                        if (!focused){
                            focused = true;
                            this.cellArray.hasFocus = true;
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

                    staveGridCell.addEventListener('dblclick', () => {
                        if (entryDirection == Direction.Horizontal){
                            entryDirection = Direction.Vertical;
                        } else {
                            entryDirection = Direction.Horizontal;
                        }
                    })

                    staveGrid.appendChild(staveGridCell);
                    this.cellArray.push(staveGridCell);
                }
            }
        }

        this.staveBoxGrid = document.createElement('div');
        this.staveBoxGrid.classList.add('staveGrid');
        this.staveBox.appendChild(this.staveBoxGrid);
        this.drawGrid(this.staveBoxGrid, this.cellArray);

        const openTuningMenu = (mouseEvent) => {

            const popUpContextMenu = new TransientInput;
            popUpContextMenu.setPosition(mouseEvent, null);
            popUpContextMenu.createAndAddLabel('tuning:')
            popUpContextMenu.createAndAddTextInput(this.localTuning, (contents) => {
                this.localTuning = contents;
                this.cellArray.length = 0;
                this.staveBoxGrid.replaceChildren();
                this.drawGrid(this.staveBoxGrid);

                this.setTuning(contents);

            });
            popUpContextMenu.endTransientInput();
        }

        this.stringLabels.addEventListener('dblclick', openTuningMenu);
        this.stringLabels.addEventListener('contextmenu', openTuningMenu);

        this.initStaveArticulation = (artCellValues = nil) => {
            if(!this.staveContainer.classList.toggle('articulated', true )) {console.warn('failed applying stave articulation layout: style already applied');};
            this.staveArticulationContainer = document.createElement('div');
            this.staveArticulationContainer.classList.add('staveArticulationContainer');
            this.staveArticulationContainer.style.gridTemplateColumns = `repeat(${this.gridWidth}, 1.04em)`
            this.staveContainer.appendChild(this.staveArticulationContainer);
            
            this.articulationCellArray = [];
            this.articulationCellArray.hasFocus = false;


            const scaffoldText = typeof artCellValues === 'string' ? artCellValues: 'PM----|';

            const handleClick = (ev) => {
                const cell = ev.target;
                if (ev.button) { return; }
                this.articulationCellArray.hasFocus = true;
                cell.classList.add('focus','highlight');

                const outsideClick = (ev) => {
                    if (ev.button) { return; }
                    if (ev.target !== cell) {
                        cell.classList.remove('focus');
                        cell.classList.remove('highlight');
                        this.articulationCellArray.hasFocus = false;
                        document.removeEventListener('click', outsideClick);
                        document.removeEventListener('keydown', keydownHandler);
                    }
                }

                const keydownHandler = (ev) => {
                    const key = ev.key;
                    const index = this.articulationCellArray.indexOf(cell)
                    if (key === 'ArrowLeft'){
                        let nextcell, event;
                        nextcell = this.articulationCellArray[Math.max(index - 1, 0)];
                        event = new CustomEvent('click', { button: 0 });
                        document.dispatchEvent(event);
                        nextcell.dispatchEvent(event);
                    } else if (key === 'ArrowRight'){
                        let nextcell, event;
                        nextcell = this.articulationCellArray[Math.min(index + 1, this.articulationCellArray.length - 1)];
                        event = new CustomEvent('click', { button: 0 });
                        document.dispatchEvent(event);
                        nextcell.dispatchEvent(event);
                    } else if (/^[A-Za-z0-9 !"%&'()*+,\-./:;<=>?@\[\]^`{|}~]+$/.test(key) && key.length === 1) {
                        cell.textContent = key;
                        let nextcell, event;
                        nextcell = this.articulationCellArray[Math.min(index + 1, this.articulationCellArray.length - 1)];
                        event = new CustomEvent('click', { button: 0 });
                        document.dispatchEvent(event);
                        nextcell.dispatchEvent(event);
                    } else if (key === 'Backspace'){
                        cell.textContent = ' ';
                        let nextcell, event;
                        nextcell = this.articulationCellArray[Math.max(index - 1, 0)];
                        event = new CustomEvent('click', { button: 0 });
                        document.dispatchEvent(event);
                        nextcell.dispatchEvent(event);
                    }
                }

                document.addEventListener('click', outsideClick);
                document.addEventListener('keydown', keydownHandler);
            }

            this.createArtCell = (i) => {
                const articulationCell = document.createElement('div');
                articulationCell.classList.add('staveGridCell', 'articulationCell');
                articulationCell.textContent = i < scaffoldText.length ? scaffoldText.charAt(i) : ' ';

                articulationCell.addEventListener('click', handleClick);
                this.articulationCellArray.push(this.staveArticulationContainer.appendChild(articulationCell));
            }

            for (let i = 0; i < this.gridWidth; i++){
                this.createArtCell(i);
            }
        }

        this.hoverHelper = document.createElement('div');
        this.hoverHelper.classList.add('hoverHelper', 'hidden');
        document.body.appendChild(this.hoverHelper);
        this.hoverMenu = document.createElement('button');
        this.hoverMenu.classList.add('hoverMenu', 'hidden');
        this.hoverMenu.innerHTML = window.electronAPI.getIcon('addTabArticulation');
        document.body.appendChild(this.hoverMenu);

        this.openHoverMenu = (mouseEvent) => {
        const r = this.staveContainer.getBoundingClientRect();
        if (!this.hoverHelper.classList.replace('hidden', 'shown')) { return; }
        if (!this.hoverMenu.classList.replace('hidden', 'shown')) { return; }
        if (!this.staveContainer.classList.toggle('hover', true )) { return; }
        this.hoverHelper.style.transform = `translate(${r.left + (r.width / 2)}px, ${r.bottom}px)`;
        this.hoverMenu.style.transform = `translate(${r.left + (r.width / 2)}px, ${r.bottom}px)`;
        }

        this.closeHoverMenu = (mouseEvent) => {
            if (!this.hoverHelper.classList.replace('shown', 'hidden')) { return; }
            if (!this.hoverMenu.classList.replace('shown', 'hidden')) { return; }
            if (!this.staveContainer.classList.toggle('hover', false )) { return; }
        }

        this.staveContainer.addEventListener('mouseenter', this.openHoverMenu);
        this.hoverHelper.addEventListener('mouseenter', this.openHoverMenu);
        this.hoverMenu.addEventListener('mouseenter', this.openHoverMenu);

        this.hoverMenu.onclick = (mouseEvent) => {
            this.staveContainer.removeEventListener('mouseenter', this.openHoverMenu);
            this.staveContainer.removeEventListener('mouseleave', this.closeHoverMenu);
            this.staveContainer.classList.toggle('hover', false );

            this.initStaveArticulation(mouseEvent.detail);


            this.hoverHelper.remove();
            this.hoverMenu.remove();
        }
        
        this.staveContainer.addEventListener('mouseleave', this.closeHoverMenu);
        this.hoverHelper.addEventListener('mouseleave', this.closeHoverMenu);
        this.hoverMenu.addEventListener('mouseleave', this.closeHoverMenu);

    }

    resizeHandler(event){
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
                    if (this.articulationCellArray) { 
                        const tempArtCells = this.articulationCellArray.splice(0, tempWidth);
                        this.articulationCellArray.forEach((cell) => { cell.remove(); });
                        this.staveArticulationContainer.style.gridTemplateColumns = `repeat(${tempWidth}, 1.04em)`;
                        this.articulationCellArray = tempArtCells;
                    };
                };
            } else if (tempWidth > this.gridWidth){
                for (let row = 0; row < tempCellArray.length; row++){
                    const size = tempWidth - this.gridWidth;
                    const diffArray = Array.from({ length: size }, () => ({ textContent: '-' }));
                    tempCellArray[row].push(...diffArray);
                };
                if (this.articulationCellArray) { 
                    for (let i = this.gridWidth; i < tempWidth; i++){
                        this.createArtCell(i);
                        this.staveArticulationContainer.style.gridTemplateColumns = `repeat(${tempWidth}, 1.04em)`;
                    }
                };
            }

            tempCellArray = tempCellArray.flat()

            this.gridWidth = tempWidth;
            this.cellArray.length = 0;
            this.staveBoxGrid.replaceChildren();
            this.drawGrid(this.staveBoxGrid, tempCellArray);
        }
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
            textBuffer += '|\n';
        }
        if (this.articulationCellArray){
            textBuffer += ' '.repeat(2);
            this.articulationCellArray.forEach((cell) => { textBuffer += cell.textContent; })
            textBuffer += ' \n';
        }
        return textBuffer;
    }

    remove(){
        const index = Workspace.ChildObjects.indexOf(this);
        Workspace.ChildObjects.splice(index, 1);
        this.staveContainer.remove();
        this.hoverHelper.remove();
        this.hoverMenu.remove();
    }

    duplicate(){
        const index = Workspace.ChildObjects.indexOf(this);
        
        const cloneStavebox = new StaveBox(this.gridWidth, this.localTuning);

        //we have to pass in the new cell array as dummy objects so that the new cells methods are initialised properly
        const dummyArray = this.cellArray.map(element => ({
            textContent: element.textContent
        }));
        cloneStavebox.cellArray.length = 0;

        //force the cloned stavebox to redraw the grid with the dummy cell array
        cloneStavebox.staveBoxGrid.replaceChildren();
        cloneStavebox.drawGrid(cloneStavebox.staveBoxGrid, dummyArray);

        if (this.articulationCellArray){
            const newartCells = this.articulationCellArray.map(div => div.textContent)
            let event = new CustomEvent('click', { detail: newartCells.join('') });
            cloneStavebox.hoverMenu.dispatchEvent(event);
        }

        this.staveContainer.insertAdjacentElement('afterend', cloneStavebox.staveContainer);
        Workspace.ChildObjects.splice(index + 1, 0, cloneStavebox);
    }

    getRootContainer(){
        return this.staveContainer;
    }

    getObjectNameAsString(){
        return 'StaveBox'
    }

    decPositionInWorkspace(){
        const index = Workspace.ChildObjects.indexOf(this);
        Workspace.ChildObjects.splice(index, 1);
        Workspace.ChildObjects.splice(index - 1, 0, this);
    }

    incPositionInWorkspace(){
        const index = Workspace.ChildObjects.indexOf(this);
        Workspace.ChildObjects.splice(index, 1);
        Workspace.ChildObjects.splice(index + 1, 0, this);
    }

}

