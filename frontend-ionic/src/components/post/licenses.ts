export type LicenseEntry = {
  id: number;
  title: string;
  url: string | null;
};

export const licenses: Array<LicenseEntry> = [
  {
    id: 1,
    title: 'All Rights Reserved',
    url: 'https://www.copyright.gov/help/faq/faq-general.html',
  },
  {
    id: 2,
    title: 'CC BY-NC-ND 4.0',
    url: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
  },
  {
    id: 3,
    title: 'CC BY-ND 4.0',
    url: 'https://creativecommons.org/licenses/by-nd/4.0/',
  },
  {
    id: 4,
    title: 'CC BY-NC-SA 4.0',
    url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
  },
  {
    id: 5,
    title: 'CC BY-NC 4.0',
    url: 'https://creativecommons.org/licenses/by-nc/4.0/',
  },
  {
    id: 6,
    title: 'CC BY-SA 4.0',
    url: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  {
    id: 7,
    title: 'CC BY 4.0',
    url: 'https://creativecommons.org/licenses/by/4.0/',
  },
  {
    id: 8,
    title: 'CCO',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
];
