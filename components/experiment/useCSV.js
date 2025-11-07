import { useExperimentStore } from "@/lib/store/index";
import { useShallow } from "zustand/react/shallow";
import { replacePlaceholders } from "@/lib/experiment-generator";

export function useCSV() {
  const { experimentCombinations, rounds, systemPrompt } = useExperimentStore(
    useShallow((state) => ({
      experimentCombinations: state.experimentCombinations,
      rounds: state.rounds,
      systemPrompt: state.config.systemPrompt,
    }))
  );

  const getCSV = () => {
    if (experimentCombinations.length === 0) {
      return null;
    }

    const comboAndTextsArray = experimentCombinations.map((combo, i) => {
      return combo.map((roundCombo, roundIndex) => {
        const roundSegments = rounds[roundIndex].segments;
        const segmentTexts = roundSegments.map(
          (segment) => segment.segmentText
        );
        const replacedSegments = replacePlaceholders(roundCombo, segmentTexts);
        const replacedSegmentsString = replacedSegments.join("---");
        return {
          roundCombo,
          replacedSegmentsString,
        };
      });
    });

    // Step 1: Transform your comboAndTextsArray into a CSV-friendly array
    const csvData = comboAndTextsArray.map((combo) => {
      const row = {};

      combo.forEach((round, roundIndex) => {
        round.roundCombo.forEach((rcombo) => {
          row[`round_${roundIndex}_${rcombo.var_name}`] = rcombo.name;
          // console.log(rcombo);
        });

        row[`round_${roundIndex}_segment`] = round.replacedSegmentsString;
      });
      row["systemPrompt"] = systemPrompt;
      return row;
    });

    // Step 2: Convert to CSV string manually
    const headers = Object.keys(csvData[0]);
    const csvString = [
      headers.join(","), // header row
      ...csvData.map(
        (row) => headers.map((header) => `"${row[header]}"`).join(",") // wrap each cell in quotes to be safe
      ),
    ].join("\n");

    // console.log("csvString", csvString);
    // console.log("comboAndTextsArray", comboAndTextsArray);

    return csvString;
  };

  return getCSV;
}
