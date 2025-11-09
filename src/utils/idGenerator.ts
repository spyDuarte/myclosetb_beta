/**
 * Gera um ID único simples
 * Em produção, você pode usar a biblioteca 'uuid' ou outro gerador mais robusto
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
