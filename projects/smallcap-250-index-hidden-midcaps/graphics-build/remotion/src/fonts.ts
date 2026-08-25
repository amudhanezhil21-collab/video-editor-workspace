import {continueRender, delayRender, staticFile} from 'remotion';

let loaded = false;
export const loadFonts = () => {
  if (loaded) return;
  loaded = true;
  const h = delayRender('fonts');
  const defs: [string, string, number][] = [
    ['InterTight', 'fonts/InterTight-Regular.ttf', 400],
    ['InterTight', 'fonts/InterTight-Medium.ttf', 500],
    ['InterTight', 'fonts/InterTight-SemiBold.ttf', 600],
    ['InterTight', 'fonts/InterTight-Bold.ttf', 700],
    ['InterTight', 'fonts/InterTight-ExtraBold.ttf', 800],
    ['IvyPresto', 'fonts/Ivy-Presto-Display-.otf', 400],
    ['IvyPresto', 'fonts/Ivy-Presto-Display-Semi-Bold.otf', 600],
  ];
  Promise.all(
    defs.map(([family, file, weight]) => {
      const f = new FontFace(family, `url(${staticFile(file)})`, {weight: String(weight)});
      return f.load().then((l) => {(document.fonts as any).add(l);});
    })
  ).then(() => continueRender(h)).catch(() => continueRender(h));
};
