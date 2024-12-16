Developing in Visual Studio Code on Windows
===========================================

Follow these instructions to develop games using the This Could Be Better
game framework in the Visual Studio Code interactive development environment
on a computer running a recent version of Microsoft Windows.

1. If necessary, run PowerShell as an administrator and execute the following
command, responding to prompts as needed:

	Set-ExecutionPolicy -ExecutionPolicy RemoteSigned

2. Start Visual Studio Code.

3. In VS Code, from the main menu, select the item "File > Open Folder...".

4. In the dialog that appears, navigate to the directory containing the game's
main .html file, select the folder that contains it, then click the
Select Folder buton.

5. Back in the main window, press Ctrl-Shift-B to bring up a selection of
possible tsconfig.json files to build.

6. From the list provided, select the item that starts with "tsc:build" and
ends with the path of the tscconfig.json in the same directory as the game's
main .html file.

7. Verify that no build errors are shown in the Terminal pane.

8. Press the F5 key.

9. From the list of options provided, select the item labelled something like
"launch.json - Web App - Chrome".

10. In the generated launch.json file, add and edit properties as given below,
substituting actual values for the development system as needed.  Note the
"--disable-web-security", which may require closing all existing browser windows
to work, and which can be dangerous if the browser is used to access malicious
sites.  Be sure to close all browser windows after the development session ends.
Note that this option may also only be necessary for certain games.

	"runtimeExecutable": "C:/[PathToChrome]/chrome.exe",
	"runtimeArgs": [ "--disable-web-security" ],
	"url": "file:///C:/[pathToGameRepo]/Source/[GameName].html",

