import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initOpenApi } from '@core/config/documentation/swagger';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      cors: {
        origin: '*',
      },
    });

    const port = process.env.SERVER_PORT || 3000;

    console.log(
      `Server running on port ${port} || env: ${process.env.NODE_ENV}`,
    );

    initOpenApi(app);

    await app.listen(port);
  } catch (error) {
    return error;
  }
}
bootstrap();
