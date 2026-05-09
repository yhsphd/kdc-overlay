const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const parseArgs = require("minimist");

const { initializeLogger } = require("./logger");
const { initializeOsuApi } = require("./osuApi");

const { start } = require("./entry");
const { mappoolgen } = require("./scripts/mappoolgen");

const VERSION = "KDC Overlay v2026.1.0";
const HELP = `
kdc-overlay
Duo Cup: KOREA 2026 Broadcasting Tool

Usage:
  kdc-overlay                   # Runs the program.
  kdc-overlay mappoolgen        # Generates mappool.json file from mappool.csv.
  kdc-overlay -h | --help
  kdc-overlay -v | --version

Options:
  -h --help     Show this screen.
  -v --version  Show version.
`;

const argv = parseArgs(process.argv.slice(2), {
  alias: { h: "help", v: "version" },
  boolean: ["help", "version"],
});

async function entry() {
  // Help and version
  if (argv.help) {
    console.log(HELP);
    process.exit(0);
  }

  if (argv.version) {
    console.log(VERSION);
    process.exit(0);
  }

  const command = argv._[0];

  // Error out when unknown command, should be updated when adding new commands
  if (command && command !== "mappoolgen") {
    console.error(`Unknown command: ${command}`);
    console.log(HELP);
    process.exit(1);
  }

  // Main setup (always runs before any command)
  const configFilePath = path.join(process.cwd(), "config.yaml");
  const streamConfigPath = path.join(process.cwd(), "config_stream.yaml");
  const configFileExists = fs.existsSync(configFilePath);
  const streamConfigFileExists = fs.existsSync(streamConfigPath);
  const firstRun = !(configFileExists && streamConfigFileExists);

  if (firstRun) {
    if (!configFileExists) {
      fs.copyFileSync(
        path.join(__dirname, "templates/configs/config.default.yaml"),
        configFilePath
      );
      console.log("Default config file created! Please re-run the program after you complete!");
    }

    if (!streamConfigFileExists) {
      fs.copyFileSync(
        path.join(__dirname, "templates/configs/config_stream.default.yaml"),
        streamConfigPath
      );
      console.log(
        "Default streamConfig file created! Please re-run the program after you complete!"
      );
    }

    process.exit(0);
  }

  // We can load config
  const config = yaml.load(fs.readFileSync(configFilePath, { encoding: "utf8", flag: "r" }));
  config.paths = {
    configFile: configFilePath,
    streamConfig: streamConfigPath,
    mappool: path.join(process.cwd(), "mappool.json"),
    mappoolCsv: path.join(process.cwd(), "mappool.csv"),
    peopleCsv: path.join(process.cwd(), "people.csv"),
    credentials: path.join(process.cwd(), "credentials.json"),
  };

  initializeLogger(config.logLevel);
  await initializeOsuApi(config);

  // Mappoolgen script
  if (command === "mappoolgen") {
    mappoolgen();
    return;
  }

  // Main entry point when no args or command
  start(config);
}

entry();
