import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environments/environment';

export const apiUrlInterceptor: HttpInterceptorFn = (request, next) => {
  if (environment.apiUrl && request.url.startsWith('/api/')) {
    return next(request.clone({ url: `${environment.apiUrl}${request.url}` }));
  }

  return next(request);
};
