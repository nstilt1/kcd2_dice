"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loadDiceWasm } from "@/wasm/diceClient";

const DiceWasmContext = createContext({ wasm: null, error: null, loading: true });

export function DiceWasmProvider({ children }) {
  const [wasm, setWasm] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    let alive = true;

    (async () => {
        try {
        console.log("[provider] loading wasm…");
        const mod = await loadDiceWasm();
        console.log("[provider] loaded wasm keys:", Object.keys(mod));
        if (alive) setWasm(mod);
        } catch (e) {
        console.error("[provider] wasm load failed:", e);
        if (alive) setError(e);
        } finally {
        if (alive) setLoading(false);
        }
    })();

    return () => {
        alive = false;
    };
    }, []);

  const value = useMemo(() => ({ wasm, error, loading }), [wasm, error, loading]);
  return <DiceWasmContext.Provider value={value}>{children}</DiceWasmContext.Provider>;
}

export function useDiceWasm() {
  return useContext(DiceWasmContext);
}
