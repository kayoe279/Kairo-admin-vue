/**
 * Generate additional configuration files when used for packaging. The file can be configured with some global variables, so that it can be changed directly externally without repackaging
 */
import pkg from "../../package.json";
import { getConfigFileName, getEnvConfig, getRootPath } from "../utils";
import chalk from "chalk";
import fs from "fs-extra";

const OUTPUT_DIR = "dist";
const GLOB_CONFIG_FILE_NAME = "app.config.js";

function createConfig(
  {
    configName,
    config,
    configFileName = GLOB_CONFIG_FILE_NAME
  }: { configName: string; config: any; configFileName?: string } = { configName: "", config: {} }
) {
  try {
    const windowConf = `window.${configName}`;
    // Ensure that the variable will not be modified
    const configStr = `${windowConf}=${JSON.stringify(config)};
      Object.freeze(${windowConf});
      Object.defineProperty(window, "${configName}", {
        configurable: false,
        writable: false,
      });
    `.replace(/\s/g, "");
    fs.mkdirp(getRootPath(OUTPUT_DIR));
    fs.writeFileSync(getRootPath(`${OUTPUT_DIR}/${configFileName}`), configStr);

    console.log(chalk.cyan(`✨ [${pkg.name}]`) + ` - configuration file is build successfully:`);
    console.log(chalk.gray(OUTPUT_DIR + "/" + chalk.green(configFileName)) + "\n");
  } catch (error) {
    console.log(chalk.red("configuration file configuration file failed to package:\n" + error));
  }
}

export function runBuildConfig() {
  const config = getEnvConfig();
  const configFileName = getConfigFileName(config);
  createConfig({ config, configName: configFileName });
}
