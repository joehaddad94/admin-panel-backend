import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PerformanceInterceptor } from '../../core/interceptors/performance.interceptor';
import { PerformanceMonitorService } from '../../core/services/performance-monitor.service';

@ApiTags('performance')
@Controller('performance')
export class PerformanceController {
  constructor(
    private readonly performanceInterceptor: PerformanceInterceptor,
    private readonly performanceMonitorService: PerformanceMonitorService,
  ) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Get all performance metrics' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of metrics to return' })
  @ApiQuery({ name: 'hours', required: false, description: 'Hours of data to return' })
  async getMetrics(
    @Query('limit') limit?: number,
    @Query('hours') hours?: number,
  ) {
    const metrics = this.performanceInterceptor.getMetrics();
    
    let filteredMetrics = metrics;
    
    if (hours) {
      const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
      filteredMetrics = metrics.filter(m => m.timestamp > cutoff);
    }
    
    if (limit) {
      filteredMetrics = filteredMetrics.slice(-limit);
    }
    
    return {
      total: filteredMetrics.length,
      metrics: filteredMetrics,
    };
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get aggregated performance summary' })
  async getSummary() {
    const summary = this.performanceInterceptor.getAggregatedMetrics();
    const currentMemory = process.memoryUsage();
    
    return {
      ...summary,
      currentMemory: {
        rss: Math.round(currentMemory.rss / 1024 / 1024),
        heapUsed: Math.round(currentMemory.heapUsed / 1024 / 1024),
        heapTotal: Math.round(currentMemory.heapTotal / 1024 / 1024),
        external: Math.round(currentMemory.external / 1024 / 1024),
        arrayBuffers: Math.round(currentMemory.arrayBuffers / 1024 / 1024),
      },
      uptime: process.uptime(),
      nodeVersion: process.version,
      platform: process.platform,
    };
  }

  @Get('slow-requests')
  @ApiOperation({ summary: 'Get slow requests (over 1 second)' })
  @ApiQuery({ name: 'threshold', required: false, description: 'Threshold in milliseconds (default: 1000)' })
  async getSlowRequests(@Query('threshold') threshold = 1000) {
    const metrics = this.performanceInterceptor.getMetrics();
    const slowRequests = metrics.filter(m => m.executionTime > threshold);
    
    return {
      threshold,
      count: slowRequests.length,
      requests: slowRequests.sort((a, b) => b.executionTime - a.executionTime),
    };
  }

  @Get('errors')
  @ApiOperation({ summary: 'Get requests that resulted in errors' })
  async getErrors() {
    const metrics = this.performanceInterceptor.getMetrics();
    const errors = metrics.filter(m => m.error);
    
    return {
      count: errors.length,
      errors: errors.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
    };
  }

  @Get('endpoints')
  @ApiOperation({ summary: 'Get performance by endpoint' })
  async getEndpointsPerformance() {
    const metrics = this.performanceInterceptor.getMetrics();
    const endpointStats = new Map();
    
    metrics.forEach(metric => {
      const key = `${metric.method} ${metric.url}`;
      if (!endpointStats.has(key)) {
        endpointStats.set(key, {
          endpoint: key,
          count: 0,
          totalTime: 0,
          avgTime: 0,
          minTime: Infinity,
          maxTime: 0,
          errors: 0,
        });
      }
      
      const stats = endpointStats.get(key);
      stats.count++;
      stats.totalTime += metric.executionTime;
      stats.avgTime = stats.totalTime / stats.count;
      stats.minTime = Math.min(stats.minTime, metric.executionTime);
      stats.maxTime = Math.max(stats.maxTime, metric.executionTime);
      
      if (metric.error) {
        stats.errors++;
      }
    });
    
    return {
      endpoints: Array.from(endpointStats.values()).sort((a, b) => b.avgTime - a.avgTime),
    };
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get detailed performance analytics' })
  @ApiQuery({ name: 'hours', required: false, description: 'Hours of data to analyze (default: 1)' })
  async getAnalytics(@Query('hours') hours = 1) {
    return this.performanceMonitorService.getAnalytics(hours);
  }

  @Get('realtime')
  @ApiOperation({ summary: 'Get real-time performance metrics' })
  async getRealTimeMetrics() {
    return this.performanceMonitorService.getRealTimeMetrics();
  }

  @Get('clear')
  @ApiOperation({ summary: 'Clear old performance data' })
  @ApiQuery({ name: 'hours', required: false, description: 'Hours of data to keep (default: 24)' })
  async clearOldData(@Query('hours') hours = 24) {
    this.performanceMonitorService.clearOldData(hours);
    return { message: `Cleared performance data older than ${hours} hours` };
  }
} 