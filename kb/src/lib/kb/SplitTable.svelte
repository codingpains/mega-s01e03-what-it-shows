<script lang="ts">
  // #4471 split by cause, counted the desk's way (causes.ts, as exported), with the ticket each cause got.
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { groupByCause, readAs, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  type Filed = { href: string; state: string };
  // tickets: cause → the ticket filed for it; oneDay: the ticket for the desk's one-day moves.
  let { ticket, tickets = {}, oneDay }: { ticket: number; tickets?: Record<string, Filed>; oneDay?: Filed } = $props();

  const merged = $derived(uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket));
  const groups = $derived(groupByCause(merged, tenantOf));
  const sum = $derived(groups.reduce((n, g) => n + g.reports.length, 0));
  const tags = (m: Record<string, number>) =>
    Object.entries(m)
      .sort((a, b) => b[1] - a[1])
      .map(([k, n]) => `${k} ×${n}`)
      .join(' · ');
  const label = (href: string) => '#' + href.split('/').pop();
</script>

<p class="sum">
  <strong>{merged.length}</strong> reports merged into #{ticket} · <strong>{groups.length}</strong>
  {groups.length === 1 ? 'cause' : 'causes'}
  {#if sum !== merged.length}<span class="off"> · causes add up to {sum}, not {merged.length}</span>{/if}
</p>

<table>
  <thead>
    <tr><th>cause</th><th>reports</th><th>tenants</th><th>intake tagged</th><th>seen</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each groups as g (g.cause)}
      {@const filed = tickets[g.cause]}
      <tr>
        <td><code>{g.cause}</code></td>
        <td><strong>{g.reports.length}</strong></td>
        <td>{g.tenants}</td>
        <td class="small">{tags(g.taggedAs)}</td>
        <td class="small">{g.firstSeen} → {g.lastSeen}</td>
        <td>{#if filed}<a href={filed.href}>{label(filed.href)}</a> · {filed.state}{:else}<span class="off">no ticket</span>{/if}</td>
      </tr>
    {/each}
  </tbody>
</table>

{#each groups as g (g.cause)}
  {@const moved = readAs(g, notes.oneDayMove)}
  {#if moved}
    <p class="note">
      {moved} of the <code>{g.cause}</code> reports read as a one-day move, not a swap. Counted under
      <code>{g.cause}</code> by tenant;
      {#if oneDay}their own ticket: <a href={oneDay.href}>{label(oneDay.href)}</a> · {oneDay.state}.{:else}<span class="off">no ticket of their own.</span>{/if}
    </p>
  {/if}
{/each}

<style>
  .sum { font-size: 1.1rem; }
  .small { color: var(--muted); font-size: 0.85em; }
  .note { color: var(--muted); font-size: 0.85em; }
  .off { color: var(--warn); font-weight: 600; }
</style>
