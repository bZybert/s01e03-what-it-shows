<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { groupByCause, readAs, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { PROBLEMS, TICKETS_AT } from '#lib/kb/problems';

  let { ticket }: { ticket: number } = $props();

  // The desk's own count: by cause, as CauseTable does.
  const merged = $derived(uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket));
  const groups = $derived(groupByCause(merged, tenantOf));
  const link = (n: number) => `${TICKETS_AT}/${n}`;
</script>

<p class="sum">
  <strong>{merged.length}</strong> reports merged into #{ticket} ·
  <strong>{groups.length}</strong>
  {groups.length === 1 ? 'cause' : 'causes'} · one ticket per problem
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>what goes wrong</th><th>tenants</th><th>seen</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each groups as g (g.cause)}
      {@const p = g.cause === 'unplaced' ? null : PROBLEMS[g.cause]}
      <tr>
        <td><code>{g.cause}</code></td>
        <td><strong>{g.reports.length}</strong></td>
        <td class="what">{p?.what ?? 'no tenant on file, or a tenant that writes the month first'}</td>
        <td>{g.tenants}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
        <td>{#if p}<a href={link(p.ticket)}>#{p.ticket}</a>{:else}none{/if}</td>
      </tr>
    {/each}
  </tbody>
</table>

{#each groups as g (g.cause)}
  {@const moved = readAs(g, notes.oneDayMove)}
  {#if moved}
    {@const p = PROBLEMS['one-day-move']}
    <p class="note">
      <code>one-day-move</code>: <strong>{moved}</strong> of the <code>{g.cause}</code> reports read as a one-day
      move ({p.what}). Counted under <code>{g.cause}</code>, where they are filed; their own ticket is
      <a href={link(p.ticket)}>#{p.ticket}</a>.
    </p>
  {/if}
{/each}

<style>
  .sum { font-size: 1.1rem; }
  .what { color: var(--muted); font-size: 0.85em; }
  .note { color: var(--muted); font-size: 0.85em; }
</style>
