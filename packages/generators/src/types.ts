import { generateFile, updatePackageJSON } from "@lilith-plat/utils";

import { PluginAPI } from "./service/PluginAPI";

export type IApi = PluginAPI;

export interface Generator {
  key: string;
  name: string;
  description: string;
  fn: (options: {
    args: any;
    generateFile: typeof generateFile;
    updatePackageJSON: typeof updatePackageJSON;
  }) => Promise<void>;
}

export type Plugin = (api: PluginAPI) => any;
