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
        const ret = wasm.simulationresult_mean(this.__wbg_ptr);
        return ret;
    }
    /**
     * Gets the median score of this simulation.
     * @returns {number}
     */
    get median() {
        const ret = wasm.simulationresult_median(this.__wbg_ptr);
        return ret;
    }
    /**
     * Gets the minimum score of this simulation.
     * @returns {number}
     */
    get minimum() {
        const ret = wasm.simulationresult_minimum(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Gets the sorted results of this simulation.
     * @returns {Uint32Array}
     */
    get results() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.simulationresult_results(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU32FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export4(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
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
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.statsresult_roll_probabilities(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_export4(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
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
    const ptr0 = passStringToWasm0(seed_txt, wasm.__wbindgen_export2, wasm.__wbindgen_export3);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(rng_type, wasm.__wbindgen_export2, wasm.__wbindgen_export3);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.analyze_dice(ptr0, len0, ptr1, len1, num_throws, prob_1, prob_2, prob_3, prob_4, prob_5, prob_6, dice_threshold, min_score, run_max_score_simulation, target_score);
    return DoubleSimulationResult.__wrap(ret);
}

/**
 * Brute force search for the best dice threshold and target score to maximize
 * the mean and median scores, respectively.
 * @param {string} seed_txt
 * @param {string} rng_type
 * @param {number} num_turns
 * @param {number} max_score
 * @param {number} prob_1
 * @param {number} prob_2
 * @param {number} prob_3
 * @param {number} prob_4
 * @param {number} prob_5
 * @param {number} prob_6
 * @returns {BruteForceResult}
 */
export function brute_force(seed_txt, rng_type, num_turns, max_score, prob_1, prob_2, prob_3, prob_4, prob_5, prob_6) {
    const ptr0 = passStringToWasm0(seed_txt, wasm.__wbindgen_export2, wasm.__wbindgen_export3);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(rng_type, wasm.__wbindgen_export2, wasm.__wbindgen_export3);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.brute_force(ptr0, len0, ptr1, len1, num_turns, max_score, prob_1, prob_2, prob_3, prob_4, prob_5, prob_6);
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
    return takeObject(ret);
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

function __wbg_get_imports(memory) {
    const import0 = {
        __proto__: null,
        __wbg___wbindgen_is_undefined_9e4d92534c42d778: function(arg0) {
            const ret = getObject(arg0) === undefined;
            return ret;
        },
        __wbg___wbindgen_memory_bd1fbcf21fbef3c8: function() {
            const ret = wasm.memory;
            return addHeapObject(ret);
        },
        __wbg___wbindgen_module_f6b8052d79c1cc16: function() {
            const ret = wasmModule;
            return addHeapObject(ret);
        },
        __wbg___wbindgen_throw_be289d5034ed271b: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbg_call_389efe28435a9388: function() { return handleError(function (arg0, arg1) {
            const ret = getObject(arg0).call(getObject(arg1));
            return addHeapObject(ret);
        }, arguments); },
        __wbg_instanceof_Window_ed49b2db8df90359: function(arg0) {
            let result;
            try {
                result = getObject(arg0) instanceof Window;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_new_no_args_1c7c842f08d00ebb: function(arg0, arg1) {
            const ret = new Function(getStringFromWasm0(arg0, arg1));
            return addHeapObject(ret);
        },
        __wbg_roll_new: function(arg0) {
            const ret = Roll.__wrap(arg0);
            return addHeapObject(ret);
        },
        __wbg_startWorkers_2ca11761e08ff5d5: function(arg0, arg1, arg2) {
            const ret = startWorkers(takeObject(arg0), takeObject(arg1), wbg_rayon_PoolBuilder.__wrap(arg2));
            return addHeapObject(ret);
        },
        __wbg_static_accessor_GLOBAL_12837167ad935116: function() {
            const ret = typeof global === 'undefined' ? null : global;
            return isLikeNone(ret) ? 0 : addHeapObject(ret);
        },
        __wbg_static_accessor_GLOBAL_THIS_e628e89ab3b1c95f: function() {
            const ret = typeof globalThis === 'undefined' ? null : globalThis;
            return isLikeNone(ret) ? 0 : addHeapObject(ret);
        },
        __wbg_static_accessor_SELF_a621d3dfbb60d0ce: function() {
            const ret = typeof self === 'undefined' ? null : self;
            return isLikeNone(ret) ? 0 : addHeapObject(ret);
        },
        __wbg_static_accessor_WINDOW_f8727f0cf888e0bd: function() {
            const ret = typeof window === 'undefined' ? null : window;
            return isLikeNone(ret) ? 0 : addHeapObject(ret);
        },
        __wbindgen_object_clone_ref: function(arg0) {
            const ret = getObject(arg0);
            return addHeapObject(ret);
        },
        __wbindgen_object_drop_ref: function(arg0) {
            takeObject(arg0);
        },
        memory: memory || new WebAssembly.Memory({initial:18,maximum:4096,shared:true}),
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

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(takeObject(mem.getUint32(i, true)));
    }
    return result;
}

function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer !== wasm.memory.buffer) {
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
    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.buffer !== wasm.memory.buffer) {
        cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32ArrayMemory0;
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.buffer !== wasm.memory.buffer) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getObject(idx) { return heap[idx]; }

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_export(addHeapObject(e));
    }
}

let heap = new Array(128).fill(undefined);
heap.push(undefined, null, true, false);

let heap_next = heap.length;

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

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : undefined);
if (cachedTextDecoder) cachedTextDecoder.decode();

const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().slice(ptr, ptr + len));
}

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder() : undefined);

if (cachedTextEncoder) {
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
function __wbg_finalize_init(instance, module, thread_stack_size) {
    wasm = instance.exports;
    wasmModule = module;
    cachedDataViewMemory0 = null;
    cachedUint32ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    if (typeof thread_stack_size !== 'undefined' && (typeof thread_stack_size !== 'number' || thread_stack_size === 0 || thread_stack_size % 65536 !== 0)) {
        throw 'invalid stack size';
    }
    wasm.__wbindgen_start(thread_stack_size);
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

function initSync(module, memory) {
    if (wasm !== undefined) return wasm;

    let thread_stack_size
    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module, memory, thread_stack_size} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports(memory);
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module, thread_stack_size);
}

async function __wbg_init(module_or_path, memory) {
    if (wasm !== undefined) return wasm;

    let thread_stack_size
    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path, memory, thread_stack_size} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('dice_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports(memory);

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module, thread_stack_size);
}

export { initSync, __wbg_init as default };
