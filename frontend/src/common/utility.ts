import { useState } from 'react';
export type TLangCodes = {
  language_code: string;
  dialect_code?: string | null | undefined;
  geo_code?: string | null | undefined;
};

export enum StringContentTypes {
  WORD = 'word',
  PHRASE = 'phrase',
}

export function useForceUpdate() {
  const [value, setState] = useState(true);
  return () => setState(!value);
}

const days_of_week = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export function get_datetime_string(created_at: string) {
  const timestamp = new Date(+created_at);
  return days_of_week[timestamp.getDay()] + ' ' + timestamp.toLocaleString();
}

export function get_cardinal_suffix(vote: number): string {
  const remainder = vote % 10;
  const is_eleventy = vote % 100 > 10 && vote % 100 < 20;

  let suffix: string;

  switch (remainder) {
    case 0: {
      suffix = 'th';
      break;
    }
    case 1: {
      if (is_eleventy) {
        suffix = 'th';
      } else {
        suffix = 'st';
      }
      break;
    }
    case 2: {
      if (is_eleventy) {
        suffix = 'th';
      } else {
        suffix = 'nd';
      }
      break;
    }
    case 3: {
      if (is_eleventy) {
        suffix = 'th';
      } else {
        suffix = 'rd';
      }
      break;
    }
    default:
      suffix = 'th';
  }

  return suffix;
}

export const downloadFromUrl = (file_name: string, file_url: string) => {
  const hiddenElement = document.createElement('a');
  hiddenElement.href = encodeURI(file_url);
  hiddenElement.download = file_name;
  hiddenElement.click();
};

export const downloadFromSrc = (file_name: string, src: string) => {
  const hiddenElement = document.createElement('a');
  hiddenElement.href = src;
  hiddenElement.download = file_name;
  hiddenElement.click();
};

export const typeOfString = (wordOrPhrase: string): StringContentTypes => {
  const parts = wordOrPhrase.split(' ');
  if (parts.length === 1) return StringContentTypes.WORD;
  return StringContentTypes.PHRASE;
};
