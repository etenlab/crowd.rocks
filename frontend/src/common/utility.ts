import { useState } from "react";

export function useForceUpdate() {
  let [value, setState] = useState(true);
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
]

export function get_datetime_string(created_at: string) {
  const timestamp = new Date(+created_at)
  return days_of_week[timestamp.getDay()] + ' ' + timestamp.toLocaleString()
}

export function get_cardinal_suffix(vote: number): string {
  const remainder = vote % 10
  const is_eleventy = vote % 100 > 10 && vote % 100 < 20

  let suffix: string

  switch (remainder) {
    case 0: {
      suffix = 'th'
      break
    }
    case 1: {
      if (is_eleventy) {
        suffix = 'th'
      } else {
        suffix = 'st'
      }
      break
    }
    case 2: {
      if (is_eleventy) {
        suffix = 'th'
      } else {
        suffix = 'nd'
      }
      break
    }
    case 3: {
      if (is_eleventy) {
        suffix = 'th'
      } else {
        suffix = 'rd'
      }
      break
    }
    default:
      suffix = 'th'
  }

  return suffix
}