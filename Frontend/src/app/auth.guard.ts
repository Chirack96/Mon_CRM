import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './services/auth.service';
import { map, switchMap, take } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';

export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> => {
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
          switchMap(isLoggedIn => {
            if (isLoggedIn) {
              const requiredRole = route.data['role'] as string | undefined;
              console.log('Required Role:', requiredRole); // Vérifiez que le rôle requis est correctement lu
              if (!requiredRole) {
                // Pas de rôle requis, l'utilisateur doit simplement être authentifié
                return of(true);
              }
              return from(authService.getUserRole()).pipe(
                map(userRole => {
                  console.log('User Role:', userRole); // Vérifiez les rôles
                  if (userRole === requiredRole) {
                    return true;
                  } else {
                    return router.parseUrl('/forbidden');
                  }
                })
              );
            } else {
              return of(router.parseUrl('/login'));
            }
          })
        );
      })
    ))
  );
};
