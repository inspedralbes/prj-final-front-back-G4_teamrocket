import { io } from "socket.io-client";

const socket = io("https://darknessunseen.dam.inspedralbes.cat");

export const listenToModDownloads = (mods, stats) => {
  socket.on("modDownloaded", (downloaded) => {
    const mod = mods.value.find(m => m.id === downloaded.id);
    if (mod) {
      mod.downloads = downloaded.downloads;
      stats.value.totalDownloads++
    }
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