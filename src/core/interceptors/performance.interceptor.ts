import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface PerformanceMetrics {
  method: string;
  url: string;
  executionTime: number;
  memoryUsage: NodeJS.MemoryUsage;
  timestamp: Date;
  statusCode?: number;
  error?: string;
}

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PerformanceInterceptor.name);
  private metrics: PerformanceMetrics[] = [];

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const startTime = Date.now();
    const startMemory = process.memoryUsage();

    const method = request.method;
    const url = request.url;

    return next.handle().pipe(
      tap((data) => {
        const endTime = Date.now();
        const endMemory = process.memoryUsage();
        const executionTime = endTime - startTime;

        const metric: PerformanceMetrics = {
          method,
          url,
          executionTime,
          memoryUsage: {
            rss: endMemory.rss - startMemory.rss,
            heapTotal: endMemory.heapTotal - startMemory.heapTotal,
            heapUsed: endMemory.heapUsed - startMemory.heapUsed,
            external: endMemory.external - startMemory.external,
            arrayBuffers: endMemory.arrayBuffers - startMemory.arrayBuffers,
          },
          timestamp: new Date(),
          statusCode: response.statusCode,
        };

        this.metrics.push(metric);

        // Log slow requests (over 1 second)
        if (executionTime > 1000) {
          this.logger.warn(
            `Slow request detected: ${method} ${url} took ${executionTime}ms`,
          );
        }

        // Log performance metrics in development
        if (process.env.NODE_ENV === 'develop') {
          this.logger.debug(
            `Performance: ${method} ${url} - ${executionTime}ms - Memory: ${Math.round(
              metric.memoryUsage.heapUsed / 1024 / 1024,
            )}MB`,
          );
        }
      }),
      catchError((error) => {
        const endTime = Date.now();
        const endMemory = process.memoryUsage();
        const executionTime = endTime - startTime;

        const metric: PerformanceMetrics = {
          method,
          url,
          executionTime,
          memoryUsage: {
            rss: endMemory.rss - startMemory.rss,
            heapTotal: endMemory.heapTotal - startMemory.heapTotal,
            heapUsed: endMemory.heapUsed - startMemory.heapUsed,
            external: endMemory.external - startMemory.external,
            arrayBuffers: endMemory.arrayBuffers - startMemory.arrayBuffers,
          },
          timestamp: new Date(),
          statusCode: response.statusCode,
          error: error.message,
        };

        this.metrics.push(metric);

        this.logger.error(
          `Request failed: ${method} ${url} took ${executionTime}ms - Error: ${error.message}`,
        );

        throw error;
      }),
    );
  }

  // Method to get performance metrics (for monitoring endpoints)
  getMetrics(): PerformanceMetrics[] {
    return this.metrics;
  }

  // Method to get aggregated metrics
  getAggregatedMetrics() {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const recentMetrics = this.metrics.filter((m) => m.timestamp > oneHourAgo);

    if (recentMetrics.length === 0) {
      return {
        totalRequests: 0,
        averageResponseTime: 0,
        slowRequests: 0,
        errorRate: 0,
        memoryUsage: { heapUsed: 0, heapTotal: 0 },
      };
    }

    const totalRequests = recentMetrics.length;
    const averageResponseTime =
      recentMetrics.reduce((sum, m) => sum + m.executionTime, 0) /
      totalRequests;
    const slowRequests = recentMetrics.filter(
      (m) => m.executionTime > 1000,
    ).length;
    const errorRate =
      (recentMetrics.filter((m) => m.error).length / totalRequests) * 100;

    const avgMemoryUsage = {
      heapUsed:
        recentMetrics.reduce((sum, m) => sum + m.memoryUsage.heapUsed, 0) /
        totalRequests,
      heapTotal:
        recentMetrics.reduce((sum, m) => sum + m.memoryUsage.heapTotal, 0) /
        totalRequests,
    };

    return {
      totalRequests,
      averageResponseTime: Math.round(averageResponseTime),
      slowRequests,
      errorRate: Math.round(errorRate * 100) / 100,
      memoryUsage: avgMemoryUsage,
    };
  }

  // Method to clear old metrics (call this periodically)
  clearOldMetrics(hoursToKeep = 24) {
    const cutoff = new Date(Date.now() - hoursToKeep * 60 * 60 * 1000);
    this.metrics = this.metrics.filter((m) => m.timestamp > cutoff);
  }
}
