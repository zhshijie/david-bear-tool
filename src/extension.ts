// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { createContainerDisposable } from './section/createContainer/index';

export class DavidBearError extends Error {

  static ContainerNameIsError(messageOrUri?: string): DavidBearError {
    let error = new DavidBearError(messageOrUri);
    return error;
  }

  constructor(message?: string) {
    super(message);
    this.stack = message;
  }
}



// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "DavidBear" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
 
  // 大卫熊绘本创建 Container 指令
  context.subscriptions.push(createContainerDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
