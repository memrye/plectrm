export async function requestImportFile () {
    const response = await window.electronAPI.importFile();
    if (!response) { return console.log('Request to import file cancelled'); }
    let buf = String(response).split('\n');
    let initProject = [];
    let staveOptions = new StaveOptions();
    buf.push("eof");

    for (let i = 0; i < buf.length; i++){
        const line = buf.at(i).trim();

        if (line === "eof"){
            if (staveOptions.open){
                initProject.push({el: 'stavebox', contents: staveOptions.getContents()})
                staveOptions.reset();
            }
        } else {

            if (/^(?=.*-)(?=.*\|)(?=.*[A-Za-z0-9]).+$/.test(line)){
                // create stavebox
                staveOptions.open = true;

                // assuming first vertical bar is next to tuning
                const idx = line.indexOf('|');
                let tng = line.slice(0, idx).trim().replace(/[^a-z#]/gi, '');
                if (tng.length){
                    staveOptions.tuning.unshift(tng);
                };

                // assuming second vertical bar is end of stave
                const idx_2 = line.indexOf('|', idx + 1);
                let stave = line.slice(idx + 1, idx_2);
                if (stave.length){
                    const newline = stave.split("");

                    // handle if current line is longer than previous
                    if (newline.length > staveOptions.gridLength && Number.isFinite(staveOptions.gridLength)){

                        // add blank cells so all lines are the same length
                        staveOptions.cellArray.forEach((arr) => {
                            const dif = Array<String>(newline.length - arr.length, '-');
                            arr.concat(dif);
                        });
                    }
                    staveOptions.gridLength = newline.length;
                    
                    staveOptions.cellArray.push(stave.split(""));
                }

            } else {
                if (staveOptions.open){
                    initProject.push({el: 'stavebox', contents: staveOptions.getContents()})
                    staveOptions.reset();
                }

                if (line !== ""){
                    initProject.push({el: 'textbox', contents: line});
                }
            }
        }
    }

    if (initProject.length){
        return initProject;
    } else {
        console.error('error parsing file contents: found nothing to import')
    }

}

function StaveOptions(){
    this.reset = () => {
        this.open = false;
        this.tuning = [];
        this.gridLength = null;
        this.cellArray = [];
    }

    this.getContents = () => {
        const dummyArray = this.cellArray.flat().map(element => ({
            textContent: element
        }));
        const r = {tuning: this.tuning.join("/"), gridLength: this.gridLength, cellArray: dummyArray};
        return r;
    }
    this.reset();
}