const workspaceContext = document.getElementsByClassName('workspaceContainer').item(0);
const ribbon = document.getElementsByClassName('ribbonContainer').item(0);
const exportButton = document.getElementsByClassName('exportButton').item(0);

workspaceContext.ChildObjects = [];

new RibbonSectionTextBox(ribbon, workspaceContext);
new RibbonSectionStaveBox(ribbon, workspaceContext);

workspaceContext.ChildObjects.push(new TextBox())
workspaceContext.ChildObjects.push(new StaveBox(24, 'EADGBe'))

exportButton.onclick = () => {
    let textBuffer = ``
    workspaceContext.ChildObjects.forEach(element => {
        textBuffer += element.parseStringContents();
        textBuffer += `\n`;
    });
    console.log(textBuffer);
}

