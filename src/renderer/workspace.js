let workspaceElement = null;
export const Workspace = {
    ChildObjects : [],
};

export function initWorkspace(_workspaceDOM) {
    workspaceElement = _workspaceDOM;
}

export function getDom(){
    return workspaceElement ? workspaceElement : null
}