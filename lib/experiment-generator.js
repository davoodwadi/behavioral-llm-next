// lib/experiment-generator.js

/**
 * A JavaScript implementation of Python's itertools.product.
 * Generates the Cartesian product of the input arrays.
 * @param {...Array<any>} arrays The arrays to combine.
 * @returns {Array<Array<any>>} The Cartesian product.
 */
export function product(...arrays) {
  if (arrays.length === 0) {
    return [[]];
  }
  return arrays.reduce(
    (acc, array) => {
      const ret = [];
      for (const a of acc) {
        for (const b of array) {
          ret.push([...a, b]);
        }
      }
      return ret;
    },
    [[]]
  );
}

/**
 * Extracts unique variable names (e.g., {product}) from a round's segments.
 * @param {object} round The round object.
 * @returns {Set<string>} A set of unique variable names.
 */
export function getSegmentVariables(round) {
  if (!round.segments || round.segments.length === 0) {
    return new Set();
  }
  const combinedText = round.segments
    .map((seg) => seg.segmentText)
    .join("\n\n");
  const matches = combinedText.match(/{(\w+)}/g) || [];
  // Return a set of the names without curly braces
  return new Set(matches.map((v) => v.slice(1, -1)));
}

/**
 * Filters a round's factors to only include those used in its segments.
 * @param {Array<object>} factorsArray The round's factorsArray.
 * @param {Set<string>} segmentVariables The variables found in segments.
 * @returns {Array<object>} The filtered list of factors.
 */
export function filterFactorsBySegmentVariables(
  factorsArray,
  segmentVariables
) {
  return factorsArray.filter((factor) => segmentVariables.has(factor.name));
}

/**
 * Finds all block variable levels that are aliases (share a group_id)
 * and are used in the current round's segments.
 * @param {Set<string>} roundSegmentVariables The variables for the current round.
 * @param {object} blockVariableLevel The specific block level to find aliases for.
 * @param {Array<object>} allBlockVariables All block variables.
 * @returns {Array<object>} A list of alias levels to prepend.
 */
export function findAliasLevels(
  roundSegmentVariables,
  blockVariableLevel,
  allBlockVariables
) {
  const groupId = blockVariableLevel.group_id;
  if (groupId === undefined) return [];

  const aliasLevels = [];
  for (const bVar of allBlockVariables) {
    // Only consider this block variable if it's actually used in the round's text
    if (roundSegmentVariables.has(bVar.name)) {
      for (const bLevel of bVar.levels) {
        if (bLevel.group_id === groupId) {
          aliasLevels.push(bLevel);
        }
      }
    }
  }
  return aliasLevels;
}

/**
 * Removes duplicate items from a list of complex objects/arrays.
 * @param {Array<any>} complexList The list to deduplicate.
 * @returns {Array<any>} The list with duplicates removed.
 */
export function deduplicateComplexList(complexList) {
  const seen = new Set();
  const result = [];
  for (const item of complexList) {
    // Sorting keys ensures {"a":1,"b":2} and {"b":2,"a":1} are treated as the same.
    const key = JSON.stringify(item, Object.keys(item || {}).sort());
    if (!seen.has(key)) {
      result.push(item);
      seen.add(key);
    }
  }
  return result;
}

export function zipBlockVariables(blockVariables) {
  const allLevels = blockVariables.flatMap((block) => block.levels);
  // Step 2: Group by group_id
  const grouped = {};

  for (const level of allLevels) {
    const { group_id } = level;
    if (!grouped[group_id]) grouped[group_id] = [];
    grouped[group_id].push(level);
  }

  // Step 3: Convert object to array of arrays
  const zipped = Object.values(grouped);
  return zipped;
}

function replacePlaceholdersString(text, lookup) {
  return text.replace(/{{(.*?)}}/g, (_, key) => {
    const k = key.trim();
    return lookup[k] ?? `{{${k}}}`; // leave placeholder if no match found
  });
}

export function replacePlaceholders(variables, segments) {
  // Step 1: Build a lookup object { var_name: text }
  const lookup = {};
  for (const v of variables) {
    lookup[v.var_name] = v.text;
  }

  // Step 2: Replace in all segment texts
  const replacedSegments = segments.map((seg) =>
    replacePlaceholdersString(seg, lookup)
  );
  return replacedSegments;
}

