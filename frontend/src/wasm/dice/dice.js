import { startWorkers } from './snippets/wasm-bindgen-rayon-38edf6e439f6d70d/src/workerHelpers.js';

/**
 * Result of a brute force search for the best dice threshold and target score.
 */
export class BruteForceResult {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(BruteForceResult.prototype);
        obj.__wbg_ptr = ptr;
        BruteForceResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BruteForceResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_bruteforceresult_free(ptr, 0);
    }
    /**
     * Gets the best dice threshold for maximizing the mean score.
     * @returns {number}
     */
    get best_mean_dice_threshold() {
        const ret = wasm.bruteforceresult_best_mean_dice_threshold(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Gets the best target score for maximizing the mean score.
     * @returns {number}
     */
    get best_mean_target_score() {
        const ret = wasm.bruteforceresult_best_mean_target_score(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Gets the sorted results for the best target score and dice threshold for maximizing the mean score.
     * @returns {SimulationResult}
     */
    get best_mean_target_score_results() {
        const ret = wasm.bruteforceresult_best_mean_target_score_results(this.__wbg_ptr);
        return SimulationResult.__wrap(ret);
    }
    /**
     * Gets the best dice threshold for maximizing the median score.
     * @returns {number}
     */
    get best_median_dice_threshold() {
        const ret = wasm.bruteforceresult_best_median_dice_threshold(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Gets the best target score for maximizing the median score.
     * @returns {number}
     */
    get best_median_target_score() {
        const ret = wasm.bruteforceresult_best_median_target_score(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Gets the sorted results for the best target score and dice threshold for maximizing the median score.
     * @returns {SimulationResult}
     */
    get best_median_target_score_results() {
        const ret = wasm.bruteforceresult_best_median_target_score_results(this.__wbg_ptr);
        return SimulationResult.__wrap(ret);
    }
}
if (Symbol.dispose) BruteForceResult.prototype[Symbol.dispose] = BruteForceResult.prototype.free;

export class DoubleSimulationResult {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DoubleSimulationResult.prototype);
        obj.__wbg_ptr = ptr;
        DoubleSimulationResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DoubleSimulationResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_doublesimulationresult_free(ptr, 0);
    }
    /**
     * Returns the maximum possible scores without passing with this die.
     * @returns {SimulationResult}
     */
    get max_possible_scores() {
        const ret = wasm.doublesimulationresult_max_possible_scores(this.__wbg_ptr);
        return SimulationResult.__wrap(ret);
    }
    /**
     * Returns the maximum possible scores while passing when the conditions are met.
     * @returns {SimulationResult}
     */
    get max_scores_with_conditional_pass() {
        const ret = wasm.doublesimulationresult_max_scores_with_conditional_pass(this.__wbg_ptr);
        return SimulationResult.__wrap(ret);
    }
}
if (Symbol.dispose) DoubleSimulationResult.prototype[Symbol.dispose] = DoubleSimulationResult.prototype.free;

export class Roll {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Roll.prototype);
        obj.__wbg_ptr = ptr;
        RollFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RollFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_roll_free(ptr, 0);
    }
    /**
     * Gets the number of dice for this roll.
     * @returns {number}
     */
    get num_dice() {
        const ret = wasm.roll_num_dice(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Gets the probability of busting for this roll.
     * @returns {number}
     */
    get p_bust() {
        const ret = wasm.roll_p_bust(this.__wbg_ptr);
        return ret;
    }
    /**
     * Gets the probability of scoring for this roll.
     * @returns {number}
     */
    get p_score() {
        const ret = wasm.roll_p_score(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) Roll.prototype[Symbol.dispose] = Roll.prototype.free;

/**
 * A simulation result.
 */
export class SimulationResult {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SimulationResult.prototype);
        obj.__wbg_ptr = ptr;
        SimulationResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SimulationResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_simulationresult_free(ptr, 0);
    }
    /**
     * Gets the maximum score of this simulation.
     * @returns {number}
     */
    get maximum() {
        const ret = wasm.simulationresult_maximum(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Gets the mean of this simulation.
     * @returns {number}
     */
    get mean() {
        const ret = wasm.roll_p_score(this.__wbg_ptr);
        return ret;
    }
    /**
     * Gets the median score of this simulation.
     * @returns {number}
     */
    get median() {
        const ret = wasm.roll_p_bust(this.__wbg_ptr);
        return ret;
    }
    /**
     * Gets the minimum score of this simulation.
     * @returns {number}
     */
    get minimum() {
        const ret = wasm.roll_num_dice(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Gets the sorted results of this simulation.
     * @returns {Uint32Array}
     */
    get results() {
        const ret = wasm.simulationresult_results(this.__wbg_ptr);
        var v1 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
}
if (Symbol.dispose) SimulationResult.prototype[Symbol.dispose] = SimulationResult.prototype.free;

export class StatsResult {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(StatsResult.prototype);
        obj.__wbg_ptr = ptr;
        StatsResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StatsResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_statsresult_free(ptr, 0);
    }
    /**
     * @returns {Roll[]}
     */
    get roll_probabilities() {
        const ret = wasm.statsresult_roll_probabilities(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
}
if (Symbol.dispose) StatsResult.prototype[Symbol.dispose] = StatsResult.prototype.free;

/**
 * @param {string} seed_txt
 * @param {string} rng_type
 * @param {number} num_throws
 * @param {number} prob_1
 * @param {number} prob_2
 * @param {number} prob_3
 * @param {number} prob_4
 * @param {number} prob_5
 * @param {number} prob_6
 * @param {number} dice_threshold
 * @param {number} min_score
 * @param {boolean} run_max_score_simulation
 * @param {number} target_score
 * @returns {DoubleSimulationResult}
 */
export function analyze_dice(seed_txt, rng_type, num_throws, prob_1, prob_2, prob_3, prob_4, prob_5, prob_6, dice_threshold, min_score, run_max_score_simulation, target_score) {
    const ptr0 = passStringToWasm0(seed_txt, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(rng_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.analyze_dice(ptr0, len0, ptr1, len1, num_throws, prob_1, prob_2, prob_3, prob_4, prob_5, prob_6, dice_threshold, min_score, run_max_score_simulation, target_score);
    return DoubleSimulationResult.__wrap(ret);
}

/**
 * @param {string} seed_txt
 * @param {string} rng_type
 * @param {number} num_turns
 * @param {number} prob_1
 * @param {number} prob_2
 * @param {number} prob_3
 * @param {number} prob_4
 * @param {number} prob_5
 * @param {number} prob_6
 * @returns {BruteForceResult}
 */
export function brute_force(seed_txt, rng_type, num_turns, prob_1, prob_2, prob_3, prob_4, prob_5, prob_6) {
    const ptr0 = passStringToWasm0(seed_txt, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(rng_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.brute_force(ptr0, len0, ptr1, len1, num_turns, prob_1, prob_2, prob_3, prob_4, prob_5, prob_6);
    return BruteForceResult.__wrap(ret);
}

/**
 * @param {number} prob_1
 * @param {number} prob_2
 * @param {number} prob_3
 * @param {number} prob_4
 * @param {number} prob_5
 * @param {number} prob_6
 * @returns {StatsResult}
 */
export function dice_stats(prob_1, prob_2, prob_3, prob_4, prob_5, prob_6) {
    const ret = wasm.dice_stats(prob_1, prob_2, prob_3, prob_4, prob_5, prob_6);
    return StatsResult.__wrap(ret);
}

/**
 * @param {number} num_threads
 * @returns {Promise<any>}
 */
export function initThreadPool(num_threads) {
    const ret = wasm.initThreadPool(num_threads);
    return ret;
}

export class wbg_rayon_PoolBuilder {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(wbg_rayon_PoolBuilder.prototype);
        obj.__wbg_ptr = ptr;
        wbg_rayon_PoolBuilderFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        wbg_rayon_PoolBuilderFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wbg_rayon_poolbuilder_free(ptr, 0);
    }
    build() {
        wasm.wbg_rayon_poolbuilder_build(this.__wbg_ptr);
    }
    /**
     * @returns {number}
     */
    numThreads() {
        const ret = wasm.wbg_rayon_poolbuilder_numThreads(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    receiver() {
        const ret = wasm.wbg_rayon_poolbuilder_receiver(this.__wbg_ptr);
        return ret >>> 0;
    }
}
if (Symbol.dispose) wbg_rayon_PoolBuilder.prototype[Symbol.dispose] = wbg_rayon_PoolBuilder.prototype.free;

/**
 * @param {number} receiver
 */
export function wbg_rayon_start_worker(receiver) {
    wasm.wbg_rayon_start_worker(receiver);
}

function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg___wbindgen_is_undefined_9e4d92534c42d778: function(arg0) {
            const ret = arg0 === undefined;
            return ret;
        },
        __wbg___wbindgen_memory_bd1fbcf21fbef3c8: function() {
            const ret = wasm.memory;
            return ret;
        },
        __wbg___wbindgen_module_f6b8052d79c1cc16: function() {
            const ret = wasmModule;
            return ret;
        },
        __wbg___wbindgen_throw_be289d5034ed271b: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbg_call_389efe28435a9388: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.call(arg1);
            return ret;
        }, arguments); },
        __wbg_instanceof_Window_ed49b2db8df90359: function(arg0) {
            let result;
            try {
                result = arg0 instanceof Window;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_new_no_args_1c7c842f08d00ebb: function(arg0, arg1) {
            const ret = new Function(getStringFromWasm0(arg0, arg1));
            return ret;
        },
        __wbg_roll_new: function(arg0) {
            const ret = Roll.__wrap(arg0);
            return ret;
        },
        __wbg_startWorkers_2ca11761e08ff5d5: function(arg0, arg1, arg2) {
            const ret = startWorkers(arg0, arg1, wbg_rayon_PoolBuilder.__wrap(arg2));
            return ret;
        },
        __wbg_static_accessor_GLOBAL_12837167ad935116: function() {
            const ret = typeof global === 'undefined' ? null : global;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_static_accessor_GLOBAL_THIS_e628e89ab3b1c95f: function() {
            const ret = typeof globalThis === 'undefined' ? null : globalThis;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_static_accessor_SELF_a621d3dfbb60d0ce: function() {
            const ret = typeof self === 'undefined' ? null : self;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_static_accessor_WINDOW_f8727f0cf888e0bd: function() {
            const ret = typeof window === 'undefined' ? null : window;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_externrefs;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
        },
    };
    return {
        __proto__: null,
        "./dice_bg.js": import0,
    };
}

const BruteForceResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_bruteforceresult_free(ptr >>> 0, 1));
const DoubleSimulationResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_doublesimulationresult_free(ptr >>> 0, 1));
const RollFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_roll_free(ptr >>> 0, 1));
const SimulationResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_simulationresult_free(ptr >>> 0, 1));
const StatsResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_statsresult_free(ptr >>> 0, 1));
const wbg_rayon_PoolBuilderFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wbg_rayon_poolbuilder_free(ptr >>> 0, 1));

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_externrefs.get(mem.getUint32(i, true)));
    }
    wasm.__externref_drop_slice(ptr, len);
    return result;
}

function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedUint32ArrayMemory0 = null;
function getUint32ArrayMemory0() {
    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
        cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32ArrayMemory0;
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasm;
function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    wasmModule = module;
    cachedDataViewMemory0 = null;
    cachedUint32ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('dice_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
