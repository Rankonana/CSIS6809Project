import * as vscode from 'vscode';
import * as say from 'say';
import * as path from 'path';
import { Item } from './Item';


export const settings = (message : string) => {

	vscode.window.showInformationMessage(message);	

};

export function showMainMenuItems(itemsToDisplay: Item[], placeholder: string)  {
	const quickPick = vscode.window.createQuickPick<Item>();
	quickPick.items = itemsToDisplay;
	quickPick.ignoreFocusOut = false;
	quickPick.matchOnDescription = false;
	quickPick.canSelectMany = false;
	quickPick.matchOnDetail = false;
	quickPick.placeholder = placeholder;

	quickPick.onDidHide(() => quickPick.dispose());
	quickPick.show();

	quickPick.onDidChangeActive( (selection: any) => {
	
		if(selection[0].label ==='Pitch')
		{
			vscode.commands.executeCommand('csis-project.AdjustPitch');
		}
		if(selection[0].label ==='Voice')
		{
			vscode.commands.executeCommand('csis-project.ChangeVoice');
		}
		if(selection[0].label ==='Playback rate')
		{
			vscode.commands.executeCommand('csis-project.ChangePlayBackRate');
		}
		if(selection[0].label ==='Volume')
		{
			vscode.commands.executeCommand('csis-project.AdjustVolume');
		}
		if(selection[0].label ==='Braille keyboard')
		{
			vscode.commands.executeCommand('csis-project.BrailleKeyboardSettings');
		}

	});
}

export const getSettingsWebviewContent = (webview: vscode.Webview,scriptUri :vscode.Uri, stylesMainUri :vscode.Uri ) => {
	const nonce = getNonce();
	return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link href="${stylesMainUri}" rel="stylesheet">
		<title>My Settings</title>
		
	</head>
	<body onload="init()">
	<h1>Settings</h1>
		<label for="pitch">Pitch (between 1 and 5):</label>
		<input type="number" id="pitch" name="pitch" min="1" max="5"> <br>

		<label for="voice">Voice (between 1 and 5):</label>
			<select name="voice" id="voice">
				<option value="Aniket">Aniket</option>
				<option value="sachin">sachin</option>
			</select><br>

		<label for="playbackrate">Play back Rate (between 1 and 5):</label>
		<input type="number" id="playbackrate" name="playbackrate" min="1" max="5"> <br>

		<label for="volume">Volume (between 1 and 5):</label>
		<input type="number" id="volume" name="volume" min="1" max="5"> <br>


		<script  src="${scriptUri}"></script>
		</body>
	</html>`;
};

export const getNonce = () =>{
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};


