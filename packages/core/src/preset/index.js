"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => {
    return {
        plugins: [
            // commands
            require.resolve('./commands/generators/page'),
            require.resolve('./commands/generators/eslint-generator'),
        ],
    };
};
//# sourceMappingURL=index.js.map