import {
  LanguageInfo,
  LanguageInput,
  X_LANG_TAGS,
  getLangsRegistry,
  langInfo2String,
  langInfo2tag,
  languageInput2tag,
  subTags2LangInfo,
  tag2langInfo,
} from '../src/index';

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

  it('tag2langInfo should convert xTag with tag2langInfo', () => {
    const tag = 'x-lungu';
    const xLang = X_LANG_TAGS.find((xt) => xt.tag === tag);
    expect(tag2langInfo(tag)).toEqual({ lang: xLang });
  });

  it('langInfo2tag should convert x-language langInfo to xTag', () => {
    const xLangInfo: LanguageInfo = {
      lang: { tag: 'x-lungu', descriptions: ['Lungu'] },
    };
    expect(langInfo2tag(xLangInfo)).toEqual('x-lungu');
  });

  it('langInfo2String should convert x-language langInfo to string ', () => {
    const xLangInfo: LanguageInfo = {
      lang: { tag: 'x-lungu', descriptions: ['Lungu'] },
    };
    expect(langInfo2String(xLangInfo)).toEqual('Lungu');
  });
  it('subTags2LangInfo should convert x-language subtag lang to LangInfo ', () => {
    const xLangSubtags = {
      lang: 'x-lungu',
      region: 'any',
      dialect: 'any',
    };
    expect(subTags2LangInfo(xLangSubtags)).toEqual({
      lang: { tag: 'x-lungu', descriptions: ['Lungu'] },
    } as LanguageInfo);
  });
  it('languageInput2tag should convert x-language subtag lang to LangInfo ', () => {
    const xLangSubtags: LanguageInput = {
      language_code: 'x-lungu',
      dialect_code: 'any',
      geo_code: 'any',
      filter: 'any',
    };
    expect(languageInput2tag(xLangSubtags)).toEqual('x-lungu');
  });
});
