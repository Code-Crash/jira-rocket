export const CONFIG_ROOT = "task";
export const EXTENSION_ID = "code-crash.jira.rocket";
export const OUTPUT_CHANNEL_NAME = "Jira Rocket";

// Is there a way to get this url from the vsls extension?
export const LIVE_SHARE_BASE_URL = `insiders.liveshare.vsengsaas.visualstudio.com`;
export const VSLS_EXTENSION_ID = `ms-vsliveshare.vsliveshare`;
export const VSLS_EXTENSION_PACK_ID = `ms-vsliveshare.vsliveshare-pack`;

export const LiveShareCommands = {
  START: "liveshare.start",
  END: "liveshare.end",
  JOIN: "liveshare.join"
};

export const VSCodeCommands = {
  OPEN: "vscode.open",
  OPEN_SETTINGS: "workbench.action.openSettings"
};

export const SelfCommands = {
  SIGN_IN: "extension.task.authenticate",
  SIGN_OUT: "extension.task.signout",
  CONFIGURE_TOKEN: "extension.task.configureToken",
  RESET_STORE: "extension.task.reset"
};

const prefix = 'Jira Rocket:';

export const STRINGS = {
  TOKEN_NOT_FOUND: prefix + "Setup Jira account to work for your account.",
  SIGN_IN_JIRA: "Sign in with Jira Account",
  SIGN_OUT_JIRA: "Sign out with Jira Account",
  SIGN_OUT_SUCCESS: "Your account is sign out successfully from Jira Rocket!",
  REPORT_ISSUE: prefix + "Report issue",
  TOKEN_HOLDER: "Enter/Paste your token here",
  URL_HOLDER: "Enter/Paste your Jira account URL here",
  EMAIL_HOLDER: "Input your email here",
  AUTH_FAILED_MESSAGE: "Your Email/Password/URL is not valid. Please try again or Help us to get better by reporting an issue or try again.",
  AUTH_SUCCESS_MESSAGE: "Your account is ready for use. :) Happy Tasking!!",
  DONT_HAVE_JIRA: " Don't have Jira Account",
  INVALID_COMMAND: (text: string) => ` ${text} is not a recognized command.`,
}