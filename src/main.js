const core = require('@actions/core');
const os = require('os');
const installer = require('./installer');

async function run() {
  try {
    const version = core.getInput('version', { required: true });
    let osArchitecture = core.getInput('architecture');
    const useRedgateUrl = core.getInput('use-redgate-url') == 'true';

    if (!osArchitecture) {
      osArchitecture = os.arch();
    }

    await installer.getFlyway(version, osArchitecture, useRedgateUrl);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