export function generateRatingCombinations(rounds, blockVariables) {
  // get combinations
  const combinations = [];
  rounds.forEach((round, roundCounter) => {
    const allLevels = round.factorsArray.map(
      (factorArray) => factorArray.levels
    );
    const allLevelsNames = allLevels.map((factor) =>
      factor.map((level) => {
        // return { name: level.name };
        return level;
      })
    );
    const factor_products = product(...allLevelsNames);
    combinations.push(factor_products);
  });

  // transpose combinations
  const transposedCombinations = product(...combinations);

  // zip block variables
  //   console.log(blockVariables);
  const zippedBlockVariables = zipBlockVariables(blockVariables);
  //   console.log("zippedBlockVariables", zippedBlockVariables);

  // insert block variables into transposed combinations
  const blockAllRoundsCombinations = [];
  zippedBlockVariables.forEach((blockLevelGroup) => {
    const blockLevelGroupName = blockLevelGroup.map((blg) => {
      //   return { name: blg.name };
      return blg;
    });
    // console.log("blockLevelGroupName", blockLevelGroupName);

    transposedCombinations.forEach((allRoundsCombination) => {
      const blockAllRoundsCombination = [];
      allRoundsCombination.forEach((roundCombo) => {
        //   console.log("roundCombo", roundCombo);
        blockAllRoundsCombination.push([...blockLevelGroupName, ...roundCombo]);
      });
      // console.log("END OF ROUND");
      blockAllRoundsCombinations.push(blockAllRoundsCombination);
    });
  });
  //   console.log("blockAllRoundsCombinations", blockAllRoundsCombinations);
  //   console.log("********");
  return blockAllRoundsCombinations;
}

/**
 * Main function to generate all experimental combinations from rounds and block variables.
 * @param {Array<object>} rounds The list of rounds from the store.
 * @param {Array<object>} blockVariables The list of block variables from the store.
 * @returns {Array<object>} The final, deduplicated list of all combinations.
 */
export function generateCombinations(rounds, blockVariables) {
  // Step 1: Get per-round factor combinations
  const roundsFactorCombinations = rounds.map((round) => {
    // As per the Python code, only 'Rating' rounds have factorials.
    // Other rounds will pass through without adding combinations.
    if (round.round_type !== "Rating" || !round.factorsArray) {
      return [[]]; // This ensures product() works correctly across rounds
    }

    const segmentVariables = getSegmentVariables(round);
    console.log("segmentVariables", segmentVariables);
    const filteredFactors = filterFactorsBySegmentVariables(
      round.factorsArray,
      segmentVariables
    );

    // Ensure factors have levels before trying to create a product
    const factorLevels = filteredFactors
      .filter((f) => f.levels && f.levels.length > 0)
      .map((f) => f.levels);
    console.log("factorLevels", factorLevels);

    if (factorLevels.length === 0) {
      return [[]];
    }

    return product(...factorLevels);
  });

  // Step 2: Get cross-round combinations
  const allRoundsCombinations = product(...roundsFactorCombinations);

  // Step 3: Inject Block Variables
  if (!blockVariables || blockVariables.length === 0) {
    return allRoundsCombinations;
  }

  // Use only the first block variable to multiply combinations
  const mainBlockVariable = blockVariables[0];

  const newAllRoundsCombinations = [];

  for (const roundCombination of allRoundsCombinations) {
    for (const blockLevel of mainBlockVariable.levels) {
      const newRoundCombination = [];

      for (let i = 0; i < rounds.length; i++) {
        const singleRoundCombination = roundCombination[i];
        const currentRound = rounds[i];

        const roundSegmentVariables = getSegmentVariables(currentRound);

        const aliasLevels = findAliasLevels(
          roundSegmentVariables,
          blockLevel,
          blockVariables
        );

        // Prepend alias levels to the existing factor levels for this round
        const newSingleRoundCombination = [
          ...aliasLevels,
          ...singleRoundCombination,
        ];
        newRoundCombination.push(newSingleRoundCombination);
      }
      newAllRoundsCombinations.push(newRoundCombination);
    }
  }

  // Step 4: Deduplication
  return deduplicateComplexList(newAllRoundsCombinations);
}
