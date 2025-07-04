import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PerformanceMonitorService } from '../services/performance-monitor.service';

@Injectable()
export class DatabasePerformanceInterceptor implements NestInterceptor {
  constructor(private readonly performanceMonitorService: PerformanceMonitorService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    
    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        
        // Extract query information from the request context
        const request = context.switchToHttp().getRequest();
        const method = request.method;
        const url = request.url;
        
        // Record the database operation
        this.performanceMonitorService.recordQuery(
          `${method} ${url}`,
          duration,
          'unknown', // table name would need to be extracted from TypeORM
          'database_operation'
        );
      })
    );
  }
} 