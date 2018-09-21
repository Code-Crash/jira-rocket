'use strict';
import * as vscode from 'vscode';
import Logger from "./logger";
import { SelfCommands, STRINGS } from "./constants";
import ConfigHelper from "./config";

/**
 * @description - This method is called when your extension is activated
 *              - your extension is activated the very first time the command is executed
 */
export function activate(context: vscode.ExtensionContext) {
    Logger.log("Activating Jira Rocket!");

    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "jira-rocket" is now active!');

    /**
     * TODO: Remove this after some features
     * TEST
     */
    const disposable = () => {
        vscode.window.showInformationMessage('Hello World!');
    };

    // TODO
    // const authenticate = (args?: any) => {
    //     // return openUrl(SLACK_OAUTH);
    //     console.log('Authenticate Call');
    // }

    // TODO
    // const setup = async (canPromptForAuth?: boolean): Promise<any> => {
    //     if (canPromptForAuth) {
    //         ConfigHelper.askForAuth();
    //     }
    // };

    // TODO
    const reset = async () => {
        // await setup(true);
        // Initialize the JIRA Tasks and Everything after authentication 
    };

    /**
     * @description - This will clear the store credentials
     */
    const signOut = async () => {
        await ConfigHelper.clearToken();
        vscode.window.showInformationMessage(STRINGS.SIGN_OUT_SUCCESS);
    };

    /**
     * @description - Handle authentication here.
     */
    const configureToken = () => {
        vscode.window.showInputBox({
            placeHolder: STRINGS.EMAIL_HOLDER,
            password: false,
            ignoreFocusOut: true
        }).then(email => {
            if (email) {
                vscode.window.showInputBox({
                    placeHolder: STRINGS.TOKEN_HOLDER,
                    password: true,
                    ignoreFocusOut: true
                }).then(token => {
                    if (token) {
                        vscode.window.showInputBox({
                            placeHolder: STRINGS.URL_HOLDER,
                            password: false,
                            ignoreFocusOut: true
                        }).then(url => {
                            if (!!url) {
                                token = Buffer.from(email + ":" + token).toString('base64');
                                return ConfigHelper.setToken(token, url);
                            } else {
                                vscode.window.showInformationMessage(`Please Enter Valid Email/Password and URL and try again!`);
                            }
                        });
                    } else {
                        vscode.window.showInformationMessage(`Please Enter Valid Email and Password and try again!`);
                    }
                });
            } else {
                vscode.window.showInformationMessage(`Please Enter Valid Email and try again!`);
            }
        });
    };

    /**
     * TODO: We will remove this after some features. (Mainly Password Field)
     * @description - This function will show you the basic info of logged in user.
     */
    let showStoredInfo = async () => {
        let cred: { token: string, url: string } = await ConfigHelper.getToken();
        let info: string = Buffer.from(cred.token, 'base64').toString('ascii');
        let user = {
            email: (info.split(':')[0] || ''),
            password: (info.split(':')[1] || ''),
            url: (cred.url || '')
        };
        if (!user.email && !user.password && !user.url) {
            vscode.window.showInformationMessage(`You are not logged into you Jira account, Please Login and try again!`);
            ConfigHelper.askForAuth();
        } else {
            vscode.window.showInformationMessage(`You Email:${user.email}, Password is:${user.password} and URL is: ${user.url}`);
        }
    };

    /**
     * @description - Register your commands here.
     */
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.sayHello', disposable),
        vscode.commands.registerCommand('extension.showInfo', showStoredInfo),
        vscode.commands.registerCommand(SelfCommands.RESET_STORE, reset),
        vscode.commands.registerCommand(SelfCommands.SIGN_OUT, signOut),
        vscode.commands.registerCommand(
            SelfCommands.SIGN_IN,
            configureToken
        ),
    );

}

/**
 * this method is called when your extension is deactivated
 */
export function deactivate() { }