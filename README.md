# CSIS PROJECT README

# Requirements
1.	Node.js (LTS version) available at:
https://nodejs.org/en/download/
2.	VSCode available at: 
https://code.visualstudio.com/download
3.	Project Source code available at: 
https://codeload.github.com/Rankonana/CSIS6809Project

# Usage
### Usage Instructions
1.	With VSCode open CSIS6809Project-main. 
2.	With the Node.js command prompt, change the directory to be ‘CSIS6809Project-main’ and execute the following commands:
-	```npm install```
-	```npm install -g yo ```
-	```npm install -g yo generator-code ```
3.	Press F5 to run the project, another VSCode window titled “Extension Development Host” with the Extension installed will appear.
4.	On the new window of VSCode, open a source code file.
5.	Press Ctrl+Shift+P to open command palette.

### Available commands
##### Filter my available commands by typing “csis:”: 
- a)	csis: Speak Document
- b)	csis: Speak Selection
- c)	csis: Stop Speaking

# Folder Structure
- CSIS6809Project-main\package.json
    - Contains basic information about the Extension, the commands that are available.
- CSIS6809Project-main\media
    - Contains the JavaScript  and Cascading Style Sheets to be used by the html inside the extensions
- CSIS6809Project-main\src\extension.ts
    - Is the main file for the
