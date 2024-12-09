import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  message: string | null | undefined;
  data: T | null | undefined;
  count?: number;
  pageSize?: number;
}

@Injectable()
export class DataTransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(map((returned) => this.formatData(returned)));
  }

  formatData(returned: unknown): Response<T> {
    const data = returned as Response<T>;
    const dataResponse = {
      message: data.message ?? null,
      data: data.data ?? data,
    };

    if (data.count !== undefined && data.count >= 0) {
      Object.assign(dataResponse, { count: data.count });
    }

    if (data.pageSize !== undefined && data.pageSize >= 0) {
      Object.assign(dataResponse, { pageSize: data.pageSize });
    }

    return dataResponse as Response<T>;
  }
}
