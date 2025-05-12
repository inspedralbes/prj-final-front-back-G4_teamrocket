import { io } from "socket.io-client";

const socket = io("http://localhost:3002");

export const functionSocket = (mods, stats) => {
  socket.on("modDownloaded", (downloaded) => {
    console.log("Mod descargado:", downloaded);

    // Buscar el mod por ID y actualizar las descargas
    const mod = mods.find(m => m.id === downloaded.id);
    if (mod) {
      mod.downloads = downloaded.downloads;
    }
  });
};

export const functionSocket2 = (mod) => {
    socket.on("modDownloaded", (downloaded) => {
      console.log("Mod descargado:", downloaded);
  
      // Buscar el mod por ID y actualizar las descargas
      mod.downloads = downloaded.downloads;
    });
};