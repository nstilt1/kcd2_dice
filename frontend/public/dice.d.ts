/* tslint:disable */
/* eslint-disable */

/**
 * Result of a brute force search for the best dice threshold and target score.
 */
export class BruteForceResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Gets the best dice threshold for maximizing the mean score.
     */
    readonly best_mean_dice_threshold: number;
    /**
     * Gets the best target score for maximizing the mean score.
     */
    readonly best_mean_target_score: number;
    /**
     * Gets the sorted results for the best target score and dice threshold for maximizing the mean score.
     */
    readonly best_mean_target_score_results: SimulationResult;
    /**
     * Gets the best dice threshold for maximizing the median score.
     */
    readonly best_median_dice_threshold: number;
    /**
     * Gets the best target score for maximizing the median score.
     */
    readonly best_median_target_score: number;
    /**
     * Gets the sorted results for the best target score and dice threshold for maximizing the median score.
     */
    readonly best_median_target_score_results: SimulationResult;
}

export class DoubleSimulationResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Returns the maximum possible scores without passing with this die.
     */
    readonly max_possible_scores: SimulationResult;
    /**
     * Returns the maximum possible scores while passing when the conditions are met.
     */
    readonly max_scores_with_conditional_pass: SimulationResult;
}

export class Roll {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Gets the number of dice for this roll.
     */
    readonly num_dice: number;
    /**
     * Gets the probability of busting for this roll.
     */
    readonly p_bust: number;
    /**
     * Gets the probability of scoring for this roll.
     */
    readonly p_score: number;
}

/**
 * A simulation result.
 */
export class SimulationResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Gets the maximum score of this simulation.
     */
    readonly maximum: number;
    /**
     * Gets the mean of this simulation.
     */
    readonly mean: number;
    /**
     * Gets the median score of this simulation.
     */
    readonly median: number;
    /**
     * Gets the minimum score of this simulation.
     */
    readonly minimum: number;
    /**
     * Gets the sorted results of this simulation.
     */
    readonly results: Uint32Array;
}

export class StatsResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    readonly roll_probabilities: Roll[];
}

export function analyze_dice(seed_txt: string, rng_type: string, num_throws: number, prob_1: number, prob_2: number, prob_3: number, prob_4: number, prob_5: number, prob_6: number, dice_threshold: number, min_score: number, run_max_score_simulation: boolean, target_score: number): DoubleSimulationResult;

export function brute_force(seed_txt: string, rng_type: string, num_turns: number, prob_1: number, prob_2: number, prob_3: number, prob_4: number, prob_5: number, prob_6: number): BruteForceResult;

export function dice_stats(prob_1: number, prob_2: number, prob_3: number, prob_4: number, prob_5: number, prob_6: number): StatsResult;

export function initThreadPool(num_threads: number): Promise<any>;

export class wbg_rayon_PoolBuilder {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    build(): void;
    numThreads(): number;
    receiver(): number;
}

export function wbg_rayon_start_worker(receiver: number): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_bruteforceresult_free: (a: number, b: number) => void;
    readonly __wbg_doublesimulationresult_free: (a: number, b: number) => void;
    readonly __wbg_roll_free: (a: number, b: number) => void;
    readonly __wbg_simulationresult_free: (a: number, b: number) => void;
    readonly __wbg_statsresult_free: (a: number, b: number) => void;
    readonly analyze_dice: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number) => number;
    readonly brute_force: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number) => number;
    readonly bruteforceresult_best_mean_dice_threshold: (a: number) => number;
    readonly bruteforceresult_best_mean_target_score: (a: number) => number;
    readonly bruteforceresult_best_mean_target_score_results: (a: number) => number;
    readonly bruteforceresult_best_median_dice_threshold: (a: number) => number;
    readonly bruteforceresult_best_median_target_score: (a: number) => number;
    readonly bruteforceresult_best_median_target_score_results: (a: number) => number;
    readonly dice_stats: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
    readonly doublesimulationresult_max_possible_scores: (a: number) => number;
    readonly doublesimulationresult_max_scores_with_conditional_pass: (a: number) => number;
    readonly roll_num_dice: (a: number) => number;
    readonly roll_p_bust: (a: number) => number;
    readonly roll_p_score: (a: number) => number;
    readonly simulationresult_maximum: (a: number) => number;
    readonly simulationresult_results: (a: number) => [number, number];
    readonly statsresult_roll_probabilities: (a: number) => [number, number];
    readonly simulationresult_mean: (a: number) => number;
    readonly simulationresult_median: (a: number) => number;
    readonly simulationresult_minimum: (a: number) => number;
    readonly __wbg_wbg_rayon_poolbuilder_free: (a: number, b: number) => void;
    readonly initThreadPool: (a: number) => any;
    readonly wbg_rayon_poolbuilder_build: (a: number) => void;
    readonly wbg_rayon_poolbuilder_numThreads: (a: number) => number;
    readonly wbg_rayon_poolbuilder_receiver: (a: number) => number;
    readonly wbg_rayon_start_worker: (a: number) => void;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __externref_drop_slice: (a: number, b: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
