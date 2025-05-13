import { io } from "socket.io-client";

const socket = io("http://localhost:3002");

export const listenToModDownloads = (mods, stats) => {
  socket.on("modDownloaded", (downloaded) => {
    console.log("Mod descargado:", downloaded);

    // Buscar el mod por ID y actualizar las descargas
    const mod = mods.value.find(m => m.id === downloaded.id);
    if (mod) {
      mod.downloads = downloaded.downloads;

      stats.value.totalDownloads++
    }
  });
};

export const listenToModDownloads2 = (mod) => {
  socket.on("modDownloaded", (downloaded) => {
    console.log("Mod descargado:", downloaded);
  
    // Buscar el mod por ID y actualizar las descargas
    mod.value.downloads = downloaded.downloads;
  });
};

export const listenToComments = (comments) => {
  socket.off('updateComments');
  socket.on('updateComments', (newComments) => {
    console.log('Nuevos comentarios recibido:', newComments);
    comments.value = newComments.allComments;
  });
};

export const listenToLikes = (likes) => {
  socket.off('updateLikes');
  socket.on("updateLikes", (newLikes) => {
    console.log("Nuevo likes recibido:", newLikes);
  
    // Buscar el mod por ID y actualizar las descargas
    likes.value = newLikes.allLikes;
  });
}