import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initOpenApi } from './core/config/documentation/swagger';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'debug', 'log', 'verbose', 'warn'],
    });

    app.enableCors();

    const port = process.env.SERVER_PORT || 3000;

    console.log(
      `Server running on port ${port} || env: ${process.env.NODE_ENV}`,
    );

    initOpenApi(app);

    await app.listen(port);
    console.log('Connected to the database successfully.');
  } catch (error) {
    console.error(`Failed to start the server: ${error.message}`, error);
  }
}
bootstrap();
