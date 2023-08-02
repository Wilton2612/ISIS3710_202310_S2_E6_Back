export class BusinessLogicException {
  message: string;
  type: BusinessError;
  code: BusinessError;

  constructor(message: string, code: BusinessError) {
    this.message = message;
    this.code = code;
  }
}

export enum BusinessError {
  NOT_FOUND,
  PRECONDITION_FAILED,
  BAD_REQUEST
}
