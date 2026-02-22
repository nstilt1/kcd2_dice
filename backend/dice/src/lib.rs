use chacha20::{ChaCha8Rng, ChaCha12Rng, ChaCha20Rng};
use rand::Rng;
use rayon::iter::{IntoParallelIterator, ParallelIterator};
use sha2::{Digest, Sha256, digest::Output};
use statistics::{FarkleScorer, Probability, sort_mean_min_max_median};
use std::vec::Vec;
use wasm_bindgen::prelude::*;
#[cfg(target_family = "wasm")]
pub use wasm_bindgen_rayon::init_thread_pool;

const D: u64 = u32::MAX as u64 + 1;

#[wasm_bindgen]
#[cfg(target_arch = "wasm32")]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);
}

#[cfg(target_arch = "wasm32")]
#[macro_export]
macro_rules! console_log {
    ($($arg:tt)*) => {
        if false {
            let x = format!($($arg)*);
            crate::log(&x);
        }
    };
}

#[cfg(not(target_arch = "wasm32"))]
#[macro_export]
macro_rules! console_log {
    ($($arg:tt)*) => {
        if true {
            println!($($arg)*);
        }
    };
}

/// Draw a uniform integer in [0, n) using rejection sampling.
fn sample_u64_below<T: Rng>(rng: &mut T, n: u64) -> u64 {
    let range = u64::MAX - (u64::MAX % n);
    loop {
        let v = rng.next_u64();
        if v < range {
            return v % n;
        }
    }
}

pub struct Dice {
    side_probabilities: [Probability; 6],
}

