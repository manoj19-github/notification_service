import { IError } from '@manoj19-github/microservice_shared_lib';
import { StatusCodes } from 'http-status-codes';

export abstract class CustomError extends Error {
	abstract statusCode: number;
	abstract status: string;
	comingFrom: string;
	constructor(message: string, comingForm: string) {
		super(message);
		this.comingFrom = comingForm;
	}
	serializeErrors(): IError {
		return {
			message: this.message,
			statusCode: this.statusCode,
			comingFrom: this.comingFrom,
			status: this.status
		};
	}
}

export class BadRequestError extends CustomError {
	statusCode = StatusCodes.BAD_REQUEST;
	status = 'error';
	constructor(message: string, comingFrom: string) {
		super(message, comingFrom);
	}
}

export class NotFoundError extends CustomError {
	statusCode = StatusCodes.NOT_FOUND;
	status = 'error';

	constructor(message: string, comingFrom: string) {
		super(message, comingFrom);
	}
}

export class NotAuthorizedError extends CustomError {
	statusCode = StatusCodes.UNAUTHORIZED;
	status = 'error';

	constructor(message: string, comingFrom: string) {
		super(message, comingFrom);
	}
}

export class FileTooLargeError extends CustomError {
	statusCode = StatusCodes.REQUEST_TOO_LONG;
	status = 'error';

	constructor(message: string, comingFrom: string) {
		super(message, comingFrom);
	}
}

export class ServerError extends CustomError {
	statusCode = StatusCodes.SERVICE_UNAVAILABLE;
	status = 'error';

	constructor(message: string, comingFrom: string) {
		super(message, comingFrom);
	}
}
