import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router)
  const auth = inject(AuthService)
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err) {
        alert(err.error)
        if(err.status == HttpStatusCode.Unauthorized) {
          auth.deleteToken()
          router.navigate(['/login'])
        }
      }
      throw err
    })
  )
}