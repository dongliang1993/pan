import { yParser, logger } from "@lilith-plat/utils";
import { Service } from "./service/service";

export async function run() {
  const args = yParser(process.argv.slice(2), {
    alias: {
      version: ["v"],
      help: ["h"],
    },
    boolean: ["version"],
  });
  const command = args._[0] as string;

  try {
    await new Service({
      cwd: process.cwd(),
    }).run({
      name: command,
      args,
    });
  } catch (e: any) {
    logger.fatal(e);
    process.exit(1);
  }
}
