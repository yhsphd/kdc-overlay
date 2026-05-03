// "undefined" means the URL will be computed from the `window.location` object
export const rootUrl = import.meta.env.PROD ? "" : "http://localhost:3000";

export function secondsToMMSS(seconds) {
  if (!seconds) return "00:00";
  return new Date(seconds * 1000).toISOString().substring(14, 19);
}

export function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

export function teamName2color(overlayData, mode, name) {
  let names;

  if (mode === 0) {
    // Team Name
    names = [overlayData.teams[0].name, overlayData.teams[1].name];
  } else if (mode === 1) {
    // Team Acronym
    names = [overlayData.teams[0].acronym, overlayData.teams[1].acronym];
  }

  if (name === names[0]) {
    return "red";
  } else if (name === names[1]) {
    return "blue";
  }
  return "";
}

export function teamName2acronym(overlayData, name) {
  for (let i = 0; i < overlayData.teams.length; i++) {
    if (overlayData.teams[i].name === name) {
      return overlayData.teams[i].acronym;
    }
  }
  return "";
}

export function getMappool(mappool, code) {
  for (let i = 0; i < mappool.length; i++) {
    if (mappool[i].code === code) {
      return mappool[i];
    }
  }
  return {};
}

export function rankDuplicate(arr) {
  const sorted = [...new Set(arr)].sort((a, b) => b - a);
  const rank = new Map(sorted.map((x, i) => [x, i + 1]));
  return arr.map((x) => rank.get(x));
}

export function splitCode(code) {
  const mod = code.match(/[a-zA-Z]+/g)[0];
  const index = code.match(/\d+/g);
  return [mod, index ? parseInt(index) : 1];
}
