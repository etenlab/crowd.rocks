export const mockMapWithContentList: TMapWithContentList = [
  {
    id: '1',
    name: 'map 1',
    languageCode: 'en',
    dialectCode: undefined,
    geoCode: undefined,
    createdAt: new Date().toISOString(),
    createdByUserId: '1',
    content: `<?xml version="1.0" encoding="UTF-8"?>
      <svg id="Layers" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 634.2 497">

        <g id="Labels">
            <text class="cls-34" transform="translate(280.75 220.48)"><tspan class="cls-25" x="0" y="0">1R</tspan><tspan x="3.25" y="0">o</tspan><text>me</text></text>
          <text class="cls-34" transform="translate(408.85 281.43)"><tspan class="cls-17" x="0" y="0">A</tspan><tspan class="cls-57" x="3.61" y="0">thens</tspan></text>
      </g>
      </svg>`,
  },
  {
    id: '2',
    name: 'map 2',
    languageCode: 'en',
    dialectCode: undefined,
    geoCode: undefined,
    createdAt: new Date().toISOString(),
    createdByUserId: '1',
    content: `<?xml version="1.0" encoding="UTF-8"?>
      <svg id="Layers" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 634.2 497">

        <g id="Labels">
            <text class="cls-34" transform="translate(280.75 220.48)"><tspan class="cls-25" x="0" y="0">2R</tspan><tspan x="3.25" y="0">o</tspan><text>me</text></text>
          <text class="cls-34" transform="translate(408.85 281.43)"><tspan class="cls-17" x="0" y="0">A</tspan><tspan class="cls-57" x="3.61" y="0">thens</tspan></text>
      </g>
      </svg>`,
  },
  {
    id: '3',
    name: 'map 3',
    languageCode: 'en',
    dialectCode: undefined,
    geoCode: undefined,
    createdAt: new Date().toISOString(),
    createdByUserId: '1',
    content: `<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" preserveAspectRatio="xMidYMid meet"><metadata><rdf:RDF><cc:Work><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"/><dc:title>Jdenticon</dc:title><dc:creator><cc:Agent><dc:title>Daniel Mester Pirttijärvi</dc:title></cc:Agent></dc:creator><dc:source>https://github.com/dmester/jdenticon</dc:source><cc:license rdf:resource="https://github.com/dmester/jdenticon/blob/master/LICENSE"/></cc:Work></rdf:RDF></metadata><mask id="avatarsRadiusMask"><rect width="50" height="50" rx="0" ry="0" x="0" y="0" fill="#fff"/></mask><g mask="url(#avatarsRadiusMask)"><path fill="#e8bac0" d="M19 1L25 7L19 13L13 7ZM37 7L31 13L25 7L31 1ZM31 49L25 43L31 37L37 43ZM13 43L19 37L25 43L19 49ZM7 13L13 19L7 25L1 19ZM49 19L43 25L37 19L43 13ZM43 37L37 31L43 25L49 31ZM1 31L7 25L13 31L7 37Z"/><path fill="#545454" d="M1 1L13 1L13 13ZM49 1L49 13L37 13ZM49 49L37 49L37 37ZM1 49L1 37L13 37Z"/><path fill="#d17581" d="M17.8 25a7.2,7.2 0 1,1 14.4,0a7.2,7.2 0 1,1 -14.4,0"/></g></svg>`,
  },
];

export const mockMapList: TMapsList = mockMapWithContentList.map((m) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { content, ...n } = m;
  return n;
});

export const mockMapWords: TWordTranslated[] = [
  {
    word: {
      id: '1',
      content: 'Athens',
      languageCode: 'en',
      description: 'description for Athens',
    },
    translation: {
      word: {
        id: '11',
        content: 'uk-Athens11',
        languageCode: 'uk',
        description: 'nice description uk-Athens11',
      },
    },
  },
  {
    word: {
      id: '2',
      content: 'Rome',
      languageCode: 'en',
      description: 'description for Rome',
    },
    translation: {
      word: {
        id: '21',
        content: 'uk-Rome',
        languageCode: 'uk',
        description: 'nice description uk-Rome',
      },
    },
  },
  {
    word: {
      id: '3',
      content: '3Rome',
      languageCode: 'en',
      description: 'description for 3Rome',
    },
  },
];

export const mockWordTranslations: TWordWithTranslations = {
  word: {
    id: '1',
    content: 'Athens',
    languageCode: 'en',
    description: 'nice description Athens',
  },
  translationsVoted: [
    {
      word: {
        id: '11',
        content: 'uk-Athens11',
        languageCode: 'uk',
        description: 'nice description uk-Athens11',
      },
      votes: { up: 2, down: 3 },
    },
    {
      word: {
        id: '12',
        content: 'uk-Athens12',
        languageCode: 'uk',
        description: 'nice description uk-Athens12',
      },
      votes: { up: 2, down: 3 },
    },
    {
      word: {
        id: '13',
        content: 'uk-Athens13',
        languageCode: 'uk',
        description: 'nice description uk-Athens13',
      },
      votes: { up: 2, down: 3 },
    },
    {
      word: {
        id: '14',
        content: 'apq-Athens14',
        languageCode: 'apq',
        description: 'nice description apq-Athens14',
      },
      votes: { up: 2, down: 3 },
    },
  ],
};