impl Dice {
    /// Initializes a new dice.
    fn new(mut weights: [f64; 6]) -> Self {
        let sum = weights.iter().sum::<f64>();

        // Convert from percentages if needed
        if sum > 1.5 {
            weights.iter_mut().for_each(|x| *x /= 100.0);
        }

        // Normalize to sum to exactly 1.0
        let sum = weights.iter().sum::<f64>();
        weights.iter_mut().for_each(|x| *x /= sum);

        Self {
            side_probabilities: [
                weights[0].into(),
                weights[1].into(),
                weights[2].into(),
                weights[3].into(),
                weights[4].into(),
                weights[5].into(),
            ],
        }
    }
    /// Roll a loaded 6-sided die using integer weights derived from probabilities.
    fn roll_dice<T: Rng>(&self, rng: &mut T) -> u8 {
        let mut weights = [0u64; 6];
        for i in 0..6 {
            weights[i] = (self.side_probabilities[i].value() * (D as f64)) as u64;
        }

        let total: u64 = weights.iter().sum();

        let x = sample_u64_below(rng, total);
        let mut acc = 0u64;
        for (i, w) in weights.iter().enumerate() {
            acc += w;
            if x < acc {
                return (i + 1) as u8;
            }
        }
        6
    }
    /// Near optimal approach to dice gambling (when using 6 of the same loaded dice).
    fn check_and_score(dice: &Vec<u8>) -> (u32, usize) {
        if dice.len() == 0 {
            console_log!("!!!!!!!!!!!!dice.len() == 0");
            return (0, 6);
        }
        let mut counts = [0; 6];
        for die in dice {
            counts[(die - 1) as usize] += 1;
        }
        if dice.len() == 1 {
            match dice[0] {
                1 => (100, 0),
                5 => (50, 0),
                _ => (0, 1),
            }
        } else if dice.len() == 2 {
            match (counts[0], counts[4]) {
                (2, 0) => (200, 0),
                (1, 1) => (150, 0),
                (1, _) => (100, 1),
                (0, 2) => (100, 0),
                (0, 1) => (50, 1),
                _ => (0, 2),
            }
        } else if dice.len() == 3 {
            if dice[0] == dice[1] && dice[2] == dice[0] {
                match dice[0] {
                    1 => (1000, 0),
                    v => (v as u32 * 100, 0),
                }
            } else if dice.iter().find(|x| **x == 1).is_some() {
                (100, 2)
            } else if dice.iter().find(|x| **x == 5).is_some() {
                (50, 2)
            } else {
                (0, 3)
            }
        } else if dice.len() == 4 {
            if counts.iter().any(|&c| c == 3) {
                let three_of_a_kind_value = counts.iter().position(|&c| c == 3).unwrap() + 1;
                match three_of_a_kind_value {
                    1 => (1000 + counts[4] * 50, 1 - counts[4] as usize),
                    5 => (500 + counts[0] * 100, 1 - counts[0] as usize),
                    v => {
                        assert!(counts[0] + counts[4] <= 1, "counts[0] + counts[4] > 1 l132");
                            (
                            v as u32 * 100 + counts[0] * 100 + counts[4] * 50,
                            1 - counts[0] as usize - counts[4] as usize,
                        )
                    }
                }
            } else if counts.iter().any(|&c| c == 4) {
                let four_of_a_kind_value = counts.iter().position(|&c| c == 4).unwrap() + 1;
                match four_of_a_kind_value {
                    1 => (2000, 0),
                    v => (v as u32 * 200, 0),
                }
            } else {
                if counts[0] > 0 {
                    (100, 3)
                } else if counts[4] > 0 {
                    (50, 3)
                } else {
                    (0, 4)
                }
            }
        } else if dice.len() == 5 {
            match (
                counts[0], counts[1], counts[2], counts[3], counts[4], counts[5],
            ) {
                (1, 1, 1, 1, 1, 0) => (500, 0),
                (0, 1, 1, 1, 1, 1) => (750, 0),
                _ => {
                    if counts.iter().any(|&c| c == 3) {
                        let three_of_a_kind_value =
                            counts.iter().position(|&c| c == 3).unwrap() + 1;
                        match (three_of_a_kind_value, counts[0], counts[4]) {
                            (1, _, 2) => (1000 + 100, 0),
                            (1, _, _) => (1000, 2),
                            (5, 2, _) => (500 + 200, 0),
                            (5, _, _) => (500, 2),
                            (v, 2, _) => (v as u32 * 100 + 200, 0),
                            (v, _, 2) => (v as u32 * 100 + 100, 0),
                            (v, 1, 1) => (v as u32 * 100 + 100 + 50, 0),
                            (v, _, _) => (v as u32 * 100, 2),
                        }
                    } else if counts.iter().any(|&c| c == 4) {
                        let four_of_a_kind_value = counts.iter().position(|&c| c == 4).unwrap() + 1;
                        match four_of_a_kind_value {
                            1 => (2000 + counts[4] * 50, 1 - counts[4] as usize),
                            5 => (1000 + counts[0] * 100, 1 - counts[0] as usize),
                            v => {
                                assert!(counts[0] + counts[4] <= 1, "counts[0] + counts[4] > 1 l180");
                                (
                                    v as u32 * 200 + counts[0] * 100 + counts[4] * 50,
                                    1 - (counts[0] + counts[4]) as usize,
                                )
                            }
                        }
                    } else if counts.iter().any(|&c| c == 5) {
                        let five_of_a_kind_value = counts.iter().position(|&c| c == 5).unwrap() + 1;
                        match five_of_a_kind_value {
                            1 => (4000, 0),
                            v => (v as u32 * 200, 0),
                        }
                    } else {
                        match (counts[0] >= 1, counts[4] >= 1) {
                            (true, _) => (100, 4),
                            (false, true) => (50, 4),
                            (false, false) => (0, 5),
                        }
                    }
                }
            }
        } else if dice.len() == 6 {
            match (
                counts[0] >= 1,
                counts[1] >= 1,
                counts[2] >= 1,
                counts[3] >= 1,
                counts[4] >= 1,
                counts[5] >= 1,
            ) {
                (true, true, true, true, true, false) => (500, 0),
                (false, true, true, true, true, true) => (750, 0),
                (true, true, true, true, true, true) => (1500, 0),
                _ => {
                    if counts.iter().any(|&c| c == 3) {
                        let index_1 = counts.iter().position(|&c| c == 3).unwrap();
                        let three_of_a_kind_value =
                            counts.iter().position(|&c| c == 3).unwrap() + 1;
                        counts[index_1] = 0;
                        let index_2 = counts.iter().position(|&c| c == 3);
                        let (triple_value_2, dice_remaining) = match index_2 {
                            Some(0) => (1000, 3),
                            Some(v) => ((v + 1) as u32 * 100, 3),
                            None => (0, 6),
                        };
                        let (scored_dice, scored_dice_count) = scoreable_dice(&counts, 3);
                        let (triple_value_1, dice_consumed) = match three_of_a_kind_value {
                            1 => (1000, 3),
                            5 => (500, 3),
                            v => (v as u32 * 100 + scored_dice, 3 + scored_dice_count),
                        };
                        (
                            triple_value_1 + triple_value_2,
                            dice_remaining - dice_consumed,
                        )
                    } else if counts.iter().any(|&c| c == 4) {
                        let four_of_a_kind_value = counts.iter().position(|&c| c == 4).unwrap() + 1;
                        let (scored_dice, scored_dice_count) = scoreable_dice(&counts, 2);
                        let (combo_value, dice_consumed) = match (four_of_a_kind_value, counts[0], counts[4]) {
                            (1, _, 2) => (2000 + 2 * 50, 0),
                            (1, _, _) => (2000, 2),
                            (5, 2, _) => (1000 + 2 * 100, 0),
                            (5, _, _) => (1000, 2),
                            (v, _, _) => (
                                v as u32 * 200 + scored_dice,
                                4 + scored_dice_count,
                            ),
                        };
                        (
                            combo_value,
                            dice_consumed
                        )
                    } else if counts.iter().any(|&c| c == 5) {
                        let five_of_a_kind_value = counts.iter().position(|&c| c == 5).unwrap() + 1;
                        match five_of_a_kind_value {
                            1 => (4000 + counts[4] * 50, 1 - counts[4] as usize),
                            5 => (5 * 200 + counts[0] * 100, 1 - counts[0] as usize),
                            v => (
                                v as u32 * 200 + counts[0] * 100 + counts[4] * 50,
                                1 - (counts[0] + counts[4]) as usize,
                            ),
                        }
                    } else if counts.iter().any(|&c| c == 6) {
                        let six_of_a_kind_value = counts.iter().position(|&c| c == 6).unwrap() + 1;
                        match six_of_a_kind_value {
                            1 => (8000, 0),
                            v => (v as u32 * 400, 0),
                        }
                    } else {
                        match (counts[0] >= 1, counts[4] >= 1) {
                            (true, _) => (100, 5),
                            (false, true) => (50, 5),
                            (false, false) => (0, 6),
                        }
                    }
                }
            }
        } else {
            panic!("More than 6 dice")
        }
    }
}

