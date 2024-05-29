import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const initOpenApi = (app) => {
  const config = new DocumentBuilder()
    .setTitle('SEF Dashboard')
    .setDescription("Open API's docuemtation for SEF Dashboard.")
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    useGlobalPrefix: true,
    swaggerUrl: 'api/docs',
    ...(process.env.NODE_ENV === 'production'
      ? {
          customCssUrl: [
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui.min.css',
          ],
          customJs: [
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-standalone-preset.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-bundle.min.js',
          ],
        }
      : {}),
    // customCss:
    //   'body{background-color: #232323;color:white;} .swagger-ui .topbar { display: none } .opblock-summary{border-color: #4d4dff} .opblock.opblock-get{background-color:#4d4dff21;} .swagger-ui a.nostyle:visited{color:white} .swagger-ui a.nostyle{color:white}',
  });
};
