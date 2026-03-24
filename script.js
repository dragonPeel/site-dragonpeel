document.addEventListener("DOMContentLoaded", () => {

  console.log("script loaded");

  const fallbackImage = "fallback/dragonTrans_fallback.png";
  const fallbackColor = "#f97316";

  fetch('dragonSwap.json')
    .then(res => res.json())
    .then(data => {

      const imgEl = document.getElementById("randomImage");

      const setFallback = () => {
        console.log("Using fallback dragon");
        imgEl.src = fallbackImage;
        document.documentElement.style.setProperty("--dragon-color", fallbackColor);
      };

      const dragons = data.dragons;

      // 🛑 JSON empty or invalid
      if (!dragons || dragons.length === 0) {
        console.log("No dragons found");
        setFallback();
        return;
      }

      const dragon = dragons[Math.floor(Math.random() * dragons.length)];

      const fullPath = "Images/detail_dragon/" + dragon.file;
      imgEl.src = fullPath + "?v=" + Date.now();

      console.log("Selected dragon:", dragon.file);
      console.log("Using color:", dragon.color);

      // 🎨 apply color (with safety)
      if (dragon.color) {
        document.documentElement.style.setProperty("--dragon-color", dragon.color);
      } else {
        console.log("Missing color, using fallback color");
        document.documentElement.style.setProperty("--dragon-color", fallbackColor);
      }

      // ❌ image fails to load
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