import { Workspace } from "./workspace";
import { TextBox } from "./textBox";
import { StaveBox } from "./staveBox";

export function AddTextBoxButton (_ribbon){ 
    const textBoxButton = document.createElement('button');
    textBoxButton.classList.add('ribbonButton');
    textBoxButton.innerHTML = window.electronAPI.getIcon('addText');
    textBoxButton.onclick = function(){
        Workspace.ChildObjects.push(new TextBox())
    };
    _ribbon.appendChild(textBoxButton);
}

export function AddStaveBoxButton(_ribbon){
    const staveBoxButton = document.createElement('button');
    staveBoxButton.classList.add('ribbonButton');
    staveBoxButton.innerHTML = window.electronAPI.getIcon('addStave');
    staveBoxButton.Options = {size: 24, tuning: 'EADGBe'}
    staveBoxButton.onclick = function(){
        Workspace.ChildObjects.push(new StaveBox(staveBoxButton.Options.size, staveBoxButton.Options.tuning))
    };
    _ribbon.appendChild(staveBoxButton);

}