// tools/readability/v1/formulas.js

/**
 * Flesch Reading Ease
 * 206.835 − 1.015 × (words / sentences) − 84.6 × (syllables / words)
 */
export function calculateFleschReadingEase(stats) {
  const { wordCount, sentenceCount, syllableCount } = stats;

  if (!wordCount || !sentenceCount || !syllableCount) return null;

  const score =
    206.835 -
    1.015 * (wordCount / sentenceCount) -
    84.6 * (syllableCount / wordCount);

  return Number(score.toFixed(2));
}

/**
 * Flesch–Kincaid Grade Level
 * 0.39 × (words / sentences) + 11.8 × (syllables / words) − 15.59
 */
export function calculateFleschKincaidGrade(stats) {
  const { wordCount, sentenceCount, syllableCount } = stats;

  if (!wordCount || !sentenceCount || !syllableCount) return null;

  const grade =
    0.39 * (wordCount / sentenceCount) +
    11.8 * (syllableCount / wordCount) -
    15.59;

  return Number(grade.toFixed(2));
}

/**
 * Gunning Fog Index
 * 0.4 × ((words / sentences) + 100 × (complexWords / words))
 */
export function calculateGunningFog(stats) {
  const { wordCount, sentenceCount, complexWordCount } = stats;

  if (!wordCount || !sentenceCount) return null;

  const fog =
    0.4 *
    ((wordCount / sentenceCount) +
      100 * ((complexWordCount || 0) / wordCount));

  return Number(fog.toFixed(2));
}
