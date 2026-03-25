document.addEventListener("DOMContentLoaded", () => {

  console.log("script loaded");

  const fallbackImage = "./fallback/dragon_fallback_trans.webp";
  const fallbackColor = "#f97316";

  fetch('./dragonConfig.json')
    .then(res => res.json())
    .then(data => {

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

      // 🔥 NEW: build filename
      const file = `dragon_${dragon.colorKey}_${dragon.variant}.webp`;
      const fullPath = "./images/detail-dragon/" + file;

      const preload = new Image();
      preload.src = fullPath + "?v=" + Date.now();

      preload.onload = () => {
        imgEl.src = preload.src;
      };

      console.log("Selected dragon:", file);
      console.log("Using color:", dragon.color);

      if (dragon.color) {
        document.documentElement.style.setProperty("--dragon-color", dragon.color);
      } else {
        console.log("Missing color, using fallback color");
        document.documentElement.style.setProperty("--dragon-color", fallbackColor);
      }

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