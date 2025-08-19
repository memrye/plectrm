class RibbonSectionTextBox{
    constructor(_ribbon) {
        const textBoxSection = document.createElement('div');
        textBoxSection.classList.add('ribbonSection');

        const textBoxButton = document.createElement('button');
        textBoxButton.classList.add('ribbonButton', 'textBoxButton');
        textBoxButton.textContent = '+';
        textBoxButton.onclick = function(){new TextBox()};
        textBoxSection.appendChild(textBoxButton);

        const textBoxLabel = document.createElement('label');
        textBoxLabel.textContent = 'Add Textbox';
        textBoxSection.appendChild(textBoxLabel);

        _ribbon.appendChild(textBoxSection);
    }
}

class RibbonSectionStaveBox{
    constructor(_ribbon) {
        const staveBoxSection = document.createElement('div');
        staveBoxSection.classList.add('ribbonSection');

        const staveBoxContents = document.createElement('div');
        staveBoxContents.classList.add('staveBoxContents');
        staveBoxSection.appendChild(staveBoxContents);

        const staveBoxLabel = document.createElement('label');
        staveBoxLabel.textContent = 'Add Stave';
        staveBoxSection.appendChild(staveBoxLabel);

        const staveBoxButton = document.createElement('button');
        staveBoxButton.classList.add('ribbonButton', 'staveBoxButton');
        staveBoxButton.textContent = '+'
        staveBoxButton.onclick = function(){
            const size = staveBoxSizeInput.value;
            const tuning = staveBoxTuningInput.value;
            new StaveBox(size, tuning);
        };
        staveBoxContents.appendChild(staveBoxButton);

        const staveBoxOptions = document.createElement('div');
        staveBoxOptions.classList.add('staveBoxOptions');
        staveBoxContents.appendChild(staveBoxOptions);

        const staveBoxSizeInputLabel = document.createElement('label');
        staveBoxSizeInputLabel.textContent = 'Size';
        staveBoxOptions.appendChild(staveBoxSizeInputLabel);

        const staveBoxSizeInput = document.createElement('input');
        staveBoxSizeInput.type = 'number';
        staveBoxSizeInput.min = 12;
        staveBoxSizeInput.max = 60;
        staveBoxSizeInput.value = 16;
        
        staveBoxOptions.appendChild(staveBoxSizeInput);

        const staveBoxTuningInputLabel = document.createElement('label');
        staveBoxTuningInputLabel.textContent = 'Tuning';
        staveBoxOptions.appendChild(staveBoxTuningInputLabel);

        const staveBoxTuningInput = document.createElement('input');
        staveBoxTuningInput.value = 'EADGBe'
        staveBoxOptions.appendChild(staveBoxTuningInput);

        
        _ribbon.appendChild(staveBoxSection);

    }
}