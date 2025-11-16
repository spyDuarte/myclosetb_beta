import { v4 as uuidv4 } from 'uuid';

/**
 * Gera um ID único usando UUID v4
 * Garante unicidade global, mesmo em operações simultâneas
 */
export function generateId(): string {
  return uuidv4();
}
