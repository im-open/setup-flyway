const os = require('os');
const core = require('@actions/core');
const tc = require('@actions/tool-cache');
const path = require('path');
const fs = require('fs');

export async function getFlyway(versionSpec, osArch = os.arch()) {
  let osPlat = os.platform();

  // check cache
  let toolPath;
  toolPath = tc.find('flyway', versionSpec, osArch);

  // If not found in cache, download
  if (toolPath) {
    core.info(`Found in cache @ ${toolPath}`);
  } else {
    core.info(`Attempting to download ${versionSpec}...`);
    let downloadPath = '';
    let info = (await getInfoFromDist(versionSpec, osArch)) || {};

    //
    // Download from Flyway
    //
    if (!info) {
      throw new Error(
        `Unable to find Flyway version '${versionSpec}' for platform ${osPlat} and architecture ${osArch}.`
      );
    }

    core.info(`Acquiring ${info.resolvedVersion} - ${info.arch} from ${info.downloadUrl}`);
    try {
      downloadPath = await tc.downloadTool(info.downloadUrl);
    } catch (err) {
      core.error(err.message);
      throw err;
    }

    //
    // Extract
    //
    core.info('Extracting ...');
    let extPath;

    if (osPlat == 'win32') {
      extPath = await tc.extractZip(downloadPath);
      // Extracts to folder matching file name
      let nestedPath = path.join(extPath, path.basename(info.fileName, '.zip'));
      if (fs.existsSync(nestedPath)) {
        extPath = nestedPath;
      }
    } else {
      extPath = await tc.extractTar(downloadPath, undefined, ['xz', '--strip', '1']);
    }

    //
    // Install into the local tool cache - flyway extracts with a root folder that matches the fileName downloaded
    //
    core.info('Adding to the cache ...');
    toolPath = await tc.cacheDir(extPath, 'flyway', info.resolvedVersion, info.arch);
    core.info('Done');
  }

  //
  // The contents of the windows zip files are wrapped in a folder, unlike the tar.gz files
  //
  if (osPlat === 'win32') {
    toolPath = path.join(toolPath, `flyway-${versionSpec}`);
  }

  //
  // Add the appropriate paths to the PATH env var
  //
  const driversPath = path.join(toolPath, 'drivers');
  core.addPath(toolPath);
  core.addPath(driversPath);
}

async function getInfoFromDist(version, osArch = os.arch()) {
  let osPlat = os.platform();
  core.info(`Current Operating System Platform: ${osPlat}`);
  let fileName = osPlat === 'win32' ? `flyway-commandline-${version}-windows-${osArch}` : '';
  fileName =
    fileName || (osPlat === 'linux' ? `flyway-commandline-${version}-linux-${osArch}` : '');
  fileName = fileName || `flyway-commandline-${version}-macosx-x64`; // If not windows or linux, then mac
  let urlFileName = osPlat == 'win32' ? `${fileName}.zip` : `${fileName}.tar.gz`;
  let url = `https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/${version}/${urlFileName}`;

  return {
    downloadUrl: url,
    resolvedVersion: version,
    arch: osArch,
    fileName: fileName
  };
}
