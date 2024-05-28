"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initOpenApi = void 0;
const swagger_1 = require("@nestjs/swagger");
const initOpenApi = (app) => {
    const config = new swagger_1.DocumentBuilder()
        .setTitle('SEF Dashboard')
        .setDescription("Open API's docuemtation for SEF Dashboard.")
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        useGlobalPrefix: true,
        swaggerUrl: 'api/docs',
    });
};
exports.initOpenApi = initOpenApi;
//# sourceMappingURL=swagger.js.map