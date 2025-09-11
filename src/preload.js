const { contextBridge, ipcRenderer } = require('electron')

const icons = {
  trash: `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="3 6 5 6 21 6"></polyline>
  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
</svg>
  `.trim(),
  dragHandle: `
<svg fill="currentColor" width="24" height="24"viewBox="0 0 36 36" version="1.1"  preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <circle cx="15" cy="12" r="1.5" class="clr-i-outline clr-i-outline-path-1"></circle><circle cx="15" cy="24" r="1.5" class="clr-i-outline clr-i-outline-path-2"></circle><circle cx="21" cy="12" r="1.5" class="clr-i-outline clr-i-outline-path-3"></circle><circle cx="21" cy="24" r="1.5" class="clr-i-outline clr-i-outline-path-4"></circle><circle cx="21" cy="18" r="1.5" class="clr-i-outline clr-i-outline-path-5"></circle><circle cx="15" cy="18" r="1.5" class="clr-i-outline clr-i-outline-path-6"></circle>
    <rect x="0" y="0" width="36" height="36" fill-opacity="0"/>
</svg>
  `.trim(),
  addText: `
<svg fill="currentColor" width="24" height="24" viewBox="0 0 36 36" version="1.1"  preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <path class="clr-i-outline clr-i-outline-path-1" d="M31,21H13a1,1,0,0,0,0,2H31a1,1,0,0,0,0-2Z"></path><path class="clr-i-outline clr-i-outline-path-2" d="M12,16a1,1,0,0,0,1,1H31a1,1,0,0,0,0-2H13A1,1,0,0,0,12,16Z"></path><path class="clr-i-outline clr-i-outline-path-3" d="M27,27H13a1,1,0,0,0,0,2H27a1,1,0,0,0,0-2Z"></path><path class="clr-i-outline clr-i-outline-path-4" d="M15.89,9a1,1,0,0,0-1-1H10V3.21a1,1,0,0,0-2,0V8H2.89a1,1,0,0,0,0,2H8v5.21a1,1,0,0,0,2,0V10h4.89A1,1,0,0,0,15.89,9Z"></path>
    <rect x="0" y="0" width="36" height="36" fill-opacity="0"/>
</svg>
  `.trim(),
  addStave: `
<svg fill="currentColor" width="24" height="24" viewBox="0 0 36 36" version="1.1"  preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <path class="clr-i-outline clr-i-outline-path-1" d="M 31,27 H 13 a 1,1 0 0 0 0,2 h 18 a 1,1 0 0 0 0,-2 z" id="path5" /><path class="clr-i-outline clr-i-outline-path-1"d="M31,21H13a1,1,0,0,0,0,2H31a1,1,0,0,0,0-2Z"id="path1" />
  <path class="clr-i-outline clr-i-outline-path-2" d="M12,16a1,1,0,0,0,1,1H31a1,1,0,0,0,0-2H13A1,1,0,0,0,12,16Z" id="path2" />
  <path class="clr-i-outline clr-i-outline-path-1" d="M 13.988848,28.003346 V 16.085874 a 1,0.66208179 0 0 0 -2,0 v 11.917472 a 1,0.66208179 0 0 0 2,0 z" id="path6" style="stroke-width:0.813685" />
  <path class="clr-i-outline clr-i-outline-path-4" d="M15.89,9a1,1,0,0,0-1-1H10V3.21a1,1,0,0,0-2,0V8H2.89a1,1,0,0,0,0,2H8v5.21a1,1,0,0,0,2,0V10h4.89A1,1,0,0,0,15.89,9Z" id="path4" />
  <path class="clr-i-outline clr-i-outline-path-1" d="M 32.000356,28.003346 V 16.085874 a 1,0.66208179 0 0 0 -2,0 v 11.917472 a 1,0.66208179 0 0 0 2,0 z" id="path7" style="stroke-width:0.813685" />
  <path class="clr-i-outline clr-i-outline-path-1" d="M 19.966398,28.003346 V 16.085874 a 1,0.66208179 0 0 0 -2,0 v 11.917472 a 1,0.66208179 0 0 0 2,0 z" id="path8" style="stroke-width:0.813685" />
  <path class="clr-i-outline clr-i-outline-path-1" d="M 25.959719,28.003346 V 16.085874 a 1,0.66208179 0 0 0 -2,0 v 11.917472 a 1,0.66208179 0 0 0 2,0 z" id="path9" style="stroke-width:0.813685" />
  <rect x="0" y="0" width="36" height="36" fill-opacity="0" id="rect4" />
</svg>
  `.trim(),
  };


contextBridge.exposeInMainWorld('electronAPI', {
  getIcon: (name) => {
    return icons[name] || null;
  },
});