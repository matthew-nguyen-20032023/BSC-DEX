"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const swagger_1 = require("@nestjs/swagger");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const all_exceptions_filter_1 = require("./configs/all-exceptions.filter");
const nestjs_sentry_1 = require("@ntegral/nestjs-sentry");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: false,
    });
    app.enableCors();
    app.setGlobalPrefix(process.env.APP_PREFIX);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        errorHttpStatusCode: common_1.HttpStatus.BAD_REQUEST,
        transform: true,
        exceptionFactory: (errors) => new common_1.BadRequestException(errors),
    }));
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
    if (process.env.NODE_ENV !== "production") {
        const openAPIConfig = new swagger_1.DocumentBuilder()
            .setTitle(`${process.env.APP_NAME} API`)
            .setDescription(`This api document only available for development only!`)
            .setVersion("1.0")
            .addBearerAuth({
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            name: "Authorization",
            description: "Enter JWT token",
            in: "header",
        })
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, openAPIConfig);
        swagger_1.SwaggerModule.setup("api/docs", app, document);
    }
    app.useLogger(nestjs_sentry_1.SentryService.SentryServiceInstance());
    await app.listen(process.env.NODE_PORT);
    console.log(`[${process.env.APP_NAME}]: `, `SERVICE BACKEND RUNNING ON PORT ${process.env.NODE_PORT}`);
}
bootstrap();
//# sourceMappingURL=main.js.map