import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class BigIntInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.convertBigInt(data)));
  }

  private convertBigInt(value: any): any {
    if (typeof value === 'bigint') {
      return value.toString();
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.convertBigInt(item));
    }

    if (value && typeof value === 'object') {
      const result: Record<string, any> = {};
      for (const [key, nestedValue] of Object.entries(value)) {
        result[key] = this.convertBigInt(nestedValue);
      }
      return result;
    }

    return value;
  }
}
