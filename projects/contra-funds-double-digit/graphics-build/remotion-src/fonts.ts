import { staticFile } from "remotion";

/** Register local Inter Tight faces. Must be awaited before any text renders. */
const FACES: [string, string][] = [
  ["InterTightBlack", "fonts/InterTight-Black.ttf"],
  ["InterTightExtraBold", "fonts/InterTight-ExtraBold.ttf"],
  ["InterTightBold", "fonts/InterTight-Bold.ttf"],
  ["InterTightSemiBold", "fonts/InterTight-SemiBold.ttf"],
  ["InterTightMedium", "fonts/InterTight-Medium.ttf"],
  ["InterTightRegular", "fonts/InterTight-Regular.ttf"],
];

let loaded: Promise<void> | null = null;

export const loadFonts = (): Promise<void> => {
  if (loaded) return loaded;
  loaded = Promise.all(
    FACES.map(async ([family, path]) => {
      const face = new FontFace(family, `url(${staticFile(path)})`);
      await face.load();
      // @ts-expect-error document.fonts is available in the render browser
      document.fonts.add(face);
    })
  ).then(() => undefined);
  return loaded;
};
