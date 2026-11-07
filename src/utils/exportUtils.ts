/**
 * Export and Reporting Utilities for AccessGuard
 * Handles CSV generation and formatted printable compliance audit reports.
 */

export function exportToCsv(rows: Record<string, unknown>[], filename: string) {
  if (!rows || !rows.length) return;

  const separator = ',';
  const keys = Object.keys(rows[0]);
  
  const csvContent = [
    keys.map(k => `"${k}"`).join(separator),
    ...rows.map(row => 
      keys.map(key => {
        let val = row[key];
        if (val === null || val === undefined) {
          val = '';
        } else if (typeof val === 'object') {
          val = JSON.stringify(val);
        }
        const stringVal = String(val).replace(/"/g, '""');
        return `"${stringVal}"`;
      }).join(separator)
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function printComplianceReport() {
  window.print();
}
