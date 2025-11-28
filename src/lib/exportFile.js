export async function exportFile (contentToWrite, defaultFilename = 'untitled.txt') {
    console.log(contentToWrite);
    const success = await window.electronAPI.saveTextAsFile(contentToWrite, defaultFilename);
    return success;
}