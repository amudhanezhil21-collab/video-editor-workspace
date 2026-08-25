import React from "react";
import { Composition, Still } from "remotion";
import { W, H } from "./tokens";
import { Type1, Type2, Type3, Type4, Type5, Type6, Type7, Type8 } from "./stills";
import { FullVideo } from "./FullVideo/FullVideo";
import { FIXED } from "./FullVideo/timeline";

export const Root: React.FC = () => (
  <>
    <Composition
      id="FullVideo"
      component={FullVideo}
      width={W}
      height={H}
      fps={FIXED.fps}
      durationInFrames={FIXED.totalFrames}
    />
    <Still id="Type1-creator-text" component={Type1} width={W} height={H} />
    <Still id="Type2-creator-mg" component={Type2} width={W} height={H} />
    <Still id="Type3-creator-text-mg" component={Type3} width={W} height={H} />
    <Still id="Type4-only-text" component={Type4} width={W} height={H} />
    <Still id="Type5-only-mg" component={Type5} width={W} height={H} />
    <Still id="Type6-mg-text" component={Type6} width={W} height={H} />
    <Still id="Type7-broll-ai" component={Type7} width={W} height={H} />
    <Still id="Type8-broll-real" component={Type8} width={W} height={H} />
  </>
);
