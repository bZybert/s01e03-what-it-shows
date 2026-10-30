// The problems inside a merged ticket, one per fix. causes.ts says which way a report's date went
// wrong; desk-notes.json lists the reports the desk read as a one-day move, which neither cause makes.
import { causeOf, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = 'parser' | 'hint' | 'one-day-move' | 'unplaced';

// Each problem has its own ticket in the repo that holds this kb.
export const TICKETS_AT = 'https://github.com/bZybert/s01e03-what-it-shows/issues';

export const PROBLEMS: Record<Problem, { what: string; ticket: number | null }> = {
  parser: { what: 'the shared parser reads a day-first date month first: day and month swap', ticket: 1 },
  hint: { what: 'booking-v3 prints MM/DD/YYYY under its date field; people type month first, the form reads day first', ticket: 2 },
  'one-day-move': { what: 'the date moves by one day, not a swap: a time-zone shift', ticket: 3 },
  unplaced: { what: 'no tenant on file, or a tenant that writes the month first', ticket: null },
};

export function problemOf(r: Report, t: Tenant | undefined, oneDayMove: readonly string[]): Problem {
  if (oneDayMove.includes(r.id)) return 'one-day-move';
  return causeOf(r, t) ?? 'unplaced';
}

export type ProblemGroup = {
  problem: Problem;
  reports: Report[];
  tenants: number;
  firstSeen: string;
  lastSeen: string;
};

export function groupByProblem(
  reports: Report[],
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): ProblemGroup[] {
  const byProblem = new Map<Problem, Report[]>();
  for (const r of reports) {
    const p = problemOf(r, tenantOf(r), oneDayMove);
    byProblem.set(p, [...(byProblem.get(p) ?? []), r]);
  }
  return [...byProblem.entries()]
    .map(([problem, rs]) => {
      const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
      return {
        problem,
        reports: rs,
        tenants: new Set(rs.map((r) => r.tenant)).size,
        firstSeen: days[0],
        lastSeen: days[days.length - 1],
      };
    })
    .sort((a, b) => b.reports.length - a.reports.length);
}
