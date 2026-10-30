// The problems inside a merged ticket, one per fix, each with its own ticket. They are counted the
// way the desk counts (causes.ts, desk-notes.json): by cause, and a report the desk read as a
// one-day move stays counted where it is filed, footnoted under it.
import type { Cause } from '#lib/kb/causes';

export type Problem = Cause | 'one-day-move';

// Each problem has its own ticket in the repo that holds this kb.
export const TICKETS_AT = 'https://github.com/bZybert/s01e03-what-it-shows/issues';

export const PROBLEMS: Record<Problem, { what: string; ticket: number }> = {
  parser: { what: 'the shared parser reads a day-first date month first: day and month swap', ticket: 1 },
  hint: { what: 'booking-v3 prints MM/DD/YYYY under its date field; people type month first, the form reads day first', ticket: 2 },
  'one-day-move': { what: 'the date moves by one day, not a swap: a time-zone shift', ticket: 3 },
};
