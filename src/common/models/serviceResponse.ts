import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

// Type to exclude ServiceResponse from being passed as data
type NonServiceResponse<T> = T extends ServiceResponse<any> ? never : T;

export class ServiceResponse<T = null> {
  readonly success: boolean;
  readonly message: string;
  readonly data: T;
  readonly statusCode: number;

  private constructor(
    success: boolean,
    message: string,
    data: T,
    statusCode: number
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
  }

  static success<T>(
    message: string,
    responseObject: NonServiceResponse<T>,
    statusCode: number = StatusCodes.OK
  ) {
    return new ServiceResponse(true, message, responseObject, statusCode);
  }

  static failure<T>(
    message: string,
    responseObject: NonServiceResponse<T>,
    statusCode: number = StatusCodes.BAD_REQUEST
  ) {
    return new ServiceResponse(false, message, responseObject, statusCode);
  }
}

export const ServiceResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    data: dataSchema.optional(),
    statusCode: z.number(),
  });