/// Counts scoreable dice (1s and 5s), summing their score and returning how many dice scored.
fn scoreable_dice(counts: &[u32; 6], num_dice: usize) -> (u32, usize) {
    let n = counts[0] + counts[4];
    if n as usize == num_dice && counts[0] < 3 && counts[4] < 3 {
        (
            counts[0] * 100 + counts[4] * 50,
            counts[0] as usize + counts[4] as usize,
        )
    } else {
        (0, 0)
    }
}

macro_rules! impl_chacha_trait {
    ($($chacha:ty),*) => {
        trait ChaCha: Rng {
            fn set_stream(&mut self, stream: u64);
        }
        $(
            impl ChaCha for $chacha {
                fn set_stream(&mut self, stream: u64) {
                    self.set_stream(stream);
                }
            }
        )*
    };
}

impl_chacha_trait!(ChaCha8Rng, ChaCha12Rng, ChaCha20Rng);

fn run_simulation(seed_arr: &Output<Sha256>, dice: &Dice, num_simulations: usize, rng_type: &str, max_dice: usize, min_score: u32, run_max_score_simulation: bool, target_score: u32) -> (Vec<u32>, Vec<u32>) {
    let seed = seed_arr.as_ptr();
    let mut rng: Box<dyn ChaCha> = match rng_type {
        "ChaCha8Rng" => Box::new(ChaCha8Rng::seed_from_ptr(seed)),
        "ChaCha12Rng" => Box::new(ChaCha12Rng::seed_from_ptr(seed)),
        "ChaCha20Rng" => Box::new(ChaCha20Rng::seed_from_ptr(seed)),
        _ => Box::new(ChaCha8Rng::seed_from_ptr(seed)),
    };
    for i in 0..10 {
        console_log!("next_u64({}) = {}", i, rng.next_u64());
    }
    let mut results = Vec::new();
    let mut throw = Vec::with_capacity(6);
    if run_max_score_simulation {
        results = vec![0; num_simulations];
        for i in 0..num_simulations {
            let mut score = 0;
            let mut num_dice = 6;
            loop {
                // roll dice
                throw.resize(num_dice, 8);
                for d in 0..num_dice {
                    throw[d] = dice.roll_dice(&mut rng);
                }
                let (throw_score, remaining_dice) = Dice::check_and_score(&throw);
                console_log!("throw={:?}, score={}, remaining={}", throw, throw_score, remaining_dice);
                if throw_score == 0 {
                    results[i] = score;
                    break;
                }
                score += throw_score;
                num_dice = if remaining_dice == 0 {
                    6
                } else {
                    remaining_dice
                };
            }
        }
    }
    rng.set_stream(1);
    let mut results_with_pass = Vec::with_capacity(num_simulations);
    for _ in 0..num_simulations {
        let mut score = 0;
        let mut num_dice = 6;
        loop {
            // roll dice
            throw.resize(num_dice, 8);
            for d in 0..num_dice {
                throw[d] = dice.roll_dice(&mut rng);
            }
            let (throw_score, remaining_dice) = Dice::check_and_score(&throw);
            console_log!("throw={:?}, score={}, remaining={}", throw, throw_score, remaining_dice);
            if throw_score == 0 {
                results_with_pass.push(0);
                break;
            }
            score += throw_score;
            num_dice = if remaining_dice == 0 {
                6
            } else {
                remaining_dice
            };
            if num_dice <= max_dice && score >= min_score {
                results_with_pass.push(score);
                break;
            }
            if score >= target_score {
                results_with_pass.push(score);
                break;
            }
        }
    }
    (results, results_with_pass)
}

