import { yParser, generateFile } from "@lilith-plat/utils";
import { PageGenerator } from "./page";


export async function run() {
  const args = yParser(process.argv.slice(2), {
    alias: {
      version: ["v"],
      help: ["h"],
      generate: ["g"],
    },
    boolean: ["version"],
  });
  const command = args._[0];
  if (command === "build") {
    process.env.NODE_ENV = "production";
  }

  const generator = new PageGenerator({
    args,
    absPagesPath: "",
    appCwd: "/",
    generateFile,
  });

  console.log(args, "opts, args");

  generator.run();
  // if (opts?.presets) {
  //   process.env.UMI_PRESETS = opts.presets.join(",");
  // }
  // if (command === DEV_COMMAND) {
  //   dev();
  // } else {
  //   try {
  //     await new Service().run2({
  //       name: args._[0],
  //       args,
  //     });
  //   } catch (e: any) {
  //     logger.fatal(e);
  //     printHelp.exit();
  //     process.exit(1);
  //   }
  // }
}
