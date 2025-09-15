export interface ResponseDto<T>{
    message: string[];
    error: string;
    statusCode: number;
    data: T;
}