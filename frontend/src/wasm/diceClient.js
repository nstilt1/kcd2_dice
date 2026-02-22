let loadingPromise = null;
let loadedModule = null;

export async function loadDiceWasm() {
  if (loadedModule) return loadedModule;
  if (typeof window === "undefined") throw new Error("loadDiceWasm() called during SSR");

  if (!loadingPromise) {
    loadingPromise = (async () => {
      // Load the glue as a real URL from /public (no bundling)
      const mod = await import(/* webpackIgnore: true */ "/wasm/dice/dice.js");

      // Ensure it loads the matching wasm (also in /public)
      await mod.default("/wasm/dice/dice_bg.wasm");

      // Start rayon workers
      await mod.initThreadPool(navigator.hardwareConcurrency || 4);

      loadedModule = mod;
      return mod;
    })().catch((e) => {
      loadingPromise = null;
      throw e;
    });
  }

  return loadingPromise;
}