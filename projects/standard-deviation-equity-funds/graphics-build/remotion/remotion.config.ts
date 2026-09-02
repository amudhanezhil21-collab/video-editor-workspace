import {Config} from '@remotion/cli/config';
Config.setVideoImageFormat('png');
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer('angle');
Config.setConcurrency(4);
// This machine (ezhilam) has ~177GB free on a normal APFS internal volume, so Remotion's own
// headless-shell download works here. The smallcap job pinned a hyperframes-cached shell under
// /Users/ezhilamudhan/... — that is the OTHER machine's home and does not exist on this one.
