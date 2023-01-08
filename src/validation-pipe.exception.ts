import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class ValidationPipeException extends BadRequestException {
  constructor(
    private readonly objectOrError?:
      | string
      | object
      | any[]
      | Array<ValidationError>,
  ) {
    let message = '';

    if (objectOrError instanceof Array<ValidationError>) {
      const errorMessages = [];

      (objectOrError as ValidationError[]).forEach((error) => {
        if (error.constraints) {
          for (const key in error.constraints) {
            errorMessages.push(error.constraints[key]);
          }
        }
      });

      errorMessages.forEach((msg, idx) => {
        message += msg;
        if (idx + 1 < errorMessages.length) {
          message += '\n';
        }
      });
    } else if (typeof objectOrError === 'string') {
      message = objectOrError;
    }

    super(message, 'This is a custom exception message');
  }

  getValidationErrors(): any {
    return this.objectOrError;
  }
}
