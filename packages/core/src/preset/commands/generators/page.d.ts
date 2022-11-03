/// <reference types="prompts" />
import { generateFile, prompts } from '@lilith-plat/utils';
declare const _default: (api: PluginAPI) => void;
export default _default;
export declare class PageGenerator {
    readonly options: {
        args: any;
        generateFile: typeof generateFile;
        absPagesPath: string;
        appCwd: string;
    };
    private isDirMode;
    private dir;
    private name;
    private needEnsureDirMode;
    private prompts;
    private paths;
    constructor(options: {
        args: any;
        generateFile: typeof generateFile;
        absPagesPath: string;
        appCwd: string;
    });
    run(): Promise<void>;
    runInteractiveMode(): Promise<void>;
    setPrompter(p: typeof prompts): void;
    getDirMode(): boolean;
    private setPath;
    private ensureName;
    private ensureDirMode;
    private fileModeFileExample;
    private dirModeFileExample;
    private fileModeRun;
    private dirModeRun;
}
