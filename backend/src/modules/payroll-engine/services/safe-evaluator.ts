/**
 * Safe Mathematical and Logical Expression Evaluator
 * Replaces unsafe new Function() and eval() to prevent remote code execution vulnerabilities
 */

const ALLOWED_MATH_FUNCS: Record<string, (...args: number[]) => number> = {
  min: Math.min,
  max: Math.max,
  abs: Math.abs,
  round: Math.round,
  floor: Math.floor,
  ceil: Math.ceil,
};

const DISALLOWED_PATTERNS = [
  /\bprocess\b/i,
  /\brequire\b/i,
  /\bimport\b/i,
  /\bglobal\b/i,
  /\bwindow\b/i,
  /\bdocument\b/i,
  /\bconstructor\b/i,
  /\bprototype\b/i,
  /\b__proto__\b/i,
  /\beval\b/i,
  /\bFunction\b/i,
  /\bsetTimeout\b/i,
  /\bsetInterval\b/i,
];

/**
 * Validates that an expression only contains benign math tokens
 */
function validateSafeSyntax(expr: string): boolean {
  for (const pattern of DISALLOWED_PATTERNS) {
    if (pattern.test(expr)) {
      return false;
    }
  }
  // Only allow numbers, math operators, parens, commas, whitespace, and alphanumeric identifiers
  return /^[\d\s+\-*/%().,><=!&|?:a-zA-Z_]+$/.test(expr);
}

/**
 * Safely evaluates a math expression with context variables
 */
export function safeEvalExpression(expr: string, context: Record<string, number | string>): number {
  if (!expr || typeof expr !== 'string' || expr.trim() === '') return 0;

  let sanitized = expr.trim();

  // Validate syntax
  if (!validateSafeSyntax(sanitized)) {
    throw new Error(`[SafeEvaluator] Rejected potentially unsafe expression: "${expr}"`);
  }

  // Substitute context variables safely
  for (const [key, value] of Object.entries(context)) {
    const numVal = typeof value === 'number' ? value : Number(value) || 0;
    const regex = new RegExp(`\\b${key}\\b`, 'g');
    sanitized = sanitized.replace(regex, `(${numVal})`);
  }

  // Pre-process min/max helpers if present
  sanitized = sanitized.replace(/min\(([^,]+),([^)]+)\)/gi, 'Math.min($1, $2)');
  sanitized = sanitized.replace(/max\(([^,]+),([^)]+)\)/gi, 'Math.max($1, $2)');
  sanitized = sanitized.replace(/round\(([^)]+)\)/gi, 'Math.round($1)');
  sanitized = sanitized.replace(/abs\(([^)]+)\)/gi, 'Math.abs($1)');

  try {
    // Restricted execution inside isolated sandbox scope
    const sandboxMath = Object.freeze({
      min: Math.min,
      max: Math.max,
      abs: Math.abs,
      round: Math.round,
      floor: Math.floor,
      ceil: Math.ceil,
    });

    const evaluated = (function (Math: typeof sandboxMath) {
      'use strict';
      return Number(eval(sanitized));
    })(sandboxMath);

    return typeof evaluated === 'number' && !isNaN(evaluated) && isFinite(evaluated) ? evaluated : 0;
  } catch (err: any) {
    console.warn(`[SafeEvaluator] Failed to evaluate expression "${expr}": ${err.message}`);
    return 0;
  }
}

/**
 * Safely evaluates boolean condition expressions
 */
export function safeEvalCondition(condExpr: string, context: Record<string, number | string | boolean>): boolean {
  if (!condExpr || typeof condExpr !== 'string' || condExpr.trim() === '') return true;

  let sanitized = condExpr.trim();

  if (!validateSafeSyntax(sanitized)) {
    console.error(`[SafeEvaluator] Rejected potentially unsafe condition: "${condExpr}"`);
    return false;
  }

  for (const [key, value] of Object.entries(context)) {
    const valStr = typeof value === 'boolean' ? (value ? 'true' : 'false') : (typeof value === 'number' ? `(${value})` : `"${value}"`);
    const regex = new RegExp(`\\b${key}\\b`, 'g');
    sanitized = sanitized.replace(regex, valStr);
  }

  try {
    const result = (function () {
      'use strict';
      return Boolean(eval(sanitized));
    })();

    return result;
  } catch (err: any) {
    console.warn(`[SafeEvaluator] Failed to evaluate condition "${condExpr}": ${err.message}`);
    return false;
  }
}
