import type * as atomIde from "atom-ide-base"
import { LanguageClientConnection, LogMessageParams, MessageType } from "../languageclient"

/** Adapts Atom's user notifications to those of the language server protocol. */
export default class LoggingConsoleAdapter {
  private _consoles: Set<atomIde.ConsoleApi> = new Set()

  /**
   * Create a new {LoggingConsoleAdapter} that will listen for log messages
   * via the supplied {LanguageClientConnection}.
   *
   * @param connection A {LanguageClientConnection} to the language server that will provide log messages.
   */
  constructor(connection: LanguageClientConnection) {
    connection.onLogMessage(this.logMessage.bind(this))
  }

  /** Dispose this adapter ensuring any resources are freed and events unhooked. */
  public dispose(): void {
    this.detachAll()
  }

  /**
   * Public: Attach this {LoggingConsoleAdapter} to a given {atomIde.ConsoleApi}.
   *
   * @param console A {atomIde.ConsoleApi} that wants to receive messages.
   */
  public attach(console: atomIde.ConsoleApi): void {
    this._consoles.add(console)
  }

  /** Public: Remove all {atomIde.ConsoleApi}'s attached to this adapter. */
  public detachAll(): void {
    this._consoles.clear()
  }

  /**
   * Log a message using the Atom IDE UI Console API.
   *
   * @param params The {LogMessageParams} received from the language server
   *   indicating the details of the message to be loggedd.
   */
  private logMessage(params: LogMessageParams): void {
    switch (params.type) {
      case MessageType.Error: {
        this._consoles.forEach((c) => c.error(params.message))
        return
      }
      case MessageType.Warning: {
        this._consoles.forEach((c) => c.warn(params.message))
        return
      }
      case MessageType.Info: {
        this._consoles.forEach((c) => c.info(params.message))
        return
      }
      case MessageType.Log: {
        this._consoles.forEach((c) => c.log(params.message))
        return
      }
    }
  }
}
