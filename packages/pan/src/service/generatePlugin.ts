import { prompts, generateFile, updatePackageJSON } from "@lilith-plat/utils";
import { PluginAPI } from "./pluginAPI";

import { Generator } from "../types";

export default (api: PluginAPI) => {
  api.registerCommand({
    name: "generate",
    alias: "g",
    description: "generate code snippets quickly",
    async fn({ args }) {
      const [type] = args._;

      const runGenerator = async (generator: Generator) => {
        await generator?.fn({
          args,
          generateFile,
          updatePackageJSON,
        });
      };

      if (type) {
        const generator = api.service.generators[type] as Generator;
        if (!generator) {
          throw new Error(`Generator ${type} not found.`);
        }
        await runGenerator(generator);
      } else {
        const getEnableGenerators = async (
          generators: typeof api.service.generators
        ) => {
          const questions = [] as { title: string; value: string }[];
          for (const key of Object.keys(generators)) {
            const g = generators[key] as Generator;

            questions.push({
              title: `${g.name} -- ${g.description}` || "",
              value: g.key,
            });
          }
          return questions;
        };
        const questions = await getEnableGenerators(api.service.generators);
        const { gType } = await prompts({
          type: "select",
          name: "gType",
          message: "Pick generator type",
          choices: questions,
        });
        await runGenerator(api.service.generators[gType]);
      }
    },
  });
};
