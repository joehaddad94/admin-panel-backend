import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter } from 'events';

export interface QueryMetrics {
  query: string;
  duration: number;
  timestamp: Date;
  table?: string;
  operation?: string;
}

export interface SystemMetrics {
  memory: NodeJS.MemoryUsage;
  cpu: NodeJS.CpuUsage;
  uptime: number;
  timestamp: Date;
}

export interface PerformanceSnapshot {
  id: string;
  timestamp: Date;
  queries: QueryMetrics[];
  systemMetrics: SystemMetrics;
  requestCount: number;
  averageResponseTime: number;
  errorCount: number;
}

@Injectable()
export class PerformanceMonitorService extends EventEmitter {
  private readonly logger = new Logger(PerformanceMonitorService.name);
  private queryMetrics: QueryMetrics[] = [];
  private systemMetrics: SystemMetrics[] = [];
  private snapshots: PerformanceSnapshot[] = [];
  private isMonitoring = false;

  constructor() {
    super();
    this.startSystemMonitoring();
  }

  // Start monitoring system metrics
  private startSystemMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    setInterval(() => {
      this.captureSystemMetrics();
    }, 5000); // Capture every 5 seconds

    // Create snapshots every minute
    setInterval(() => {
      this.createSnapshot();
    }, 60000);
  }

  // Capture system metrics
  private captureSystemMetrics() {
    const metrics: SystemMetrics = {
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      uptime: process.uptime(),
      timestamp: new Date(),
    };

    this.systemMetrics.push(metrics);
    
    // Keep only last 24 hours of data
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    this.systemMetrics = this.systemMetrics.filter(
      m => m.timestamp > oneDayAgo
    );

    this.emit('systemMetrics', metrics);
  }

  // Record database query metrics
  recordQuery(query: string, duration: number, table?: string, operation?: string) {
    const metric: QueryMetrics = {
      query,
      duration,
      timestamp: new Date(),
      table,
      operation,
    };

    this.queryMetrics.push(metric);

    // Log slow queries
    if (duration > 1000) {
      this.logger.warn(`Slow query detected: ${duration}ms - ${query}`);
    }

    // Keep only last 24 hours of data
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    this.queryMetrics = this.queryMetrics.filter(
      m => m.timestamp > oneDayAgo
    );

    this.emit('queryMetrics', metric);
  }

  // Create performance snapshot
  private createSnapshot() {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
    
    const recentQueries = this.queryMetrics.filter(
      q => q.timestamp > oneMinuteAgo
    );
    
    const recentSystemMetrics = this.systemMetrics.filter(
      m => m.timestamp > oneMinuteAgo
    );

    const snapshot: PerformanceSnapshot = {
      id: `snapshot_${now.getTime()}`,
      timestamp: now,
      queries: recentQueries,
      systemMetrics: recentSystemMetrics[recentSystemMetrics.length - 1] || {
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        uptime: process.uptime(),
        timestamp: now,
      },
      requestCount: recentQueries.length,
      averageResponseTime: recentQueries.length > 0 
        ? recentQueries.reduce((sum, q) => sum + q.duration, 0) / recentQueries.length 
        : 0,
      errorCount: 0, // This would be populated from error tracking
    };

    this.snapshots.push(snapshot);
    
    // Keep only last 24 hours of snapshots
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    this.snapshots = this.snapshots.filter(
      s => s.timestamp > oneDayAgo
    );

    this.emit('snapshot', snapshot);
  }

  // Get performance analytics
  getAnalytics(hours = 1) {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    const recentQueries = this.queryMetrics.filter(q => q.timestamp > cutoff);
    const recentSystemMetrics = this.systemMetrics.filter(m => m.timestamp > cutoff);
    const recentSnapshots = this.snapshots.filter(s => s.timestamp > cutoff);

    // Query analytics
    const queryAnalytics = {
      total: recentQueries.length,
      averageDuration: recentQueries.length > 0 
        ? recentQueries.reduce((sum, q) => sum + q.duration, 0) / recentQueries.length 
        : 0,
      slowQueries: recentQueries.filter(q => q.duration > 1000).length,
      byTable: this.groupByTable(recentQueries),
      byOperation: this.groupByOperation(recentQueries),
    };

    // System analytics
    const systemAnalytics = {
      averageMemoryUsage: this.calculateAverageMemory(recentSystemMetrics),
      peakMemoryUsage: this.calculatePeakMemory(recentSystemMetrics),
      uptime: process.uptime(),
    };

    return {
      period: `${hours} hour(s)`,
      queryAnalytics,
      systemAnalytics,
      snapshots: recentSnapshots.length,
      recommendations: this.generateRecommendations(queryAnalytics, systemAnalytics),
    };
  }

  private groupByTable(queries: QueryMetrics[]) {
    const groups = new Map<string, { count: number; totalDuration: number; avgDuration: number }>();
    
    queries.forEach(query => {
      const table = query.table || 'unknown';
      if (!groups.has(table)) {
        groups.set(table, { count: 0, totalDuration: 0, avgDuration: 0 });
      }
      
      const group = groups.get(table)!;
      group.count++;
      group.totalDuration += query.duration;
      group.avgDuration = group.totalDuration / group.count;
    });

    return Object.fromEntries(groups);
  }

  private groupByOperation(queries: QueryMetrics[]) {
    const groups = new Map<string, { count: number; totalDuration: number; avgDuration: number }>();
    
    queries.forEach(query => {
      const operation = query.operation || 'unknown';
      if (!groups.has(operation)) {
        groups.set(operation, { count: 0, totalDuration: 0, avgDuration: 0 });
      }
      
      const group = groups.get(operation)!;
      group.count++;
      group.totalDuration += query.duration;
      group.avgDuration = group.totalDuration / group.count;
    });

    return Object.fromEntries(groups);
  }

  private calculateAverageMemory(metrics: SystemMetrics[]) {
    if (metrics.length === 0) return process.memoryUsage();
    
    const total = metrics.reduce((sum, m) => ({
      rss: sum.rss + m.memory.rss,
      heapTotal: sum.heapTotal + m.memory.heapTotal,
      heapUsed: sum.heapUsed + m.memory.heapUsed,
      external: sum.external + m.memory.external,
      arrayBuffers: sum.arrayBuffers + m.memory.arrayBuffers,
    }), { rss: 0, heapTotal: 0, heapUsed: 0, external: 0, arrayBuffers: 0 });

    return {
      rss: total.rss / metrics.length,
      heapTotal: total.heapTotal / metrics.length,
      heapUsed: total.heapUsed / metrics.length,
      external: total.external / metrics.length,
      arrayBuffers: total.arrayBuffers / metrics.length,
    };
  }

  private calculatePeakMemory(metrics: SystemMetrics[]) {
    if (metrics.length === 0) return process.memoryUsage();
    
    return metrics.reduce((peak, m) => ({
      rss: Math.max(peak.rss, m.memory.rss),
      heapTotal: Math.max(peak.heapTotal, m.memory.heapTotal),
      heapUsed: Math.max(peak.heapUsed, m.memory.heapUsed),
      external: Math.max(peak.external, m.memory.external),
      arrayBuffers: Math.max(peak.arrayBuffers, m.memory.arrayBuffers),
    }), { rss: 0, heapTotal: 0, heapUsed: 0, external: 0, arrayBuffers: 0 });
  }

  private generateRecommendations(queryAnalytics: any, systemAnalytics: any) {
    const recommendations = [];

    if (queryAnalytics.slowQueries > 0) {
      recommendations.push({
        type: 'warning',
        message: `${queryAnalytics.slowQueries} slow queries detected. Consider optimizing database queries or adding indexes.`,
      });
    }

    if (queryAnalytics.averageDuration > 500) {
      recommendations.push({
        type: 'warning',
        message: 'Average query duration is high. Consider database optimization.',
      });
    }

    const memoryUsageMB = systemAnalytics.averageMemoryUsage.heapUsed / 1024 / 1024;
    if (memoryUsageMB > 500) {
      recommendations.push({
        type: 'warning',
        message: 'High memory usage detected. Consider memory optimization.',
      });
    }

    return recommendations;
  }

  // Get real-time metrics
  getRealTimeMetrics() {
    return {
      currentMemory: process.memoryUsage(),
      currentCpu: process.cpuUsage(),
      uptime: process.uptime(),
      activeQueries: this.queryMetrics.length,
      activeSystemMetrics: this.systemMetrics.length,
      snapshots: this.snapshots.length,
    };
  }

  // Clear old data
  clearOldData(hoursToKeep = 24) {
    const cutoff = new Date(Date.now() - hoursToKeep * 60 * 60 * 1000);
    
    this.queryMetrics = this.queryMetrics.filter(q => q.timestamp > cutoff);
    this.systemMetrics = this.systemMetrics.filter(m => m.timestamp > cutoff);
    this.snapshots = this.snapshots.filter(s => s.timestamp > cutoff);
    
    this.logger.log(`Cleared performance data older than ${hoursToKeep} hours`);
  }
} 