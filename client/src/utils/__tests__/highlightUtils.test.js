/**
 * Tests for Highlight Utilities
 */

import { 
  highlightText, 
  getHighlightStats, 
  createHighlightPreview 
} from '../highlightUtils';

describe('highlightText', () => {
  test('highlights single term', () => {
    const result = highlightText('This is a test', 'test');
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ text: 'This is a ', highlighted: false });
    expect(result[1]).toEqual({ text: 'test', highlighted: true, term: 'test' });
  });

  test('highlights multiple terms', () => {
    const result = highlightText('This is a test text', ['test', 'text']);
    expect(result).toHaveLength(4);
    expect(result[1]).toEqual({ text: 'test', highlighted: true, term: 'test' });
    expect(result[3]).toEqual({ text: 'text', highlighted: true, term: 'text' });
  });

  test('handles case insensitive matching', () => {
    const result = highlightText('This is a TEST', 'test');
    expect(result[1]).toEqual({ text: 'TEST', highlighted: true, term: 'test' });
  });

  test('handles overlapping matches', () => {
    const result = highlightText('testing test', ['test', 'testing']);
    // The current implementation finds 'test' first, then 'testing' doesn't match due to overlap prevention
    expect(result[0]).toEqual({ text: 'test', highlighted: true, term: 'test' });
    expect(result[1]).toEqual({ text: 'ing ', highlighted: false });
    expect(result[2]).toEqual({ text: 'test', highlighted: true, term: 'test' });
  });

  test('returns original text when no terms provided', () => {
    const result = highlightText('This is a test', []);
    expect(result).toEqual([{ text: 'This is a test', highlighted: false }]);
  });

  test('handles empty text', () => {
    const result = highlightText('', 'test');
    expect(result).toEqual([{ text: '', highlighted: false }]);
  });

  test('limits number of highlights', () => {
    const text = 'test '.repeat(200); // 200 instances of 'test'
    const result = highlightText(text, 'test', { maxHighlights: 50 });
    const highlighted = result.filter(segment => segment.highlighted);
    expect(highlighted.length).toBeLessThanOrEqual(50);
  });
});

describe('getHighlightStats', () => {
  test('calculates correct statistics', () => {
    const segments = [
      { text: 'This is a ', highlighted: false },
      { text: 'test', highlighted: true, term: 'test' },
      { text: ' with ', highlighted: false },
      { text: 'test', highlighted: true, term: 'test' },
      { text: ' words', highlighted: false }
    ];
    
    const stats = getHighlightStats(segments, ['test']);
    expect(stats.totalSegments).toBe(5);
    expect(stats.highlightedSegments).toBe(2);
    expect(stats.uniqueHighlightedTerms).toBe(1);
    expect(stats.hasHighlights).toBe(true);
  });

  test('handles no highlights', () => {
    const segments = [{ text: 'No highlights here', highlighted: false }];
    const stats = getHighlightStats(segments, ['missing']);
    expect(stats.highlightedSegments).toBe(0);
    expect(stats.hasHighlights).toBe(false);
  });
});

describe('createHighlightPreview', () => {
  const longText = 'This is a very long text that contains multiple test words and should be truncated to show context around the first test match in the text.';
  
  test('returns full text when under max length', () => {
    const shortText = 'Short test text';
    const result = createHighlightPreview(shortText, 'test', { maxLength: 100 });
    expect(result.truncated).toBe(false);
    expect(result.text).toBe(shortText);
  });

  test('creates preview around first match', () => {
    const result = createHighlightPreview(longText, 'test', { 
      maxLength: 50, 
      contextLength: 20 
    });
    expect(result.truncated).toBe(true);
    expect(result.text).toContain('test');
    expect(result.text.length).toBeLessThan(longText.length);
  });

  test('handles text with no matches', () => {
    const result = createHighlightPreview(longText, 'nonexistent', { maxLength: 50 });
    expect(result.truncated).toBe(true);
    expect(result.text).toContain('...');
    expect(result.segments[0].highlighted).toBe(false);
  });

  test('includes ellipsis when truncated', () => {
    const result = createHighlightPreview(longText, 'test', { 
      maxLength: 50,
      contextLength: 10
    });
    expect(result.text).toContain('...');
  });
});