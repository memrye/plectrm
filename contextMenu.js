class ContextMenu {
    constructor(parentContainer, workspaceContext) {
        const contextMenu = document.createElement('div');
        contextMenu.classList.add('contextMenu');
        const dragButton = document.createElement('div');
        dragButton.classList.add('dragHandle');
        dragButton.textContent = '=';
        contextMenu.appendChild(dragButton);
        let elementCenterY;
        let previousElement = parentContainer.previousElementSibling;
        let previousElementRect;
        let nextElement = parentContainer.nextElementSibling;
        let nextElementRect;
        let yOffset = 0;
        

        const elementDragging = (event) => {
            const mouseY = event.clientY;
            let distanceY = mouseY - elementCenterY;
            parentContainer.style.transform = `translateY(${distanceY + yOffset}px) scale(101%)`

            //dragging up
            if (previousElement){
                if (mouseY < (previousElementRect.top + (previousElementRect.height / 2))){
                    yOffset += previousElementRect.height + parseInt(window.getComputedStyle(parentContainer).paddingBottom);
                    parentContainer.style.transform = `translateY(${distanceY + yOffset}px) scale(101%)`;

                    workspaceContext.insertBefore(parentContainer, previousElement);
                    

                    //because inserting copies the object, css logic for displaying :active doesnt work
                    //so here I force it with a class and remove the class on mouseup
                    dragButton.classList.add('forceActive');

                    previousElement = parentContainer.previousElementSibling;
                    nextElement = parentContainer.nextElementSibling;
                    if (previousElement){previousElementRect = previousElement.getBoundingClientRect()};
                    if (nextElement){nextElementRect = nextElement.getBoundingClientRect()};
                }
            }

            //dragging down
            if (nextElement){
                if (mouseY > (nextElementRect.bottom - (nextElementRect.height/2))){
                    yOffset -= nextElementRect.height + parseInt(window.getComputedStyle(parentContainer).paddingBottom);
                    parentContainer.style.transform = `translateY(${distanceY + yOffset}px) scale(101%)`

                    nextElement.insertAdjacentElement('afterend', parentContainer);
                    dragButton.classList.add('forceActive');

                    previousElement = parentContainer.previousElementSibling;
                    nextElement = parentContainer.nextElementSibling;
                    if (previousElement){previousElementRect = previousElement.getBoundingClientRect()};
                    if (nextElement){nextElementRect = nextElement.getBoundingClientRect()};
                }
            }

        }

        dragButton.addEventListener('mousedown', (event) => {
            if (event.button == 2){
                //open expanded context menu on right click

            } else {
                //drag element
                dragButton.style.cursor = 'grabbing';
                const elementRect = dragButton.getBoundingClientRect();
                elementCenterY = elementRect.top + (elementRect.height / 2);
                parentContainer.classList.add('dragged');
                parentContainer.style.transform = `scale(101%)`
    
                previousElement = parentContainer.previousElementSibling;
                nextElement = parentContainer.nextElementSibling;
                if (previousElement){previousElementRect = previousElement.getBoundingClientRect()};
                if (nextElement){nextElementRect = nextElement.getBoundingClientRect()};
    
    
                document.addEventListener('mousemove', elementDragging);
    
                document.addEventListener('mouseup', (event) => {
                    if (dragButton.classList.contains('forceActive')){
                        dragButton.classList.remove('forceActive')
                    }
                    dragButton.style.cursor = 'pointer';
                    parentContainer.style.transform = `translateY(0px) scale(100%)`;
                    yOffset = 0;
                    parentContainer.classList.remove('dragged');
                    document.removeEventListener('mousemove', elementDragging);
                })

            }
        })

        return contextMenu;
    }
}