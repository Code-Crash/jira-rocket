import * as vscode from "vscode";
import { OUTPUT_CHANNEL_NAME } from "./constants";

export default class Logger {
  static output: vscode.OutputChannel | undefined;

  static setup() {
    this.output = this.output || vscode.window.createOutputChannel(OUTPUT_CHANNEL_NAME);
    console.log('setup', this.output);
  }

  private static get timestamp(): string {
    const now = new Date();
    return now.toLocaleString();
  }

  private static logOnConsole(message: string): void {
    console.log(message);
    console.log('logOnConsole', this.output);
  }

  private static logOnOutput(message: string): void {
    if (this.output === undefined) {
      this.setup();
    }
    console.log('logOnOutput', this.output);

    if (!!this.output) {
      this.output.appendLine(message);
    }
  }

  static log(message: any): void {
    const logLine = `[${this.timestamp}]: ${message}`;
    return process.env.DEBUG === "true"
      ? this.logOnConsole(logLine)
      : this.logOnOutput(logLine);
  }
}
