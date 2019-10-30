export class ServiceError<T = any> extends Error {
  public readonly ignoreLog: boolean;
  public readonly metadata: T;

  constructor(message: string, metadata?: T, ignoreLog: boolean = false) {
    super(message);

    this.message = message;
    this.metadata = metadata;
    this.ignoreLog = ignoreLog;
  }
}
