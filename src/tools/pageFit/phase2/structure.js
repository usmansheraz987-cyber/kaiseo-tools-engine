// src/tools/pageFit/phase2/structure.js

/**
 * Analyzes paragraph structure and distribution
 * No scoring. No opinions. Just signals.
 */
export function analyzeParagraphStructure(extractedContent) {
  const text = extractedContent?.text || "";
  const paragraphs = text.split("\n\n").filter(Boolean);

  const paragraphCount = paragraphs.length;

  if (paragraphCount === 0) {
    return {
      paragraphCount: 0,
      avgWordsPerParagraph: 0,
      longParagraphs: 0,
      shortParagraphs: 0,
      wallOfText: true,
      microParagraphSpam: false
    };
  }

  const wordCounts = paragraphs.map(p =>
    p.split(/\s+/).filter(Boolean).length
  );

  const avgWordsPerParagraph =
    Math.round(
      wordCounts.reduce((a, b) => a + b, 0) / paragraphCount
    );

  const longParagraphs = wordCounts.filter(wc => wc > 120).length;
  const shortParagraphs = wordCounts.filter(wc => wc < 30).length;

  return {
    paragraphCount,
    avgWordsPerParagraph,
    longParagraphs,
    shortParagraphs,
    wallOfText: avgWordsPerParagraph > 150,
    microParagraphSpam: shortParagraphs > paragraphCount * 0.6
  };
}
