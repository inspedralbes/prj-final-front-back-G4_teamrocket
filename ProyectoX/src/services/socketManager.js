import { io } from "socket.io-client";

const socket = io("http://localhost:3002");

export const listenToModDownloads = (mods, stats) => {
  socket.on("modDownloaded", (downloaded) => {
    const mod = mods.value.find(m => m.id === downloaded.id);
    if (mod) {
      mod.downloads = downloaded.downloads;
      stats.value.totalDownloads++
    }
  });
}

export const listenToModDownloads2 = (mod, initChart) => {
  socket.on("modDailyDownloadsUpdated", (downloaded) => {
    mod.value.downloads += 1;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < mod.value.statsDailyDownloadsMods.length; i++) {
      const statDate = new Date(mod.value.statsDailyDownloadsMods[i].date);
      statDate.setHours(0, 0, 0, 0);

      if (statDate.getTime() === today.getTime()) {
        mod.value.statsDailyDownloadsMods[i].totalDownloads = downloaded.totalDownloads;
      }
    }

    console.log(mod.value.statsDailyDownloadsMods);

    initChart();
  });
}

export const listenToComments = (comments) => {
  socket.off('updateComments');
  socket.on('updateComments', (newComments) => {
    comments.value = newComments.allComments;
  });
}

export const listenToLikes = (likes) => {
  socket.off('updateLikes');
  socket.on('updateLikes', (newLikes) => {
    likes.value = newLikes.allLikes;
  });
}

export const listenNewUserAdmin = (users) => {
  socket.off('newUser');
  socket.on('newUser', (newListUsers) => {
    users.value.splice(0, users.value.length, ...newListUsers);
  });
}

export const listenChangeSecurityModAdmin = (mods) => {
  socket.off('updateSecurity');
  socket.on('updateSecurity', (newSecurity) => {
    const mod = mods.value.find(m => m.id === newSecurity.modId);
    if (mod) {
      mod.security = newSecurity.security;
    }
  });
};

export const listenNewModsAdmin = (mods) => {
  socket.off('newMod');
  socket.on('newMod', (newListMods) => {
    mods.value.splice(0, mods.value.length, ...newListMods);
  });
}