#[wasm_bindgen]
pub struct DoubleSimulationResult {
    max_possible_scores: SimulationResult,
    max_scores_with_conditional_pass: SimulationResult,
}

#[wasm_bindgen]
impl DoubleSimulationResult {
    /// Returns the maximum possible scores without passing with this die.
    #[wasm_bindgen(getter)]
    pub fn max_possible_scores(&self) -> SimulationResult {
        self.max_possible_scores.clone()
    }
    /// Returns the maximum possible scores while passing when the conditions are met.
    #[wasm_bindgen(getter)]
    pub fn max_scores_with_conditional_pass(&self) -> SimulationResult {
        self.max_scores_with_conditional_pass.clone()
    }
}

/// A simulation result.
#[wasm_bindgen]
#[derive(Clone)]
pub struct SimulationResult {
    mean: f64,
    minimum: u32,
    maximum: u32,
    median: f64,
    results: Vec<u32>,
}

#[wasm_bindgen]
impl SimulationResult {
    /// Gets the mean of this simulation.
    #[wasm_bindgen(getter)]
    pub fn mean(&self) -> f64 { self.mean }

    /// Gets the minimum score of this simulation.
    #[wasm_bindgen(getter)]
    pub fn minimum(&self) -> u32 { self.minimum }

    /// Gets the maximum score of this simulation.
    #[wasm_bindgen(getter)]
    pub fn maximum(&self) -> u32 { self.maximum }

    /// Gets the median score of this simulation.
    #[wasm_bindgen(getter)]
    pub fn median(&self) -> f64 { self.median }

    /// Gets the sorted results of this simulation.
    #[wasm_bindgen(getter)]
    pub fn results(&self) -> Vec<u32> {
        self.results.clone()
    }
}

#[wasm_bindgen]
#[cfg(target_arch = "wasm32")]
pub fn analyze_dice(
    seed_txt: &str,
    rng_type: &str,
    num_throws: usize,
    prob_1: f64,
    prob_2: f64,
    prob_3: f64,
    prob_4: f64,
    prob_5: f64,
    prob_6: f64,
    dice_threshold: usize,
    min_score: u32,
    run_max_score_simulation: bool,
    target_score: u32,
) -> DoubleSimulationResult {
    let seed_arr = Sha256::digest(seed_txt.as_bytes());

    let dice = Dice::new([prob_1, prob_2, prob_3, prob_4, prob_5, prob_6]);
    let (mut max_results, mut passing_results) = run_simulation(&seed_arr, &dice, num_throws, rng_type, dice_threshold, min_score, run_max_score_simulation, target_score);
    let (mean, min, max, median) = sort_mean_min_max_median(&mut max_results);
    let max_possible_scores = SimulationResult {
        mean, 
        minimum: min,
        maximum: max,
        median,
        results: max_results,
    };
    let (mean, min, max, median) = sort_mean_min_max_median(&mut passing_results);
    let max_scores_with_conditional_pass = SimulationResult {
        mean,
        minimum: min,
        maximum: max,
        median,
        results: passing_results
    };
    DoubleSimulationResult {
        max_possible_scores,
        max_scores_with_conditional_pass,
    }
}

