import * as vscode from 'vscode';
import * as say from 'say';

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

      // And set its HTML content
      panel.webview.html = getTerminalWebviewContent();

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

context.subscriptions.push(vscode.commands.registerCommand('helloworld.stopSpeaking', () => {
	stopSpeaking();
}));
}

function getTerminalWebviewContent() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Terminal</title>
	<style>
      button {
        display: inline-block;
        background-color: #7b38d8;
        border-radius: 10px;
        border: 4px double #cccccc;
        color: #eeeeee;
        text-align: center;
        font-size: 15px;
        padding: 1px;
        width: 200px;
        cursor: pointer;
        margin: 5px;       
      }
textarea {
  width: 50%;
  height: 150px;
  padding: 12px 20px;
  box-sizing: border-box;
  border: 2px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  font-size: 16px;
  resize: none;
}
    </style>
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



<script>
	const vscode = acquireVsCodeApi();

	function init()
	{
		document.getElementById("txtArea").focus();
		console.log('inside init');
	}
		
	function enterpressalert(e, textarea) {
		var code = (e.keyCode ? e.keyCode : e.which);
		if (code == 13) 
		{ 
			vscode.postMessage({
				command: 'alert',
				text: document.getElementById('txtArea').value
			  });
			console.log(document.getElementById('txtArea').value + 'code is : ' + code);
		}
		else 
		{
			vscode.postMessage({
				command: 'alert',
				text: String.fromCharCode(code)
			  });
			console.log(String.fromCharCode(code) + 'code is: ' + code );
			
		}
	}
</script>

	</body>
</html>`;
}

