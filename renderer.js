const workspaceContext = document.getElementsByClassName('workspaceContainer').item(0);
const ribbon = document.getElementsByClassName('ribbonContainer').item(0);

const textBoxButton = document.createElement('button');
textBoxButton.classList.add('ribbonButton', 'textBox');
textBoxButton.textContent = '+';
textBoxButton.onclick = function(){new TextBox()};
ribbon.appendChild(textBoxButton);

new StaveBox(24, 'EADGBe')
new TextBox()
new StaveBox(16, 'EADGBe')

