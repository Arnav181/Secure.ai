/**
 * Tests for Law Data Structure and Utilities
 */

import { lawsData } from './lawsData.js';
import { validateLawsArray, validateLaw } from './lawValidation.js';
import { searchLaws, getLawsByCategory, sortLaws } from './lawHelpers.js';

describe('Law Data Structure', () => {
  test('lawsData should be an array', () => {
    expect(Array.isArray(lawsData)).toBe(true);
  });

  test('lawsData should not be empty', () => {
    expect(lawsData.length).toBeGreaterThan(0);
  });

  test('each law should have required properties', () => {
    lawsData.forEach(law => {
      expect(law).toHaveProperty('id');
      expect(law).toHaveProperty('act');
      expect(law).toHaveProperty('section');
      expect(law).toHaveProperty('theory');
      expect(law).toHaveProperty('keywords');
      expect(law).toHaveProperty('lastUpdated');
    });
  });
});

describe('Law Validation', () => {
  test('validateLawsArray should validate all laws', () => {
    const validation = validateLawsArray(lawsData);
    expect(validation.isValid).toBe(true);
    expect(validation.validLaws.length).toBe(lawsData.length);
  });

  test('validateLaw should validate individual law', () => {
    const firstLaw = lawsData[0];
    const validation = validateLaw(firstLaw);
    expect(validation.isValid).toBe(true);
  });
});

describe('Law Helper Functions', () => {
  test('searchLaws should find matching laws', () => {
    const results = searchLaws('data protection', lawsData);
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(law => 
      law.act.toLowerCase().includes('data protection') ||
      law.section.toLowerCase().includes('data protection') ||
      law.theory.toLowerCase().includes('data protection') ||
      law.keywords.some(keyword => keyword.toLowerCase().includes('data protection')) ||
      (law.category && law.category.toLowerCase().includes('data protection'))
    )).toBe(true);
  });

  test('getLawsByCategory should filter by category', () => {
    const cyberCrimesLaws = getLawsByCategory('Cyber Crimes', lawsData);
    expect(cyberCrimesLaws.every(law => law.category === 'Cyber Crimes')).toBe(true);
  });

  test('sortLaws should sort laws correctly', () => {
    const sortedLaws = sortLaws(lawsData, 'section', 'asc');
    expect(sortedLaws.length).toBe(lawsData.length);
    
    // Check if sorted (basic check for first few items)
    for (let i = 1; i < Math.min(3, sortedLaws.length); i++) {
      expect(sortedLaws[i-1].section.localeCompare(sortedLaws[i].section)).toBeLessThanOrEqual(0);
    }
  });
});