// --- Constants and Initial State ---
export const ALL_MODELS = [
  { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "claude-3-opus", label: "Claude 3 Opus" },
  { value: "claude-3-sonnet", label: "Claude 3 Sonnet" },
  { value: "gemini-pro", label: "Gemini Pro" },
];

export const initialConfig = {
  systemPrompt:
    "You are a helpful assistant designed to analyze behavioral data.",
  iterations: 1,
  isMockRun: true,
  sleepAmount: 0.1,
  modelsToTest: [ALL_MODELS[0].value],
  apiKeys: {},
  paperUrl: "",
  randomizeItems: true,
};

export const initialBlockVariables = [
  {
    name: "country",
    levels: [
      {
        name: "us",
        text: "United States",
        group_id: 1,
        var_name: "country",
      },
      {
        name: "china",
        text: "China",
        group_id: 2,
        var_name: "country",
      },
    ],
  },
  {
    name: "nationality",
    levels: [
      {
        name: "american",
        text: "American",
        group_id: 1,
        var_name: "nationality",
      },
      {
        name: "chinese",
        text: "Chinese",
        group_id: 2,
        var_name: "nationality",
      },
    ],
  },
];

export const initialRounds = [
  {
    key: `round_${1}`, // Unique key
    segments: [
      {
        segmentText: "a {{product}} from {{country}} {{year}}",
        segmentId: `segment_${1}`,
      },
    ],
    factorsArray: [
      {
        key: `factor_${1}`,
        name: "product",
        levels: [
          {
            key: "level_1762526519411",
            name: "laptop",
            text: "Laptop",
            var_name: "product",
          },
          {
            key: "level_1762526519412",
            name: "tablet",
            text: "Tablet",
            var_name: "product",
          },
        ],
      },
      {
        key: `factor_${12}`,
        name: "year",
        levels: [
          {
            key: "level_17625265194112",
            name: "2020",
            text: "2020",
            var_name: "year",
          },
          {
            key: "level_17625265194121",
            name: "2021",
            text: "2021",
            var_name: "year",
          },
        ],
      },
    ],
    round_type: "Rating",
  },
  {
    key: `round_${2}`, // Unique key
    segments: [
      {
        segmentText: "{{country}}-made {{brand}}",
        segmentId: `segment_${2}`,
      },
    ],
    factorsArray: [
      {
        key: `factor_${2}`,
        name: "brand",
        levels: [
          {
            key: `level_${3}`,
            name: "apple",
            text: "Apple",
            var_name: "brand",
          },
          {
            key: `level_${4}`,
            name: "samsung",
            text: "Samsung",
            var_name: "brand",
          },
        ],
      },
    ],
    round_type: "Rating",
  },
  {
    key: `round_${3}`, // Unique key
    segments: [
      {
        segmentText: "This {{country}}",
        segmentId: `segment_${3}`,
      },
    ],
    factorsArray: [],
    round_type: "Rating",
  },
];
