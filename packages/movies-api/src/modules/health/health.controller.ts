import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Get overall health status' })
  @ApiResponse({
    status: 200,
    description: 'Health check passed',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string' },
        uptime: { type: 'number' },
        environment: { type: 'string' },
      },
    },
  })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  }

  @Get('liveness')
  @ApiOperation({ summary: 'Liveness probe for Kubernetes' })
  @ApiResponse({
    status: 200,
    description: 'Application is alive',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string' },
      },
    },
  })
  getLiveness() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('readiness')
  @ApiOperation({ summary: 'Readiness probe for Kubernetes' })
  @ApiResponse({
    status: 200,
    description: 'Application is ready to serve traffic',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string' },
        checks: { type: 'object' },
      },
    },
  })
  getReadiness() {
    // Basic readiness check - can be expanded later
    const checks = {
      memory: this.checkMemory(),
      environment: this.checkEnvironment(),
    };

    const allHealthy = Object.values(checks).every(
      (check) => check.status === 'ok',
    );

    return {
      status: allHealthy ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      checks,
    };
  }

  private checkMemory() {
    const memUsage = process.memoryUsage();
    const maxHeapSize = 150 * 1024 * 1024; // 150MB threshold

    return {
      status: memUsage.heapUsed < maxHeapSize ? 'ok' : 'error',
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
    };
  }

  private checkEnvironment() {
    const requiredEnvVars = ['TMDB_API_ACCESS_TOKEN', 'OMDB_API_KEY'];
    const missing = requiredEnvVars.filter((envVar) => !process.env[envVar]);

    return {
      status: missing.length === 0 ? 'ok' : 'error',
      missing: missing.length > 0 ? missing : undefined,
    };
  }
}
