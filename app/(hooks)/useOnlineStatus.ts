import { useSyncExternalStore } from "react";

const subscribe = (cb: () => void) => {
  window.addEventListener("online", cb);
  window.addEventListener("offline", cb);
  return () => {
    window.removeEventListener("online", cb);
    window.removeEventListener("offline", cb);
  }
}

const getSnapshot = () => navigator.onLine;
const getServerSnapshot = () => true;

export const useOnlineStatus = () => {
  const isOnline = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )
  return isOnline;
}