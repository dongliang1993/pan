"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageGenerator = void 0;
const path_1 = require("path");
const utils_1 = require("@lilith-plat/utils");
const constants_1 = require("../../../../../pan/src/constants");
const utils_2 = require("../../../../../pan/src/utils");
const INDEX_TPL_PATH = (0, path_1.join)(constants_1.TEMPLATES_DIR, 'generate/page/index.tsx.tpl');
const LEES_TPL_PATH = (0, path_1.join)(constants_1.TEMPLATES_DIR, 'generate/page/index.less.tpl');
const DEFAULT_PAGE_NAME = 'unTitledPage';
exports.default = (api) => {
    api.registerGenerator({
        key: 'page',
        name: 'Create Pages',
        description: 'Create a page by page name',
        fn: async (options) => {
            return new PageGenerator({
                generateFile: utils_1.generateFile,
                args: options.args,
                absPagesPath: '',
                appCwd: '/',
            }).run();
        },
    });
};
class PageGenerator {
    constructor(options) {
        this.options = options;
        this.isDirMode = false;
        this.dir = '';
        this.name = '';
        this.needEnsureDirMode = false;
        this.prompts = utils_2.promptsExitWhenCancel;
        this.paths = [];
        this.isDirMode = options.args.dir;
        const [_, ...inputPaths] = options.args._;
        if (inputPaths.length > 0) {
            this.paths = inputPaths;
        }
        else {
            this.needEnsureDirMode = true;
        }
    }
    async run() {
        if (this.paths.length === 0) {
            await this.runInteractiveMode();
        }
        else {
            for (const p of this.paths) {
                this.setPath(p);
                if (this.isDirMode) {
                    await this.dirModeRun();
                }
                else {
                    await this.fileModeRun();
                }
            }
        }
    }
    async runInteractiveMode() {
        await this.ensureName();
        await this.ensureDirMode();
        if (this.isDirMode) {
            await this.dirModeRun();
        }
        else {
            await this.fileModeRun();
        }
    }
    setPrompter(p) {
        this.prompts = p;
    }
    getDirMode() {
        return this.isDirMode;
    }
    setPath(np) {
        const { dir, name } = (0, path_1.parse)(np);
        this.name = name;
        this.dir = dir;
    }
    async ensureName() {
        if (this.name) {
            return;
        }
        const response = await this.prompts({
            type: 'text',
            name: 'name',
            message: 'What is the name of page?',
            initial: DEFAULT_PAGE_NAME,
        });
        const { name: rawInput = '' } = response;
        const pageName = rawInput.trim();
        if (pageName) {
            this.setPath(pageName);
        }
        else {
            this.setPath(DEFAULT_PAGE_NAME);
        }
        this.isDirMode = false;
    }
    async ensureDirMode() {
        if (!this.needEnsureDirMode)
            return;
        const response = await this.prompts({
            type: 'select',
            name: 'mode',
            message: 'How dou you want page files to be created?',
            choices: [
                { title: this.dirModeFileExample(), value: 'dir' },
                { title: this.fileModeFileExample(), value: 'file' },
            ],
            initial: 0,
        });
        this.isDirMode = response.mode === 'dir';
    }
    fileModeFileExample() {
        const base = (0, path_1.join)(this.dir, this.name);
        return `${base}.{tsx,less}`;
    }
    dirModeFileExample() {
        const base = (0, path_1.join)(this.dir, this.name, 'index');
        return `${base}.{tsx,less}`;
    }
    async fileModeRun() {
        const { generateFile, absPagesPath } = this.options;
        const data = {
            color: (0, utils_1.randomColor)(),
            name: this.name,
            cssExt: '.less',
        };
        await generateFile({
            path: INDEX_TPL_PATH,
            target: (0, path_1.join)(absPagesPath, this.dir, `${this.name}.tsx`),
            baseDir: this.options.appCwd,
            data,
        });
        await generateFile({
            path: LEES_TPL_PATH,
            target: (0, path_1.join)(absPagesPath, this.dir, `${this.name}.less`),
            baseDir: this.options.appCwd,
            data,
        });
    }
    async dirModeRun() {
        const { generateFile, absPagesPath } = this.options;
        await generateFile({
            path: (0, path_1.join)(__dirname, '../../../templates/generate/page'),
            target: (0, path_1.join)(absPagesPath, this.dir, this.name),
            data: {
                color: (0, utils_1.randomColor)(),
                name: 'index',
                cssExt: '.less',
            },
            baseDir: this.options.appCwd,
        });
    }
}
exports.PageGenerator = PageGenerator;
//# sourceMappingURL=page.js.map