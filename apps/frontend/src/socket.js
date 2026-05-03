import { rootUrl } from "@/assets/main.js";
import { ref } from "vue";
import { io } from "socket.io-client";
import { defineStore } from "pinia";

const URL = rootUrl + "/update";

export const socket = io(URL);

export const useOverlayDataStore = defineStore("overlayData", () => {
  const connected = ref(false);
  const data = ref({});

  function bindEvents() {
    socket.on("connect", () => {
      connected.value = true;
    });
    socket.on("disconnect", () => {
      connected.value = false;
    });
    socket.on("update", function (res) {
      Object.assign(data.value, res);
    });
  }

  function connect() {
    socket.connect();
  }

  return { connected, data, bindEvents, connect };
});