/// Result of a brute force search for the best dice threshold and target score.
#[wasm_bindgen]
pub struct BruteForceResult {
    best_median_target_score: u32,
    best_mean_target_score: u32,
    best_median_dice_threshold: usize,
    best_mean_dice_threshold: usize,
    best_median_simulation: SimulationResult,
    best_mean_simulation: SimulationResult,
}

impl Default for BruteForceResult {
    fn default() -> Self {
        Self {
            best_median_target_score: 0,
            best_mean_target_score: 0,
            best_median_dice_threshold: 0,
            best_mean_dice_threshold: 0,
            best_median_simulation: SimulationResult {
                mean: 0.0,
                minimum: 0,
                maximum: 0,
                median: 0.0,
                results: Vec::new(),
            },
            best_mean_simulation: SimulationResult {
                mean: 0.0,
                minimum: 0,
                maximum: 0,
                median: 0.0,
                results: Vec::new(),
            },
        }
    }
}

#[wasm_bindgen]
impl BruteForceResult {
    /// Gets the best target score for maximizing the median score.
    #[wasm_bindgen(getter)]
    pub fn best_median_target_score(&self) -> u32 {
        self.best_median_target_score
    }
    /// Gets the best target score for maximizing the mean score.
    #[wasm_bindgen(getter)]
    pub fn best_mean_target_score(&self) -> u32 {
        self.best_mean_target_score
    }
    /// Gets the best dice threshold for maximizing the median score.
    #[wasm_bindgen(getter)]
    pub fn best_median_dice_threshold(&self) -> usize {
        self.best_median_dice_threshold
    }
    /// Gets the best dice threshold for maximizing the mean score.
    #[wasm_bindgen(getter)]
    pub fn best_mean_dice_threshold(&self) -> usize {
        self.best_mean_dice_threshold
    }
    /// Gets the sorted results for the best target score and dice threshold for maximizing the median score.
    #[wasm_bindgen(getter)]
    pub fn best_median_target_score_results(&self) -> SimulationResult {
        self.best_median_simulation.clone()
    }
    /// Gets the sorted results for the best target score and dice threshold for maximizing the mean score.
    #[wasm_bindgen(getter)]
    pub fn best_mean_target_score_results(&self) -> SimulationResult {
        self.best_mean_simulation.clone()
    }
}

/// Brute force search for the best dice threshold and target score to maximize 
/// the mean and median scores, respectively.
#[wasm_bindgen]
pub fn brute_force(
    seed_txt: &str,
    rng_type: &str,
    num_turns: usize,
    max_score: u32,
    prob_1: f64,
    prob_2: f64,
    prob_3: f64,
    prob_4: f64,
    prob_5: f64,
    prob_6: f64,
) -> BruteForceResult {
    let seed_arr = Sha256::digest(seed_txt.as_bytes());
    let dice = Dice::new([prob_1, prob_2, prob_3, prob_4, prob_5, prob_6]);
    
    // The "Brute Force" with Reduction
    (1..=6).into_par_iter().flat_map(|threshold| {
        let start = 50;
        let end = 9000;
        let step = 50;
        let steps = (end - start) / step + 1;
        (0..steps).into_par_iter().map(move |i| {
            let target = start + i * step;
            (threshold, target)
        })
    })
    .map(|(threshold, target)| {
        let (_, mut results) = run_simulation(&seed_arr, &dice, num_turns, rng_type, threshold, target, false, max_score);
        let (mean, min, max, median) = sort_mean_min_max_median(&mut results);
        
        // Bench on Safari with 8 concurrent threads, 1000 turns, 8000 max score, with favourable dice:
        // simulate_brute_force_dice: 368.659ms
        /// Bench on MS Edge:
        /// simulate_brute_force_dice: 1706.260009765625 ms
        // Bench was taken with results: results.clone()

        // Removing results.clone() and recomputing the results buffer at the end resulted in the following 
        // benchmarks:
        // Safari: simulate_brute_force_dice: 592.087ms
        // Edge: simulate_brute_force_dice: 1873.547119140625 ms
        BruteForceResult {
            best_mean_target_score: target,
            best_median_target_score: target,
            best_mean_dice_threshold: threshold,
            best_median_dice_threshold: threshold,
            best_mean_simulation: SimulationResult {
                mean,
                minimum: min,
                maximum: max,
                median,
                results: results.clone()
            },
            best_median_simulation: SimulationResult {
                mean,
                minimum: min,
                maximum: max,
                median,
                results
            }
        }
    })
    .reduce(|| BruteForceResult::default(), |mut a, b| {
        // Merge logic: Keep the best of the two
        if b.best_mean_simulation.mean > a.best_mean_simulation.mean {
            a.best_mean_simulation = b.best_mean_simulation;
            a.best_mean_dice_threshold = b.best_mean_dice_threshold;
            a.best_mean_target_score = b.best_mean_target_score;
        }
        if b.best_median_simulation.median > a.best_median_simulation.median {
            a.best_median_simulation = b.best_median_simulation;
            a.best_median_dice_threshold = b.best_median_dice_threshold;
            a.best_median_target_score = b.best_median_target_score;
        }
        a
    })
}

