/**
 * Input validation schemas using Zod.
 */

import { z } from 'zod';
import { PuzzleOptions } from './types';

// Puzzle options schema
export const PuzzleOptionsSchema = z.object({
    size: z.number().int().min(10).max(15),
    allowDiagonal: z.boolean(),
    allowBackward: z.boolean(),
});

// Create puzzle input schema
export const CreatePuzzleSchema = z.object({
    title: z.string().min(1).max(200).trim(),
    description: z.string().max(1000).trim().optional().nullable(),
    authorName: z.string().max(50).trim().optional().nullable(),
    words: z.array(z.string().min(2).max(20)).min(10).max(30),
    options: PuzzleOptionsSchema,
    seed: z.number().int().positive().optional(),
});

// Update puzzle input schema
export const UpdatePuzzleSchema = z.object({
    editKey: z.string().min(1),
    title: z.string().min(1).max(200).trim().optional(),
    description: z.string().max(1000).trim().optional().nullable(),
    words: z.array(z.string().min(2).max(20)).min(10).max(30).optional(),
    options: PuzzleOptionsSchema.optional(),
    regenerate: z.boolean().optional(),
});

// Delete puzzle input schema
export const DeletePuzzleSchema = z.object({
    editKey: z.string().min(1),
});

// Puzzle ID schema
export const PuzzleIdSchema = z.string().uuid('Invalid puzzle ID');

// Export types
export type CreatePuzzleInput = z.infer<typeof CreatePuzzleSchema>;
export type UpdatePuzzleInput = z.infer<typeof UpdatePuzzleSchema>;
export type DeletePuzzleInput = z.infer<typeof DeletePuzzleSchema>;

/**
 * Validate create puzzle input.
 */
export function validateCreateInput(data: unknown): CreatePuzzleInput {
    return CreatePuzzleSchema.parse(data);
}

/**
 * Validate update puzzle input.
 */
export function validateUpdateInput(data: unknown): UpdatePuzzleInput {
    return UpdatePuzzleSchema.parse(data);
}

/**
 * Validate delete puzzle input.
 */
export function validateDeleteInput(data: unknown): DeletePuzzleInput {
    return DeletePuzzleSchema.parse(data);
}

/**
 * Validate puzzle ID.
 */
export function validatePuzzleId(id: unknown): string {
    return PuzzleIdSchema.parse(id);
}
