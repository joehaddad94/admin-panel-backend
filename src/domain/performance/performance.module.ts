import { Module } from '@nestjs/common';
import { PerformanceController } from './performance.controller';
import { PerformanceInterceptor } from '../../core/interceptors/performance.interceptor';
import { PerformanceMonitorService } from '../../core/services/performance-monitor.service';

@Module({
  controllers: [PerformanceController],
  providers: [PerformanceInterceptor, PerformanceMonitorService],
  exports: [PerformanceInterceptor, PerformanceMonitorService],
})
export class PerformanceModule {} 