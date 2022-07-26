import * as logger from "./logger";
import updatePackageJSON from "./updatePackageJSON";
import generateFile from "./Generator/generateFile";
import prompts from "prompts";
import yParser from "yargs-parser";

export * from "./randomColor";

export { logger, updatePackageJSON, generateFile, prompts, yParser };
