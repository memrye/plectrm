const func = async () => {
  const response = await window.versions.ping()
  console.log(response) // prints out 'pong'
}

const workspaceContext = document.getElementsByClassName('workspaceContainer').item(0);

new StaveBox(24, 'EADGBe')
new TextBox()
new StaveBox(12, 'EADGBe')

func()