#[wasm_bindgen]
pub struct StatsResult {
    roll_probabilities: [Roll; 6]
}

#[wasm_bindgen]
#[derive(Clone, Copy)]
pub struct Roll {
    num_dice: usize,
    p_score: f64,
    p_bust: f64
}

impl Default for Roll {
    fn default() -> Self {
        Self {
            num_dice: 0,
            p_score: 0f64,
            p_bust: 0f64,
        }
    }
}


impl Roll {
    fn new(num_dice: usize, p_score: f64, p_bust: f64) -> Self {
        Self { num_dice, p_score, p_bust }
    }
}
#[wasm_bindgen]
impl Roll {
    /// Gets the number of dice for this roll.
    #[wasm_bindgen(getter)]
    pub fn num_dice(&self) -> usize {
        self.num_dice
    }
    /// Gets the probability of scoring for this roll.
    #[wasm_bindgen(getter)]
    pub fn p_score(&self) -> f64 {
        self.p_score
    }
    /// Gets the probability of busting for this roll.
    #[wasm_bindgen(getter)]
    pub fn p_bust(&self) -> f64 {
        self.p_bust
    }
}

#[wasm_bindgen]
impl StatsResult {
    #[wasm_bindgen(getter)]
    pub fn roll_probabilities(&self) -> Vec<Roll> {
        self.roll_probabilities.to_vec()
    }
}

