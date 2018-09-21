import { openUrl, getVersions } from "./utils";

const BASE_ISSUES_URL = "https://github.com/Code-Crash/jira-rocket/issues/new";

/**
 * @description - This class will help to create the issue on git hub in jira-rocket repo.
 */
export default class IssueReporter {
  static getVersionString() {
    const { extension, os, editor } = getVersions();
    return `- Extension Version: ${extension}\n- OS Version: ${os}\n- VSCode version: ${editor}`;
  }

  /**
   * @description - This will return the URL with params
   * @param query 
   */
  static getUrl(query: object) {
    const getParams = (p: string | {}) =>
      Object.entries(p)
        .map(kv => kv.map(encodeURIComponent).join("="))
        .join("&");
    return `${BASE_ISSUES_URL}?${getParams(query)}`;
  }

  /**
   * @description -  This function will redirect to github page to open the URL.
   * @param title 
   * @param body 
   */
  static openNewIssue(title: string, body: string) {
    const versions = this.getVersionString();
    const bodyText = `${body}\n\n${versions}`.replace(/\n/g, "%0A");
    const params = { title: `[vscode] ${title}`, body: bodyText };
    return openUrl(this.getUrl(params));
  }
}
