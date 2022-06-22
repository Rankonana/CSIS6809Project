    // @ts-ignore
    const vscode = acquireVsCodeApi();

	function init()
	{
		document.getElementById("txtArea").focus();
		console.log('inside init');
	}		

	
	function enterpressalert(e, textarea) 
	{
		var code = (e.keyCode ? e.keyCode : e.which);
		if (code === 13) 
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