#[wasm_bindgen]
pub fn dice_stats(prob_1: f64, prob_2: f64, prob_3: f64, prob_4: f64, prob_5: f64, prob_6: f64) -> StatsResult {
    let mut p = FarkleScorer {p: [prob_1, prob_2, prob_3, prob_4, prob_5, prob_6]};
    let sum = p.p.iter().sum::<f64>();
    for i in 0..6 {
        p.p[i] /= sum;
    }
    let mut result = StatsResult {roll_probabilities: [Roll::default(); 6]};
    for dice in 1..=6 {
        let p_score = p.probability_of_any_score(dice);
        let p_bust = 1.0 - p_score;
        //assert!(p_score >= 0.0 && p_score <= 1.0, "p_score out of bounds: {}", p_score);
        //assert!(p_bust.value() < 1.0);
        result.roll_probabilities[dice - 1] = Roll::new(dice, p_score * 100.0, p_bust * 100.0);
    }
    result
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn singles() {
        let (score, remaining) = Dice::check_and_score(&vec![1, 1, 2, 2, 5, 5]);
        assert_eq!(score, 100);
        assert_eq!(remaining, 5);

        let (score, remaining) = Dice::check_and_score(&vec![1, 1, 2, 2, 5]);
        assert_eq!(score, 100);
        assert_eq!(remaining, 4);

        let (score, remaining) = Dice::check_and_score(&vec![1, 1, 2, 2]);
        assert_eq!(score, 100);
        assert_eq!(remaining, 3);

        let (score, remaining) = Dice::check_and_score(&vec![1, 1, 2]);
        assert_eq!(score, 100);
        assert_eq!(remaining, 2);

        let (score, remaining) = Dice::check_and_score(&vec![2, 1]);
        assert_eq!(score, 100);
        assert_eq!(remaining, 1);

        let (score, remaining) = Dice::check_and_score(&vec![1]);
        assert_eq!(score, 100);
        assert_eq!(remaining, 0);

        let (score, remaining) = Dice::check_and_score(&vec![3, 3, 2, 2, 5, 5]);
        assert_eq!(score, 50);
        assert_eq!(remaining, 5);

        let (score, remaining) = Dice::check_and_score(&vec![3, 2, 2, 5, 5]);
        assert_eq!(score, 50);
        assert_eq!(remaining, 4);

        let (score, remaining) = Dice::check_and_score(&vec![2, 2, 5, 5]);
        assert_eq!(score, 50);
        assert_eq!(remaining, 3);

        let (score, remaining) = Dice::check_and_score(&vec![2, 5, 5]);
        assert_eq!(score, 50);
        assert_eq!(remaining, 2);

        let (score, remaining) = Dice::check_and_score(&vec![2, 5]);
        assert_eq!(score, 50);
        assert_eq!(remaining, 1);

        let (score, remaining) = Dice::check_and_score(&vec![5]);
        assert_eq!(score, 50);
        assert_eq!(remaining, 0);
    }

    #[test]
    fn two_left() {
        let (score, remaining) = Dice::check_and_score(&vec![5, 5]);
        assert_eq!(score, 100);
        assert_eq!(remaining, 0);

        let (score, remaining) = Dice::check_and_score(&vec![1, 1]);
        assert_eq!(score, 200);
        assert_eq!(remaining, 0);

        let (score, remaining) = Dice::check_and_score(&vec![1, 5]);
        assert_eq!(score, 150);
        assert_eq!(remaining, 0);
    }

    #[test]
    fn triple() {
        let (score, remaining) = Dice::check_and_score(&vec![3, 3, 2, 2, 5, 3]);
        assert_eq!(score, 300);
        assert_eq!(remaining, 3);

        let (score, remaining) = Dice::check_and_score(&vec![3, 2, 2, 2, 5, 5]);
        assert_eq!(score, 200);
        assert_eq!(remaining, 3);

        let (score, remaining) = Dice::check_and_score(&vec![1, 1, 2, 2, 1, 5]);
        assert_eq!(score, 1000);
        assert_eq!(remaining, 3);

        let (score, remaining) = Dice::check_and_score(&vec![1, 1, 5, 3, 3, 3]);
        assert_eq!(score, 550);
        assert_eq!(remaining, 0);

        let (score, remaining) = Dice::check_and_score(&vec![3, 3, 3, 1, 5]);
        assert_eq!(score, 450);
        assert_eq!(remaining, 0);

        let (score, remaining) = Dice::check_and_score(&vec![3, 3, 3, 1]);
        assert_eq!(score, 400);
        assert_eq!(remaining, 0);
    }

    #[test]
    fn two_triples() {
        let (score, remaining) = Dice::check_and_score(&vec![1, 1, 1, 3, 3, 3]);
        assert_eq!((score, remaining), (1300, 0));

        // ensuring that a panic doesn't happen when indexing counts[index_1 + 1]
        let (score, remaining) = Dice::check_and_score(&vec![2, 3, 4, 6, 6, 6]);
        assert_eq!(score, 600);
        assert_eq!(remaining, 3);
    }

    #[test]
    fn quad() {
        let r = Dice::check_and_score(&vec![1, 1, 1, 1, 5, 5]);
        assert_eq!(r, (2100, 0));

        let r = Dice::check_and_score(&vec![1, 1, 1, 1, 5]);
        assert_eq!(r, (2050, 0));
    }

    #[test]
    fn broken() {
        let r = Dice::check_and_score(&vec![4, 4, 4, 5, 5, 5]);
        assert_eq!(r, (900, 0));
    }

    #[test]
    fn broken_2() {
        let r = Dice::check_and_score(&vec![1, 1, 1, 5, 1, 2]);
        assert_eq!(r, (2000, 2));
    }
}
