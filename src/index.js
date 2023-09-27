// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { app, BrowserWindow } = require('electron');
const helloWorld = require('./commands/helloWorld');
const generateWINDOW = require('./commands/generateWINDOW');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	const commands = [
		vscode.commands.registerCommand('my-first-window.helloWorld', helloWorld),
		vscode.commands.registerCommand('my-first-window.generateWINDOW', generateWINDOW),

	];

	context.subscriptions.push(commands);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
