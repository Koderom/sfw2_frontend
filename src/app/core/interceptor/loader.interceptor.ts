// loader.interceptor.ts (ARCHIVO MODIFICADO)

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoaderService } from '@/core/utils/ui/loader.service';


export const LoaderInterceptor: HttpInterceptorFn = (req, next) => {
    const loaderService = inject(LoaderService);
    loaderService.show();
    return next(req).pipe(
        finalize(() => {
            loaderService.hide();
        })
    );
};