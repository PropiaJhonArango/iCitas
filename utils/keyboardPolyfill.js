import { Dimensions, Keyboard } from "react-native";

function polyfillRemoveListener(emitter, addMethod) {
  if (typeof emitter.removeListener === "function") {
    return;
  }
  if (typeof emitter[addMethod] !== "function") {
    return;
  }

  const listeners = new Map();
  const originalAdd = emitter[addMethod].bind(emitter);

  emitter[addMethod] = (eventName, handler) => {
    const subscription = originalAdd(eventName, handler);
    if (!listeners.has(eventName)) {
      listeners.set(eventName, new Map());
    }
    listeners.get(eventName).set(handler, subscription);
    return subscription;
  };

  emitter.removeListener = (eventName, handler) => {
    const byEvent = listeners.get(eventName);
    const subscription = byEvent && byEvent.get(handler);
    if (subscription) {
      subscription.remove();
      byEvent.delete(handler);
    }
  };
}

// React Native >= 0.65 quitó removeListener. React Navigation v5 todavía lo llama
// al desmontar tabs (teclado y cambio de tamaño de pantalla).
polyfillRemoveListener(Keyboard, "addListener");
polyfillRemoveListener(Dimensions, "addEventListener");
