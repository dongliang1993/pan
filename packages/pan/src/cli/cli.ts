import { yParser, logger } from "@lilith-plat/utils";
import { Service } from "../service/service";
import { MIN_NODE_VERSION } from "../constants";

/**
 * 检查 node 版本，最低支持 14
 */
export function checkNodeVersion() {
  const v = parseInt(process.version.slice(1));

  if (v < MIN_NODE_VERSION) {
    logger.error(
      `Your node version ${v} is not supported, please upgrade to ${MIN_NODE_VERSION} or above.`
    );
    process.exit(1);
  }
}

export async function run() {
  checkNodeVersion();

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
