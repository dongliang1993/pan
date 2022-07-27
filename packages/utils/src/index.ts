import * as logger from "./logger";
import updatePackageJSON from "./updatePackageJSON";
import generateFile from "./Generator/generateFile";
import prompts from "prompts";
import yParser from "yargs-parser";
import resolve from "resolve";

export * from "./randomColor";
export * from "./winPath";

export { logger, updatePackageJSON, generateFile, prompts, yParser, resolve };
