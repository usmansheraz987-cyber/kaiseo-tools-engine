// tools/readability/v1/service.js

const {
  splitParagraphs,
  splitSentences,
  tokenizeWords,
  countSyllables
} = require("./textUtils");

const {
  calculateFleschReadingEase,
  calculateFleschKincaidGrade,
  calculateGunningFog
} = require("./formulas");

const {
  PRESETS,
  GRADE_LABELS,
  ACTION_PRIORITY_ORDER
} = require("./constants");

/**
 * Public entry point
 */
function analyzeReadability(text = "", preset = "general_blog") {
  if (!text || !text.trim()) {
    throw new Error("Text is required for readability analysis");
  }

  const presetConfig = PRESETS[preset] || PRESETS.general_blog;

  const stats = buildTextStats(text);
  const scores = buildScores(stats);
  const sentenceFlags = analyzeSentences(
    stats.sentences,
    presetConfig.maxSentenceLength
  );
  const paragraphIssues = analyzeParagraphs(
    stats.paragraphs,
    presetConfig.maxParagraphLength
  );

  const actions = buildActions(
    sentenceFlags,
    paragraphIssues,
    presetConfig
  );

  const checklist = buildChecklist(actions, presetConfig);

  return {
    tool: "readability",
    preset,
    scores,
    actions,
    sentences: sentenceFlags,
    checklist,
    stats: {
      wordCount: stats.wordCount,
      sentenceCount: stats.sentenceCount,
      paragraphCount: stats.paragraphCount
    }
  };
}

/* =========================
   INTERNAL HELPERS
   ========================= */

/**
 * Build raw text statistics
 */
function buildTextStats(text) {
  const paragraphs = splitParagraphs(text);
  const sentences = splitSentences(text);
  const words = tokenizeWords(text);

  let syllableCount = 0;
  let complexWordCount = 0;

  for (const word of words) {
    const syllables = countSyllables(word);
    syllableCount += syllables;
    if (syllables >= 3) complexWordCount++;
  }

  return {
    paragraphs,
    sentences,
    wordCount: words.length,
    sentenceCount: sentences.length,
    paragraphCount: paragraphs.length,
    syllableCount,
    complexWordCount
  };
}

/**
 * Build readability scores
 */
function buildScores(stats) {
  const fleschReadingEase = calculateFleschReadingEase(stats);
  const gradeLevel = calculateFleschKincaidGrade(stats);
  const gunningFog = calculateGunningFog(stats);

  return {
    primary: {
      fleschReadingEase,
      gradeLevel,
      label: resolveGradeLabel(gradeLevel)
    },
    supporting: {
      gunningFog
    }
  };
}

/**
 * Resolve grade label
 */
function resolveGradeLabel(grade) {
  if (grade === null || grade === undefined) return "Unknown";

  const match = GRADE_LABELS.find(
    r => grade >= r.min && grade <= r.max
  );

  return match ? match.label : "Unknown";
}

/**
 * Analyze sentences for issues
 */
function analyzeSentences(sentences, maxSentenceLength) {
  const results = [];

  sentences.forEach((sentence, index) => {
    const words = tokenizeWords(sentence);
    const flags = [];

    if (words.length > maxSentenceLength) {
      flags.push("long_sentence");
    }

    // Simple passive voice heuristic
    if (/\b(was|were|is|are|been|being)\b\s+\w+ed\b/i.test(sentence)) {
      flags.push("passive_voice");
    }

    if (flags.length) {
      results.push({
        index: index + 1,
        text: sentence,
        flags,
        hint: buildSentenceHint(flags, maxSentenceLength)
      });
    }
  });

  return results;
}

/**
 * Paragraph analysis
 */
function analyzeParagraphs(paragraphs, maxParagraphLength) {
  let longParagraphs = 0;

  paragraphs.forEach(p => {
    const words = tokenizeWords(p);
    if (words.length > maxParagraphLength) {
      longParagraphs++;
    }
  });

  return {
    longParagraphs,
    maxParagraphLength
  };
}

/**
 * Rank actions by impact
 */
function buildActions(sentenceFlags, paragraphIssues, presetConfig) {
  const actionsMap = {
    long_sentences: {
      type: "long_sentences",
      count: sentenceFlags.filter(f =>
        f.flags.includes("long_sentence")
      ).length,
      threshold: presetConfig.maxSentenceLength,
      message: ""
    },
    passive_voice: {
      type: "passive_voice",
      count: sentenceFlags.filter(f =>
        f.flags.includes("passive_voice")
      ).length,
      message: ""
    },
    long_paragraphs: {
      type: "long_paragraphs",
      count: paragraphIssues.longParagraphs,
      threshold: presetConfig.maxParagraphLength,
      message: ""
    }
  };

  const actions = [];

  ACTION_PRIORITY_ORDER.forEach((key, index) => {
    const action = actionsMap[key];
    if (action && action.count > 0) {
      action.priority = index + 1;
      action.message = buildActionMessage(action);
      actions.push(action);
    }
  });

  return actions;
}

/**
 * Action messages
 */
function buildActionMessage(action) {
  switch (action.type) {
    case "long_sentences":
      return `${action.count} sentences are longer than recommended. Shortening them will improve clarity the most.`;
    case "passive_voice":
      return `${action.count} sentences use passive voice. Consider rewriting them in active voice.`;
    case "long_paragraphs":
      return `${action.count} paragraphs are too long for web scanning.`;
    default:
      return "";
  }
}

/**
 * Sentence-level hint
 */
function buildSentenceHint(flags, maxSentenceLength) {
  if (flags.includes("long_sentence")) {
    return `Try splitting this sentence into shorter ones (recommended max ${maxSentenceLength} words).`;
  }
  if (flags.includes("passive_voice")) {
    return "Rewrite this sentence using active voice.";
  }
  return "";
}

/**
 * Exportable checklist
 */
function buildChecklist(actions, presetConfig) {
  const list = actions.map(action => {
    switch (action.type) {
      case "long_sentences":
        return `Shorten ${action.count} long sentences`;
      case "passive_voice":
        return `Rewrite ${action.count} passive voice sentences`;
      case "long_paragraphs":
        return `Split ${action.count} long paragraphs`;
      default:
        return "";
    }
  });

  list.push(
    `Aim for grade level between ${presetConfig.targetGradeRange[0]}–${presetConfig.targetGradeRange[1]} for this content type`
  );

  return list;
}

module.exports = {
  analyzeReadability
};
