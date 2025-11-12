import { Workspace } from "@/lib/workspace.js";
import { TextBox } from "@/component/textBox.js";
import { StaveBox } from "@/component/staveBox.js";
import { TransientInput } from "@/lib/transientInput.js";

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
    const staveBoxContainer = document.createElement('div');
    staveBoxContainer.classList.add('ribbonSplitDropdown');

    const staveBoxButton = document.createElement('button');
    staveBoxButton.classList.add('ribbonSplitDropdownButton');
    staveBoxButton.innerHTML = window.electronAPI.getIcon('addStave');
    staveBoxButton.Options = {size: 24, tuning: 'EADGBe'}
    staveBoxButton.onclick = function(){
        Workspace.ChildObjects.push(new StaveBox(staveBoxButton.Options.size, staveBoxButton.Options.tuning))
    };

    const staveBoxDropdown = document.createElement('button');
    staveBoxDropdown.classList.add('ribbonSplitDropdownDropdown');
    staveBoxDropdown.innerHTML = window.electronAPI.getIcon('collapse');
    staveBoxDropdown.onclick = function(){
        const staveBoxOptionsMenu = new TransientInput();
        const buttonRect = staveBoxDropdown.getBoundingClientRect();
        const cornerPosition = {x: buttonRect.left, y: buttonRect.top};
        staveBoxOptionsMenu.setPosition(null, cornerPosition);
        staveBoxOptionsMenu.createAndAddLabel('change stavebox settings');
        staveBoxOptionsMenu.createAndAddDivisor();
        staveBoxOptionsMenu.createAndAddLabel('tuning');
        staveBoxOptionsMenu.createAndAddTextInput(staveBoxButton.Options.tuning, (contents) => {
            staveBoxButton.Options.tuning = contents;
        })
        staveBoxOptionsMenu.createAndAddLabel('size');
        staveBoxOptionsMenu.createAndAddTextInput(staveBoxButton.Options.size, (contents) => {
                staveBoxButton.Options.size = contents
        }, /^(?:[0-9]|[1-9][0-8])$/)
        staveBoxOptionsMenu.endTransientInput();
        
    }
    
    staveBoxContainer.appendChild(staveBoxButton);
    staveBoxContainer.appendChild(staveBoxDropdown);
    _ribbon.appendChild(staveBoxContainer);

}