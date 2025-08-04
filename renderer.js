const func = async () => {
  const response = await window.versions.ping()
  console.log(response) // prints out 'pong'
}

const workspaceContext = document.getElementsByClassName('workspaceContainer').item(0);
//TODO: make sure context is away of content for deleting/moving elements and for text export.

new StaveBox(24, 'DADGBe');

new TextBox();

func()