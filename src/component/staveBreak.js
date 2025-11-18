import { Workspace, getDom } from "@/lib/workspace.js";
export class StaveBreak {
    constructor(parentObject, index = 3){
        this.staveBreak = document.createElement('div');
        this.staveBreak.classList.add('staveBreak');
        this.staveBreak.textContent = '|\r'.repeat(parentObject.localTuning.length);

        this.resizeHandler = (event) => {
            const mouseX = Math.min(event.clientX, parseInt(getDom().getBoundingClientRect().right - (Workspace.getEmRect().width * 2)));
            const gridRect = this.staveBoxGrid.getBoundingClientRect();
            const cellWidth = gridRect.width / this.gridWidth;
            const tempWidth = Math.max(parseInt((mouseX - gridRect.left) / cellWidth), 1);
            document.body.style.cursor = 'col-resize';
    
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

        this.staveBreak.addEventListener('mousedown', (event) => {
            document.addEventListener('mouseup', () => {
                document.body.style.cursor = 'auto';
                this.staveBreak.classList.remove('focus');
                document.removeEventListener('mousemove', this.resizeHandler)
            })

            document.addEventListener('mousemove', this.resizeHandler)
            this.staveBreak.focus();
            this.staveBreak.classList.add('focus');


        });

        parentObject.staveGridContainer.innerHTML = '';
        parentObject.staveBoxGrid = document.createElement('div');
        parentObject.staveBoxGrid.classList.add('staveGrid');
        parentObject.staveGrids.push(parentObject.staveGridContainer.appendChild(parentObject.staveBoxGrid));
        parentObject.staveGridContainer.appendChild(this.staveBreak);
        parentObject.staveBoxGrid = document.createElement('div');
        parentObject.staveBoxGrid.classList.add('staveGrid');
        parentObject.staveGrids.push(parentObject.staveGridContainer.appendChild(parentObject.staveBoxGrid));
        parentObject.drawGrid(parentObject.staveGrids, parentObject.cellArray, index);
    }
}