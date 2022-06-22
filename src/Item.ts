import * as vscode from 'vscode';

export class Item implements vscode.QuickPickItem {

    public label: string;
    public description: string;

    
    constructor(label: string, description: string) {
        this.label =   label;
        this.description = description;
    }
}