"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const back_module_1 = require("./back.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(back_module_1.BackModule);
    app.enableCors({
        origin: ["*"],
    });
    await app.listen(5000);
}
bootstrap();
//# sourceMappingURL=main.js.map