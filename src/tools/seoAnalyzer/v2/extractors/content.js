export function extractCleanContent({ cleanText, rawText }) {
  // Paragraphs: split on line breaks or double spaces
  const paragraphs = cleanText
    .split(/\n{2,}|\r{2,}/)
    .map(p => p.trim())
    .filter(Boolean);

  const paragraphCount = paragraphs.length;

  const paragraphLengths = paragraphs.map(p =>
    p.split(/\s+/).length
  );

  const avgParagraphLength = paragraphCount
    ? Math.round(
        paragraphLengths.reduce((a, b) => a + b, 0) / paragraphCount
      )
    : 0;

  // Sentences
  const sentences = cleanText
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 3);

  const sentenceCount = sentences.length;

  const avgSentenceLength = sentenceCount
    ? Math.round(
        sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) /
          sentenceCount
      )
    : 0;

  // Boilerplate ratio (approx)
  const cleanWords = cleanText.split(/\s+/).length;
  const rawWords = rawText.split(/\s+/).length;

  const boilerplateRatio =
    rawWords > 0
      ? Math.round(((rawWords - cleanWords) / rawWords) * 100)
      : 0;

  return {
    cleanWordCount: cleanWords,
    paragraphCount,
    avgParagraphLength,
    sentenceCount,
    avgSentenceLength,
    boilerplateRatio
  };
}
