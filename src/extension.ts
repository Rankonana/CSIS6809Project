import * as vscode from 'vscode';
import * as say from 'say';
import * as path from 'path';
import { Item } from './Item';
import { settings, getSettingsWebviewContent,showMainMenuItems } from "./settingsMainMenu";

//#region Constants
const getVoice = (): string | undefined =>
    vscode.workspace.getConfiguration('speech').get<string>('voice');

const getSpeed = (): number | undefined =>
    vscode.workspace.getConfiguration('speech').get<number>('speed');
    

const getSubstitutions = (): { [key: string]: string } => 
    vscode.workspace.getConfiguration('speech').get<{ [key: string]: string }>('substitutions') || {};


const stopSpeaking = () => {
    say.stop();
};

const cleanText = (text: string): string => {
    text = text.trim();
    for (let [pattern, replacement] of Object.entries(getSubstitutions())) {
        text = text.replace(pattern, replacement);
    }
    return text;
};

const speakText = (text: string) => {
    text = cleanText(text);
    if (text.length > 0) {
        say.speak(text, getVoice(), getSpeed());
    }
};

const speakCurrentSelection = (editor: vscode.TextEditor) => {
    const selection = editor.selection;
	
    if (!selection)
    {
        return;
    }
        
	let start: any = editor.selections.map(s=>s.active.line);
	let end = editor.selections.map(s=>s.end.line);
	
	//vscode.window.showInformationMessage("selected line range is "  +a + " and end at line" + b );
    speakText( "selected line range is" + start +" and "  +end+ editor.document.getText(selection));
};

const speakDocument = (editor: vscode.TextEditor) => {
    speakText(editor.document.getText());
};

//#endregion Constants


export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('csis-project.OpenTerminal', () => {
      // Create and show panel
      const panel = vscode.window.createWebviewPanel(
        'csis-project',
        'CSIS6809 Project',
		vscode.ViewColumn.One,
        {
          // Enable scripts in the webview
          enableScripts: true
        }
      );
		
		const onDiskPath = vscode.Uri.file(
			path.join(context.extensionPath, 'media', 'main.js')
		);
		const scriptUri = panel.webview.asWebviewUri(onDiskPath);

		const onDiskPath1 = vscode.Uri.file(
			path.join(context.extensionPath, 'media', 'vscode.css')
		);
		const stylesMainUri = panel.webview.asWebviewUri(onDiskPath1);


      // And set its HTML content
      panel.webview.html = getTerminalWebviewContent(panel.webview,scriptUri,stylesMainUri);

	  panel.webview.onDidReceiveMessage(
		message => {
			switch (message.command) {
				case 'alert':
					vscode.window.showErrorMessage(message.text);
					if(message.text ===1)
					{
						//Speak the charater
						speakText(message.text);
						vscode.window.showInformationMessage(message.text);
						
					}
					else
					{
						//Speak the command and execute
						speakText(message.text);
						vscode.window.showInformationMessage(message.text);						 
							
					}
					
					return;
			}
		},
		undefined,
		context.subscriptions
	);

    })
  );
  context.subscriptions.push(vscode.commands.registerTextEditorCommand('csis-project.OpenSettings', (editor) => {
	const items = [];
	items.push(new Item("Pitch"," Change pitch"));
	items.push(new Item("Voice","Change voice"));
	items.push(new Item("Playback rate","Change Playback rate"));
	items.push(new Item("Volume","Increase or decrease volume"));
	items.push(new Item("Braille keyboard","Setting for Braille keyboard"));

	showMainMenuItems(items,"placeholder");
}));

context.subscriptions.push(vscode.commands.registerCommand('csis-project.AdjustPitch', () => {
	settings('Adjust Pitch Settings');
	
}));

context.subscriptions.push(vscode.commands.registerCommand('csis-project.ChangeVoice', () => {

	settings('Change Voice Settings');
	
}));

context.subscriptions.push(vscode.commands.registerCommand('csis-project.ChangePlayBackRate', () => {

	settings('Change PlayBackRate Settings');
	
}));

context.subscriptions.push(vscode.commands.registerCommand('csis-project.AdjustVolume', () => {

	settings('Adjust Volume Settings');
	
}));

context.subscriptions.push(vscode.commands.registerCommand('csis-project.BrailleKeyboardSettings', () => {

	settings('Braille Keyboard Settings Settings');
	
}));





  context.subscriptions.push(vscode.commands.registerTextEditorCommand('csis-project.speakDocument', (editor) => {
	stopSpeaking();
	if (!editor)
	{
		return;
	}
	speakDocument(editor);
}));

context.subscriptions.push(vscode.commands.registerTextEditorCommand('csis-project.speakSelection', (editor) => {
	stopSpeaking();
	if (!editor)
	{
		return;
	}
	speakCurrentSelection(editor);
}));

context.subscriptions.push(vscode.commands.registerCommand('csis-project.stopSpeaking', () => {
	stopSpeaking();
}));




}



	

function getTerminalWebviewContent(webview: vscode.Webview,scriptUri :vscode.Uri, stylesMainUri :vscode.Uri ) {
const nonce = getNonce();
return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link href="${stylesMainUri}" rel="stylesheet">
    <title>My Terminal</title>
	
</head>
<body onload="init()">
<h1>My Terminal</h1>
	<textarea id="txtArea" rows="4" cols="50" placeholder="Enter command here" onKeyPress="enterpressalert(event, this)" ></textarea><br>
	<button>Open New Terminal Window</button><br>
	<button>Close Terminal</button><br>
	<button>Change Terminal</button><br>
	<button>Read Terminal Paragraph</button><br>
	<button>Read Terminal Entire Output</button><br>
	<button>Search Terminal Results</button><br>
	
	<script  src="${scriptUri}"></script>
	</body>
</html>`;
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}


