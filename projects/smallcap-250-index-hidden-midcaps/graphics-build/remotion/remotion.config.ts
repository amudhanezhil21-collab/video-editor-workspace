import {Config} from '@remotion/cli/config';
Config.setVideoImageFormat('png');
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer('angle');
Config.setConcurrency(4);
// Remotion's own headless-shell download extracts empty on this machine's APFS image;
// reuse the known-good shell already cached by hyperframes.
Config.setBrowserExecutable('/Users/ezhilamudhan/.cache/hyperframes/chrome/chrome-headless-shell/mac_arm-152.0.7928.2/chrome-headless-shell-mac-arm64/chrome-headless-shell');
