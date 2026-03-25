document.addEventListener("DOMContentLoaded", () => {

  console.log("script loaded");

  const fallbackImage = "./fallback/dragon_fallback_trans.webp";
  const fallbackColor = "#f97316";

  fetch('./dragonConfig.json')
    .then(res => res.json())
    .then(data => {

      const segmentColor = data.config?.segment || "#e07a1a";
      document.documentElement.style.setProperty("--dragon-segment", segmentColor);

      const imgEl = document.getElementById("randomImage");

      const setFallback = () => {
        console.log("Using fallback dragon");
        imgEl.src = fallbackImage;
        document.documentElement.style.setProperty("--dragon-color", fallbackColor);
      };

      const dragons = data.dragons;

      if (!dragons || dragons.length === 0) {
        console.log("No dragons found");
        setFallback();
        return;
      }

      const dragon = dragons[Math.floor(Math.random() * dragons.length)];

      // ✅ SET BASE COLOR FIRST
       if (dragon.color) {
        document.documentElement.style.setProperty("--dragon-color", dragon.color);
      } else {
        console.log("Missing color, using fallback color");
        document.documentElement.style.setProperty("--dragon-color", fallbackColor);
      }



      // 🎨 generate dark/light here - HEX → HSL
function hexToHSL(hex) {
  let r = parseInt(hex.substr(1, 2), 16) / 255;
  let g = parseInt(hex.substr(3, 2), 16) / 255;
  let b = parseInt(hex.substr(5, 2), 16) / 255;

  let max = Math.max(r, g, b),
      min = Math.min(r, g, b);

  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return { h, s, l };
}

// 🎨 HSL → HEX
function hslToHex(h, s, l) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = x => Math.round(x * 255).toString(16).padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// 🎯 APPLY YOUR JSON RULES (NEW FIELD NAMES)
const rules = data.gradientRules[dragon.style || "default"];

const { h, s } = hexToHSL(dragon.color);

// 🌑 DARK (based on darkBrightness)
const darkColor = hslToHex(h, s, rules.darkBrightness / 100);

// 🌕 LIGHT (brightness + saturation)
const lightSaturation = Math.min(1, s + (rules.lightSaturation / 100));
const lightColor = hslToHex(h, lightSaturation, rules.lightBrightness / 100);

// 🎨 Set CSS variables (for future use)
document.documentElement.style.setProperty("--dragon-dark", darkColor);
document.documentElement.style.setProperty("--dragon-light", lightColor);

      // 🔥 NEW: build filename
      const file = `dragon_${dragon.colorKey}_${dragon.variant}.webp`;
      const fullPath = "./images/detail-dragon/" + file;

      const preload = new Image();
      preload.src = fullPath + "?v=" + Date.now();

      preload.onload = () => {
        imgEl.src = preload.src;
      };

      logDragon({
  name: dragon.dragonName,
  color: dragon.color,
  dark: darkColor,
  light: lightColor,
  segment: segmentColor,
  file
});

      imgEl.onerror = () => {
        console.log("Image failed to load");
        setFallback();
      };

    })
    .catch(err => {
      console.error("JSON load failed:", err);

      const imgEl = document.getElementById("randomImage");
      imgEl.src = fallbackImage;
      document.documentElement.style.setProperty("--dragon-color", fallbackColor);
    });

});

const DEBUG = true;

function logDragon(data) {
  if (!DEBUG) return;

  console.group(`🐉 Dragon: ${data.name}`);

  const labelStyle = "color: #333; font-weight: 500;";
  const swatch = (color) =>
    `background:${color}; padding:2px 14px; border:1px solid #ccc; border-radius:3px; margin-left:6px;`;

  console.log("%cColor:   " + data.color + "%c ", labelStyle, swatch(data.color));
  console.log("%cDark:    " + data.dark  + "%c ", labelStyle, swatch(data.dark));
  console.log("%cLight:   " + data.light + "%c ", labelStyle, swatch(data.light));
  console.log("%cSegment: " + data.segment + "%c ", labelStyle, swatch(data.segment));
  console.log("%cFile:    " + data.file, labelStyle);

  console.groupEnd();
}