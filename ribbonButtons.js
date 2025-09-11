class RibbonSectionTextBox{
    constructor(_ribbon, workspaceContext) {
        const textBoxButton = document.createElement('button');
        textBoxButton.classList.add('ribbonButton');
        textBoxButton.innerHTML = window.electronAPI.getIcon('addText');
        textBoxButton.onclick = function(){
            workspaceContext.ChildObjects.push(new TextBox())
        };
        _ribbon.appendChild(textBoxButton);
    }
}

class RibbonSectionStaveBox{
    constructor(_ribbon, workspaceContext) {
        const staveBoxButton = document.createElement('button');
        staveBoxButton.classList.add('ribbonButton');
        staveBoxButton.innerHTML = window.electronAPI.getIcon('addStave');
        staveBoxButton.Options = {size: 24, tuning: 'EADGBe'}
        staveBoxButton.onclick = function(){
            workspaceContext.ChildObjects.push(new StaveBox(staveBoxButton.Options.size, staveBoxButton.Options.tuning))
        };
        _ribbon.appendChild(staveBoxButton);

    }
}