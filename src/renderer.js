import { Workspace } from '@/lib/workspace';
import { Foreground } from '@/lib/foreground';
import { initStartscreen } from '@/component/startscreen';

document.addEventListener('DOMContentLoaded', () => {

const foreground = new Foreground(document.getElementsByClassName('foreground').item(0));
const workspace = new Workspace(document.getElementsByClassName('workspaceContainer').item(0));

initStartscreen(foreground, workspace);

});

