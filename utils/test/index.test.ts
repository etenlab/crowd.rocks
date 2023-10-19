import { getLangsRegistry, sum } from '../src/index';

describe('sum', () => {
  it('adds two numbers together', () => {
    expect(sum(1, 1)).toEqual(2);
  });
});

describe('langUtils', () => {
  it('tests if additional languges are included', async () => {
    const lngs = await getLangsRegistry();
    for (const xName of [
      'Senga',
      'Fungwe',
      'Lambya',
      'Tambo',
      'Wandya',
      'Lungu',
      'Kunda',
      'Chikunda',
      'Mukulu',
      'Kabdende',
      'Shila',
      'Mwenyi',
      'Liuwa',
    ]) {
      const found = lngs.langs.findIndex((l) => {
        for (const description of l.descriptions!) {
          if (description.includes(xName)) {
            return true;
          }
        }
      });

      if (found < 0) {
        console.log('absent:', xName);
        expect(found).toBeGreaterThanOrEqual(0);
      }
    }
  });
});
