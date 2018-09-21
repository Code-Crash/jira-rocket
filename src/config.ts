import * as vscode from "vscode";
import { CONFIG_ROOT, SelfCommands, STRINGS } from "./constants";
import { keychain } from "./utils/keychain";
// import { hasExtensionPack } from "./utils";
import IssueReporter from "./issues";
const TOKEN_CONFIG_KEY = "jira.token";
const URL_CONFIG_KEY = 'jira.url';
const TELEMETRY_CONFIG_ROOT = "telemetry";
const TELEMETRY_CONFIG_KEY = "enableTelemetry";
const CREDENTIAL_TOKEN_SERVICE_NAME = "vscode-jira-rocket-token";
const CREDENTIAL_TOKEN_SERVICE_NAME_ACCOUNT = "token";

const JIRA_URL_SERVICE_NAME = "vscode-jira-rocket-jira";
const JIRA_URL_SERVICE_NAME_ACCOUNT = "token";



import { EventSource } from "./interfaces";
import RequestResolver from "./api/request-resolver";

class ConfigHelper {
  static getRootConfig() {
    return vscode.workspace.getConfiguration(CONFIG_ROOT);
  }

  static async getToken(): Promise<{ token: string, url: string }> {
    const token = await keychain!.findPassword(
      CREDENTIAL_TOKEN_SERVICE_NAME
    );

    const url = await keychain!.findPassword(
      JIRA_URL_SERVICE_NAME
    );

    // Let's try for the settings file (pre v0.5.8) and migrate them to the keychain.
    const rootConfig = this.getRootConfig();
    const settingsToken = rootConfig.get<string>(TOKEN_CONFIG_KEY);
    const settingsUrl = rootConfig.get<string>(URL_CONFIG_KEY);

    if (!!token && !!url) {
      return { token: token, url: url };
    } else if (!!settingsToken && !!settingsUrl) {
      ConfigHelper.setToken(settingsToken, settingsUrl);
      this.clearTokenFromSettings();
      return Promise.resolve({ token: settingsToken, url: settingsUrl });
    } else {
      return { token: '', url: '' };
    }
  }

  static clearTokenFromSettings() {
    const rootConfig = this.getRootConfig();
    rootConfig.update(
      TOKEN_CONFIG_KEY,
      undefined,
      vscode.ConfigurationTarget.Global
    );
    rootConfig.update(
      URL_CONFIG_KEY,
      undefined,
      vscode.ConfigurationTarget.Global
    );
  }

  static setToken(token: string, jira: string): Promise<void> {
    // TODO: There is no token validation. We need to add one.
    if (token) {
      let info: string = Buffer.from(token, 'base64').toString('ascii');
      let user = {
        email: (info.split(':')[0] || ''),
        password: (info.split(':')[1] || '')
      };
      jira = `https://${jira}.atlassian.net/rest/api/2/`;
      // For Search API
      return RequestResolver.do('GET', jira + 'search', {}, { jql: `assignee="${user.email}"`, maxResults: 0 }, {}, { 'Authorization': 'Basic ' + token }).then((response: any) => {
        return keychain!.setPassword(JIRA_URL_SERVICE_NAME, JIRA_URL_SERVICE_NAME_ACCOUNT, jira).then(() => {
          return keychain!.setPassword(CREDENTIAL_TOKEN_SERVICE_NAME, CREDENTIAL_TOKEN_SERVICE_NAME_ACCOUNT, token).then(() => {
            // When token is set, we need to call reset
            // vscode.commands.executeCommand(SelfCommands.RESET_STORE);
            vscode.window.showInformationMessage(STRINGS.AUTH_SUCCESS_MESSAGE);
          });
        });
      }).catch((error: any) => {
        return Promise.resolve().then(() => {
          vscode.window.showInformationMessage(STRINGS.AUTH_FAILED_MESSAGE);
        });
      });
    } else {
      return Promise.resolve().then(() => {
        vscode.window.showInformationMessage(STRINGS.AUTH_FAILED_MESSAGE);
      });
    }
  }

  static clearToken(): Promise<void> {
    return keychain!.deletePassword(CREDENTIAL_TOKEN_SERVICE_NAME, CREDENTIAL_TOKEN_SERVICE_NAME_ACCOUNT).then(() => {
      // When token is set, we need to call reset
      // vscode.commands.executeCommand(SelfCommands.RESET_STORE);
    });
  }

  static askForAuth() {
    const actionItems = [STRINGS.SIGN_IN_JIRA, STRINGS.DONT_HAVE_JIRA];

    vscode.window.showInformationMessage(STRINGS.TOKEN_NOT_FOUND, ...actionItems).then(selected => {
      switch (selected) {
        case STRINGS.SIGN_IN_JIRA:
          vscode.commands.executeCommand(SelfCommands.SIGN_IN, {
            source: EventSource.info
          });
          break;
        case STRINGS.DONT_HAVE_JIRA:
          const opts: vscode.InputBoxOptions = {
            prompt: "Which task provider do you use?",
            placeHolder: "For example: Trelo, Aasana, etc."
          };
          vscode.window.showInputBox(opts).then(value => {
            if (!!value) {
              const title = `Add new task provider: ${value}`;
              const body = `My task provider is ${value}`;
              IssueReporter.openNewIssue(title, body);
            }
          });
          // vscode.window.showInformationMessage('SignUp to Jira Account and Try Again! :)');
          break;
      }
    });
  }

  static getProxyUrl() {
    // Stored under CONFIG_ROOT.proxyUrl
    const { proxyUrl } = this.getRootConfig();
    return proxyUrl;
  }

  static hasTelemetry(): boolean {
    const config = vscode.workspace.getConfiguration(TELEMETRY_CONFIG_ROOT);
    return !!config.get<boolean>(TELEMETRY_CONFIG_KEY);
  }

  static hasTravisProvider(): boolean {
    // Stored under CONFIG_ROOT.providers, which is string[]
    const { providers } = this.getRootConfig();
    return providers && providers.indexOf("travis") >= 0;
  }
}

export default ConfigHelper;
