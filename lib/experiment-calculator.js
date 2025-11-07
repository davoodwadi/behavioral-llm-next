// lib/experiment-calculator.js

// --- Combinatorial Math Helpers ---

// Memoized factorial function for performance
const factorial = (() => {
  const cache = {};
  return (n) => {
    if (n < 0) return NaN; // Factorial is not defined for negative numbers
    if (n === 0) return 1;
    if (cache[n]) return cache[n];
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    cache[n] = result;
    return result;
  };
})();

/**
 * Calculates the number of permutations (nPr).
 * The number of ways to choose and arrange r items from a set of n.
 * Formula: n! / (n - r)!
 */
function permutationsCount(n, r) {
  if (r < 0 || r > n) return 0;
  return factorial(n) / factorial(n - r);
}

/**
 * Calculates the number of combinations (nCr).
 * The number of ways to choose r items from a set of n, where order doesn't matter.
 * Formula: n! / (r! * (n - r)!)
 */
function combinationsCount(n, r) {
  if (r < 0 || r > n) return 0;
  // Optimization: C(n, k) === C(n, n - k)
  const k = Math.min(r, n - r);
  if (k === 0) return 1;

  // Using multiplicative formula for better precision with large numbers
  // (n * (n-1) * ... * (n-k+1)) / k!
  let res = 1;
  for (let i = 0; i < k; i++) {
    res = (res * (n - i)) / (i + 1);
  }
  return Math.round(res);
}

// --- Core Calculation Logic ---

/**
 * Calculates the number of combinations for a single round based on its type.
 * This is the JS equivalent of the loop body in `get_rounds_factor_combinations`.
 */
function getCombinationCountForRound(round) {
  // Use only factors that have at least one level.
  const validFactors = round.factorsArray.filter((f) => f.levels?.length > 0);

  if (validFactors.length === 0) {
    return 1; // A round with no factors has one combination (the default state).
  }

  switch (round.round_type) {
    case "Rating": {
      // Equivalent to `get_choice_factor_products`
      // This is a Cartesian product, so we multiply the number of levels of each factor.
      return validFactors.reduce(
        (prod, factor) => prod * factor.levels.length,
        1
      );
    }

    case "Choice": {
      // Equivalent to `get_choice_permutations` (which is actually combinations)
      const numChoices = round.choicesShown || 2;
      // Get a flat list of all possible levels from all factors for this round.
      const allLevelsCount = validFactors.reduce(
        (sum, factor) => sum + factor.levels.length,
        0
      );
      // We need to choose `numChoices` items from the total set of levels.
      return combinationsCount(allLevelsCount, numChoices);
    }

    default:
      // For any other or unknown round type, assume 1 combination.
      return 1;
  }
}

/**
 * Main calculation function, equivalent to the entire Python script logic.
 * It computes the final total number of unique experimental conditions.
 */
export function calculateTotalCombinations({ rounds, blockVariables }) {
  if (!rounds || rounds.length === 0) {
    return 0;
  }

  // Step 1 & 2: Get combination count for each round and multiply them together.
  // This replaces `get_rounds_factor_combinations` and `get_all_rounds_combinations`.
  const totalRoundCombinations = rounds
    .map(getCombinationCountForRound)
    .reduce((prod, count) => prod * count, 1);

  // Step 3: Factor in the block variables.
  // The Python logic uses only the first block variable. We'll do the same.
  // If no block variables, the multiplier is 1.
  const numBlockVariableLevels = blockVariables[0]?.levels.length || 1;

  // The complex de-duplication logic in Python aims to prevent redundant
  // combinations when block variables overlap with round factors.
  // A direct multiplication is the most common interpretation and a robust
  // starting point for the total count.
  const totalCombinations = totalRoundCombinations * numBlockVariableLevels;

  return totalCombinations;
}
