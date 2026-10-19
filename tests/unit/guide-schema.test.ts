import { describe, expect, it } from 'vitest';
import { guideSchema } from '../../src/content/schema';

const valid = {
  title: 'Install and run your first gate',
  description:
    'Install Pro Web Design Suite in Claude Code, then run the design audit on a project and read what it found.',
  series: 'getting-started',
  order: 1,
  checkedAgainst: '4.0.0',
  published: '2026-11-01',
  commands: ['gate', 'install-gate'],
  skills: ['web-design-studio'],
};

describe('guideSchema', () => {
  it('accepts a complete guide and fills the defaults', () => {
    const guide = guideSchema.parse(valid);
    expect(guide.published).toBeInstanceOf(Date);
    expect(guide.draft).toBe(false);
  });

  it('defaults the commands and skills to none', () => {
    const { commands: _c, skills: _s, ...rest } = valid;
    const guide = guideSchema.parse(rest);
    expect(guide.commands).toEqual([]);
    expect(guide.skills).toEqual([]);
  });

  it.each([
    ['a version that is not x.y.z', { checkedAgainst: '4.0' }],
    ['a description too short for a search snippet', { description: 'Too short.' }],
    ['a description longer than a search snippet', { description: 'x'.repeat(161) }],
    ['a title longer than a search title', { title: 'x'.repeat(71) }],
    ['an order of zero', { order: 0 }],
    ['a command written with its plugin prefix', { commands: ['/pro-web-design-suite:gate'] }],
    ['a series with capitals', { series: 'Getting-Started' }],
  ])('refuses %s', (_name, change) => {
    expect(guideSchema.safeParse({ ...valid, ...change }).success).toBe(false);
  });

  it('refuses a guide with no checked-against version', () => {
    const { checkedAgainst: _v, ...rest } = valid;
    expect(guideSchema.safeParse(rest).success).toBe(false);
  });
});
