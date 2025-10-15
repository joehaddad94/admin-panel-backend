import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initOpenApi } from './core/config/documentation/swagger';
import { PerformanceInterceptor } from './core/interceptors/performance.interceptor';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'debug', 'log', 'verbose', 'warn'],
    });

    app.enableCors({
      origin: [
        // 'https://sef-admin-panel-development.vercel.app',
        // 'https://sef-admin-panel.vercel.app',
        'https://sef-admin-panel-frontend-development.onrender.com',
        'https://sef-admin-panel-frontend.onrender.com',
        'https://*.sef-hiring-portal.com',
        'http://localhost:3000',
      ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      exposedHeaders: ['Content-Disposition'],
    });

    const port = process.env.SERVER_PORT || 3000;

    console.log(
      `Server running on port ${port} || env: ${process.env.NODE_ENV}`,
    );

    initOpenApi(app);

    // Apply performance interceptor globally
    const performanceInterceptor = app.get(PerformanceInterceptor);
    app.useGlobalInterceptors(performanceInterceptor);

    await app.listen(port);
    console.log('Connected to the database successfully.');
  } catch (error) {
    console.error(`Failed to start the server: ${error.message}`, error);
  }
}
bootstrap();
