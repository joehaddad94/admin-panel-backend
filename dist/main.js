"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("./core/config/documentation/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        cors: {
            origin: '*',
        },
    });
    const port = process.env.SERVER_PORT || 3000;
    console.log(`Server running on port ${port} || env: ${process.env.NODE_ENV}`);
    (0, swagger_1.initOpenApi)(app);
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map