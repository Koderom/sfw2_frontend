import { HttpInterceptorFn, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ResponseDto } from '../dtos/response.dto';

export const ToastInterceptor: HttpInterceptorFn = (req, next) => {
    const messageService = inject(MessageService);
    const methodsToShowSuccess = ['POST', 'PUT', 'DELETE'];

    return next(req).pipe(
        tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                const body = event.body as ResponseDto<any>;
                if (body && body.message && methodsToShowSuccess.includes(req.method)) {
                    messageService.add({
                        severity: 'success', 
                        summary: 'Éxito', 
                        detail: body.message
                    });
                }
            }
        }),
        catchError((error: HttpErrorResponse) => {
            const errorBody = error.error as ResponseDto<any>;
            
            if (errorBody && (errorBody.error || errorBody.message)) {
                 const detail = errorBody.error || errorBody.message || 'Error desconocido';

                 messageService.add({
                    severity: 'error', 
                    summary: `Error ${error.status}`, 
                    detail: detail
                 });
            } else {
                 messageService.add({
                    severity: 'error', 
                    summary: `Error de Conexión (${error.status})`, 
                    detail: error.message || 'El servidor no respondió.'
                 });
            }
            return throwError(() => error);
        })
    );
};