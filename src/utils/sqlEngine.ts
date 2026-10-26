import alasql from 'alasql';
import { ChartConfig } from '../types';

export interface SQLValidationResult {
  valid: boolean;
  error?: string;
}

export interface SQLExecutionResult {
  sql: string;
  columns: string[];
  rows: Record<string, any>[];
  durationMs: number;
  explanation: string;
  chart?: ChartConfig;
}

const FORBIDDEN_SQL_KEYWORDS = [
  'DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'TRUNCATE',
  'CREATE', 'REPLACE', 'GRANT', 'REVOKE', 'EXEC', 'EXECUTE',
  'SHUTDOWN', 'MERGE', 'CALL', 'INTO OUTFILE', 'INTO DUMPFILE'
];

export function validateSafeSQL(sql: string): SQLValidationResult {
  const trimmed = sql.trim();
  if (!trimmed) {
    return { valid: false, error: 'Query cannot be empty.' };
  }

  const normalized = trimmed.toUpperCase();

  // Must start with SELECT or WITH
  if (!normalized.startsWith('SELECT') && !normalized.startsWith('WITH')) {
    return {
      valid: false,
      error: 'Security Constraint: Only analytical read-only SELECT queries are permitted.'
    };
  }

  // Prevent forbidden mutation keywords
  for (const keyword of FORBIDDEN_SQL_KEYWORDS) {
    // Check keyword with word boundary
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    if (regex.test(trimmed)) {
      return {
        valid: false,
        error: `Security Violation: Mutative keyword "${keyword}" is strictly blocked in analytical session.`
      };
    }
  }

  // Prevent multiple semicolons / stacked queries
  const statements = trimmed.split(';').map(s => s.trim()).filter(Boolean);
  if (statements.length > 1) {
    return {
      valid: false,
      error: 'Security Constraint: Stacked multi-statement queries are prohibited.'
    };
  }

  return { valid: true };
}

export async function runDatasetSQL(
  sql: string,
  tableName: string,
  data: Record<string, any>[]
): Promise<SQLExecutionResult> {
  const validation = validateSafeSQL(sql);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const startTime = performance.now();

  try {
    // Replace references to tableName or 'dataset' or 'data' with the parameter placeholder '?'
    // Regex matches words matching tableName or 'dataset' or 'sales' after FROM or JOIN
    const cleanTableName = tableName.replace(/[^a-zA-Z0-9_]/g, '');
    let parameterizedSQL = sql;

    // Normalize table names in query to '?' for alasql
    const tableRegex = new RegExp(`\\b(FROM|JOIN)\\s+["']?(${cleanTableName}|dataset|data|table)["']?`, 'gi');
    parameterizedSQL = parameterizedSQL.replace(tableRegex, '$1 ?');

    // If query still has a custom table name after FROM without placeholder
    if (!parameterizedSQL.includes('?')) {
      parameterizedSQL = parameterizedSQL.replace(/\bFROM\s+([a-zA-Z0-9_]+)/i, 'FROM ?');
    }

    const rawResult = alasql(parameterizedSQL, [data]);
    const endTime = performance.now();
    const durationMs = Math.round(endTime - startTime);

    const rows: Record<string, any>[] = Array.isArray(rawResult) ? rawResult : [rawResult];
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

    // Formulate automated explanation
    let explanation = `Analytical query retrieved ${rows.length} rows in ${durationMs}ms.`;
    if (sql.toUpperCase().includes('GROUP BY')) {
      const match = sql.match(/GROUP BY\s+([a-zA-Z0-9_,\s]+)/i);
      explanation = `Aggregated metrics grouped by ${match ? match[1].trim() : 'categories'}, returning ${rows.length} summary dimensions.`;
    } else if (sql.toUpperCase().includes('ORDER BY')) {
      explanation = `Ranked and sorted observations based on specified criteria, isolating top records.`;
    }

    // Auto-generate chart if 2 columns exist and 1 is numeric
    let chart: ChartConfig | undefined;
    if (columns.length >= 2 && rows.length > 0 && rows.length <= 20) {
      const colX = columns[0];
      const colY = columns[1];
      const isYNumeric = rows.some(r => typeof r[colY] === 'number');

      if (isYNumeric) {
        chart = {
          id: `sql-chart-${Date.now()}`,
          title: `Visualized Result: ${colY} by ${colX}`,
          chartType: rows.length <= 6 ? 'bar' : 'area',
          xAxisKey: colX,
          yAxisKeys: [colY],
          data: rows,
          explanation: `Direct visual projection of SQL result table.`,
          whySelected: `Generated dynamically to reflect grouping on ${colX}.`,
          keyObservation: `Highlights variance across queried dimensions.`
        };
      }
    }

    return {
      sql,
      columns,
      rows,
      durationMs,
      explanation,
      chart
    };
  } catch (err: any) {
    throw new Error(`SQL Execution Error: ${err.message || String(err)}`);
  }
}

