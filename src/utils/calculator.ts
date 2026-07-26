/**
 * Safely evaluates a simple calculator arithmetic expression
 * Supports +, -, × (*), ÷ (/) and decimal numbers.
 */
export function evaluateExpression(expr: string): number | null {
  if (!expr || expr.trim() === '') return 0;

  try {
    // Sanitize and replace symbols with JS operators
    const sanitized = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/,/g, '')
      .replace(/[^0-9+\-*/.]/g, '');

    // Avoid trailing operator before evaluation
    const cleanExpr = sanitized.replace(/[+\-*/]+$/, '');
    if (!cleanExpr) return 0;

    // Use Function to evaluate sanitized expression safely
    // eslint-disable-next-line no-new-func
    const result = new Function(`return (${cleanExpr})`)();
    if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
      return Math.round(result * 100) / 100;
    }
    return null;
  } catch {
    return null;
  }
}

export function formatCalculatorDisplay(expr: string): string {
  if (!expr) return '0';
  return expr;
}
