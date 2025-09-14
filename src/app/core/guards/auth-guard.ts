import { LoginService } from '@/modules/auth/login/loginService';
import { inject } from '@angular/core';
import { CanMatchFn, GuardResult, MaybeAsync, Router } from '@angular/router';
import { map } from 'rxjs';

export const authGuard: CanMatchFn = (
  route, 
  segments
): MaybeAsync<GuardResult> => {
  const router = inject(Router);
  return inject(LoginService).currentUser$.pipe(
    map((user) => {
      if(user) return true;
      return router.createUrlTree(['/auth/login']);
    })
  );
};
