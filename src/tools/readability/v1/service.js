// tools/readability/v1/service.js

import {
  splitParagraphs,
  splitSentences,
  tokenizeWords,
  countSyllables
} from "./textUtils.js";

import {
  calculateFleschReadingEase,
  calculateFleschKincaidGrade,
  calculateGunningFog
} from "./formulas.js";

import {
  PRESETS,
  GRADE_LABELS,
  ACTION_PRIORITY_ORDER
} from "./constants.js";

export function analyzeReadability(text = "", preset = "general_blog") {
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

  const actions = buildActions(sentenceFlags, paragraphIssues, presetConfig);
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

/* ================= INTERNAL ================= */

function buildTextStats(text) {
  const paragraphs = splitParagraphs(text);
  const sentences = splitSentences(text);
  const words = tokenizeWords(text);

  let syllableCount = 0;
  let complexWordCount = 0;

  for (const word of words) {
    const s = countSyllables(word);
    syllableCount += s;
    if (s >= 3) complexWordCount++;
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

function resolveGradeLabel(grade) {
  if (grade === null || grade === undefined) return "Unknown";

  const found = GRADE_LABELS.find(
    r => grade >= r.min && grade <= r.max
  );

  return found ? found.label : "Unknown";
}

function analyzeSentences(sentences, maxSentenceLength) {
  const results = [];

  sentences.forEach((sentence, index) => {
    const words = tokenizeWords(sentence);
    const flags = [];

    if (words.length > maxSentenceLength) {
      flags.push("long_sentence");
    }

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

function analyzeParagraphs(paragraphs, maxParagraphLength) {
  let longParagraphs = 0;

  paragraphs.forEach(p => {
    if (tokenizeWords(p).length > maxParagraphLength) {
      longParagraphs++;
    }
  });

  return {
    longParagraphs,
    maxParagraphLength
  };
}

function buildActions(sentenceFlags, paragraphIssues, presetConfig) {
  const map = {
    long_sentences: {
      type: "long_sentences",
      count: sentenceFlags.filter(s => s.flags.includes("long_sentence")).length,
      threshold: presetConfig.maxSentenceLength
    },
    passive_voice: {
      type: "passive_voice",
      count: sentenceFlags.filter(s => s.flags.includes("passive_voice")).length
    },
    long_paragraphs: {
      type: "long_paragraphs",
      count: paragraphIssues.longParagraphs,
      threshold: presetConfig.maxParagraphLength
    }
  };

  const actions = [];

  ACTION_PRIORITY_ORDER.forEach((key, i) => {
    const a = map[key];
    if (a && a.count > 0) {
      actions.push({
        priority: i + 1,
        ...a,
        message: buildActionMessage(a)
      });
    }
  });

  return actions;
}

function buildActionMessage(action) {
  if (action.type === "long_sentences") {
    return `${action.count} sentences are longer than recommended. Shortening them will improve clarity the most.`;
  }
  if (action.type === "passive_voice") {
    return `${action.count} sentences use passive voice. Consider rewriting them in active voice.`;
  }
  if (action.type === "long_paragraphs") {
    return `${action.count} paragraphs are too long for web scanning.`;
  }
  return "";
}

function buildSentenceHint(flags, maxSentenceLength) {
  if (flags.includes("long_sentence")) {
    return `Try splitting this sentence into shorter ones (max ${maxSentenceLength} words).`;
  }
  if (flags.includes("passive_voice")) {
    return "Rewrite this sentence using active voice.";
  }
  return "";
}

function buildChecklist(actions, presetConfig) {
  const list = actions.map(a => {
    if (a.type === "long_sentences") return `Shorten ${a.count} long sentences`;
    if (a.type === "passive_voice") return `Rewrite ${a.count} passive voice sentences`;
    if (a.type === "long_paragraphs") return `Split ${a.count} long paragraphs`;
    return "";
  });

  list.push(
    `Aim for grade level between ${presetConfig.targetGradeRange[0]}–${presetConfig.targetGradeRange[1]} for this content type`
  );

  return list;
}
