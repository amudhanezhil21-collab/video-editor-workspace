import React from "react";
import { Composition } from "remotion";
import { SmokeTest } from "./SmokeTest";
import { MaterialTest } from "./MaterialTest";
import { FPS, W, H } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SmokeTest"
        component={SmokeTest}
        durationInFrames={50}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{ showPlate: true }}
      />
      <Composition
        id="MaterialTest"
        component={MaterialTest}
        durationInFrames={25}
        fps={FPS}
        width={1080}
        height={1350}
      />
    </>
  );
};
