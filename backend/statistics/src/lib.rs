pub struct FarkleScorer {
    pub p: [f64; 6], // Individual probabilities for faces 1 through 6
}

impl FarkleScorer {
    pub fn probability_of_any_score(&self, n: usize) -> f64 {
        let mut total_scoring_prob = 0.0;
        let mut counts = [0usize; 6];
        self.generate_outcomes(n, 0, &mut counts, &mut total_scoring_prob);
        
        // Clamp result to [0.0, 1.0] to handle floating point precision jitter
        total_scoring_prob.min(1.0).max(0.0)
    }

    fn generate_outcomes(&self, remaining: usize, face_idx: usize, counts: &mut [usize; 6], total_prob: &mut f64) {
        if face_idx == 5 {
            counts[5] = remaining;
            if self.is_scoring_hand(counts) {
                *total_prob += self.calculate_multinomial(counts);
            }
            return;
        }

        for i in 0..=remaining {
            counts[face_idx] = i;
            self.generate_outcomes(remaining - i, face_idx + 1, counts, total_prob);
        }
    }

    fn calculate_multinomial(&self, counts: &[usize; 6]) -> f64 {
        let n: usize = counts.iter().sum();
        
        // Use f64 for all factorial math to prevent overflow
        let mut prob = fact_f64(n);
        for &k in counts.iter() {
            prob /= fact_f64(k);
        }

        // Multiply by powers
        for (i, &k) in counts.iter().enumerate() {
            if k > 0 {
                prob *= self.p[i].powi(k as i32);
            }
        }
        prob
    }

    fn is_scoring_hand(&self, counts: &[usize; 6]) -> bool {
        counts[0] > 0 || counts[4] > 0 || // 1s or 5s
        counts[1] >= 3 || counts[2] >= 3 || // Triples 2, 3
        counts[3] >= 3 || counts[5] >= 3    // Triples 4, 6
    }
}

fn fact_f64(n: usize) -> f64 {
    match n {
        0 | 1 => 1.0,
        2 => 2.0,
        3 => 6.0,
        4 => 24.0,
        5 => 120.0,
        6 => 720.0,
        _ => (1..=n).map(|i| i as f64).product(),
    }
}

/// A probability value between 0.0 and 1.0.
#[repr(transparent)]
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Probability (f64);

impl Probability {
    /// Initializes a new Probability.
    #[inline]
    pub fn new(value: f64) -> Self {
        Self(value)
    }
    /// Returns the probability value.
    #[inline]
    pub fn value(&self) -> f64 {
        self.0
    }
    /// Returns the probability of both events occurring.
    #[inline]
    pub fn and(&self, other: Probability) -> Probability {
        Probability(self.0 * other.0)
    }
    /// Returns the probability of either event occurring.
    #[inline]
    pub fn or(&self, other: Probability) -> Probability {
        Probability(self.0 + other.0 - (self.0 * other.0))
    }
    /// Returns the probability of the event not occurring.
    #[inline]
    pub fn not(&self) -> Probability {
        Probability(1.0 - self.0)
    }

    /// Returns Probability(1.0).
    #[inline]
    pub fn one() -> Probability {
        Probability(1.0)
    }

    fn binom(n: usize, k: usize) -> f64 {
        let k = k.min(n - k);
        let mut c = 1u64;
        for i in 0..k {
            c = c * (n - i) as u64 / (i + 1) as u64;
        }
        c as f64
    }

    #[inline]
    pub fn at_least(&self, x: usize, y: usize) -> Self {
        let p = self.value();
        let q = 1.0 - p;
        let mut sum = 0.0;

        for k in x..=y {
            let c = Self::binom(y, k);
            sum += c * p.powi(k as i32) * q.powi((y - k) as i32);
        }

        Probability::new(sum)
    }
}

impl From<f64> for Probability {
    #[inline]
    fn from(value: f64) -> Self {
        Probability::new(value)
    }
}

/// Sorts the input array, then finds the mean, min, and max of the array.
pub fn sort_mean_min_max_median(input: &mut [u32]) -> (f64, u32, u32, f64) {
    if input.is_empty() {
        return (0.0, 0, 0, 0.0);
    }
    input.sort_unstable();
    let mean = input.iter().sum::<u32>() as f64 / input.len() as f64;
    let min = input[0];
    let max = input[input.len() - 1];
    let median = if input.len() % 2 == 0 {
        (input[input.len() / 2 - 1] + input[input.len() / 2]) as f64 / 2.0
    } else {
        input[input.len() / 2] as f64
    };
    (mean, min, max, median)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn and() {
        let p1 = Probability::new(0.5);
        let p2 = Probability::new(0.5);
        let result = p1.and(p2);
        assert_eq!(result.value(), 0.25);
    }

    #[test]
    fn or() {
        let p1 = Probability::new(0.5);
        let p2 = Probability::new(0.5);
        let result = p1.or(p2);
        assert_eq!(result.value(), 0.75);

        let result = result.or(0.0.into());
        assert_eq!(result.value(), 0.75);
    }

    #[test]
    fn not() {
        let p = Probability::new(0.5);
        let result = p.not();
        assert_eq!(result.value(), 0.5);
    }

    #[test]
    fn at_least() {
        let p = Probability::new(0.5);
        let result = p.at_least(4, 6);
        assert_eq!(result.value(), 11.0/32.0);

        let result = result.at_least(4, 6);
        assert!((result.value() - 0.11074748076498508).abs() < 1e-15);

        let p = Probability::new(0.167);
        let result = p.at_least(1, 6)
            .or(p.at_least(1, 6))
            .or(p.at_least(3, 6))
            .or(p.at_least(3, 6))
            .or(p.at_least(3, 6))
            .or(p.at_least(3, 6));
        assert!((result.value() - 0.9138161884809624).abs() < 1e-15);

        let p = Probability::new(0.24);
        let result = p.at_least(1, 1);
        assert_eq!(result.value(), 0.24);

        let result = p.at_least(1, 0);
        assert_eq!(result.value(), 0.0);
    }
}
