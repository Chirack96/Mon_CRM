import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { map, switchMap, take } from 'rxjs/operators';
import { from } from 'rxjs';

export const AuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return from(authService.initializeLoginState()).pipe(
    switchMap(() => authService.isLoading.pipe(
      switchMap(isLoading => {
        if (isLoading) {
          return authService.isLoading.pipe(take(1));
        }
        return authService.authStatus.pipe(
          take(1),
          map(isLoggedIn => {
            if (isLoggedIn) {
              return true;
            } else {
              router.navigate(['/login']);
              return false;
            }
          })
        );
      })
    ))
  );
};
