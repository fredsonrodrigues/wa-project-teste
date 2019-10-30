export class ServiceError extends Error {
  public data: any = null;

  constructor(save: string, data: any = {}) {
    super(save);
    this.data = data;
  }

  public toJSON(): { message: string, data: any } {
    return {
      message: this.message,
      data: this.data
    };
  }
}
