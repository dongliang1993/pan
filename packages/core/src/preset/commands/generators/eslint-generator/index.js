"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTsProject = exports.Language = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
var Language;
(function (Language) {
    Language["TS"] = "ts";
    Language["JS"] = "js";
})(Language = exports.Language || (exports.Language = {}));
function isTsProject(appDir) {
    return fs_1.default.existsSync(path_1.default.join(appDir, 'tsconfig.json'));
}
exports.isTsProject = isTsProject;
exports.default = (api) => {
    api.registerGenerator({
        key: 'eslint',
        name: 'Create Eslint',
        description: 'Create eslint config',
        fn: async (options) => {
            console.log(process.cwd(), __dirname, '===');
        },
    });
};
//# sourceMappingURL=index.js.map