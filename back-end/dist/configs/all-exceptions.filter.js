"use strict";
var AllExceptionsFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
let AllExceptionsFilter = AllExceptionsFilter_1 = class AllExceptionsFilter {
    constructor() {
        this.logger = new common_1.Logger(AllExceptionsFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let res;
        let statusCode;
        this.logger.error(exception);
        if (exception instanceof common_1.HttpException) {
            res = exception.getResponse();
            statusCode = exception.getStatus();
            if (statusCode === 400 &&
                typeof (res === null || res === void 0 ? void 0 : res.message) !== "string" &&
                (res === null || res === void 0 ? void 0 : res.message)) {
                res.message = res.message
                    .map((errorMessage) => {
                    return Object.values(errorMessage.constraints)[0].toString();
                })
                    .toString();
            }
        }
        else {
            res =
                process.env.NODE_ENV !== "production"
                    ? exception.stack
                    : "An error occurred. Please try again later.";
            statusCode = 500;
            if (typeof res === "string") {
                this.logger.error(res);
                res = {
                    statusCode: statusCode,
                    message: "An error occurred. Please try again later.",
                };
            }
        }
        response.status(statusCode).json(res);
    }
};
AllExceptionsFilter = AllExceptionsFilter_1 = tslib_1.__decorate([
    (0, common_1.Catch)(Error)
], AllExceptionsFilter);
exports.AllExceptionsFilter = AllExceptionsFilter;
//# sourceMappingURL=all-exceptions.filter.js.map