// Natural Language to SQL template mapper for common queries
export function generateHeuristicSQL(query: string, columns: string[]): { sql: string; explanation: string } {
  const q = query.toLowerCase();
  const numCols = columns.filter(c => ['sales', 'revenue', 'profit', 'spend', 'spend', 'amount', 'salary', 'tenure_months', 'clicks', 'impressions'].some(k => c.toLowerCase().includes(k)));
  const catCols = columns.filter(c => ['region', 'category', 'channel', 'department', 'platform', 'status', 'returned', 'plan'].some(k => c.toLowerCase().includes(k)));

  const primaryNum = numCols[0] || (columns.find(c => c !== 'id') || 'sales');
  const primaryCat = catCols[0] || (columns.find(c => c !== primaryNum) || 'category');

  if (q.includes('by') || q.includes('per') || q.includes('breakdown')) {
    // Find mentioned category
    const matchedCat = columns.find(c => q.includes(c.toLowerCase())) || primaryCat;
    const matchedNum = columns.find(c => q.includes(c.toLowerCase()) && c !== matchedCat) || primaryNum;
    return {
      sql: `SELECT ${matchedCat}, SUM(${matchedNum}) AS total_${matchedNum}, COUNT(*) AS record_count\nFROM dataset\nGROUP BY ${matchedCat}\nORDER BY total_${matchedNum} DESC;`,
      explanation: `Aggregates ${matchedNum} partitioned across ${matchedCat} tiers sorted in descending volume.`
    };
  }

  if (q.includes('top') || q.includes('highest') || q.includes('best') || q.includes('max')) {
    const limitMatch = q.match(/\b(\d+)\b/);
    const limit = limitMatch ? limitMatch[1] : '5';
    return {
      sql: `SELECT *\nFROM dataset\nORDER BY ${primaryNum} DESC\nLIMIT ${limit};`,
      explanation: `Filters and extracts the top ${limit} performing records ranked by highest ${primaryNum}.`
    };
  }

  if (q.includes('average') || q.includes('avg') || q.includes('mean')) {
    return {
      sql: `SELECT AVG(${primaryNum}) AS avg_${primaryNum}, MIN(${primaryNum}) AS min_${primaryNum}, MAX(${primaryNum}) AS max_${primaryNum}\nFROM dataset;`,
      explanation: `Calculates key central tendency metrics for ${primaryNum}.`
    };
  }

  if (q.includes('unusual') || q.includes('anomaly') || q.includes('outlier')) {
    return {
      sql: `SELECT *\nFROM dataset\nWHERE ${primaryNum} > (SELECT AVG(${primaryNum}) * 2.5 FROM dataset)\nORDER BY ${primaryNum} DESC;`,
      explanation: `Queries records displaying values 2.5x greater than the population mean.`
    };
  }

  // Default fallback analytical summary
  return {
    sql: `SELECT ${primaryCat}, COUNT(*) AS total_records, ROUND(AVG(${primaryNum}), 2) AS avg_${primaryNum}, SUM(${primaryNum}) AS sum_${primaryNum}\nFROM dataset\nGROUP BY ${primaryCat}\nORDER BY sum_${primaryNum} DESC;`,
    explanation: `Multi-metric summary aggregation grouped by ${primaryCat}.`
  };
}
