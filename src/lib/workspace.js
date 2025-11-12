let workspaceElement = null;
let emRect = null;
export const Workspace = {
    ChildObjects : [],
    getEmRect: () => {
        if (!workspaceElement) return false;
        if (emRect) return emRect;
        const em = document.createElement('div');
        em.style.cssText = 'width:1em; height:1em; padding:0; margin:0;';
        workspaceElement.appendChild(em);
        emRect = em.getBoundingClientRect();
        em.remove();
        return emRect;
    }
};

export function initWorkspace(_workspaceDOM) {
    workspaceElement = _workspaceDOM;
}

export function getDom(){
    return workspaceElement ? workspaceElement : null
}