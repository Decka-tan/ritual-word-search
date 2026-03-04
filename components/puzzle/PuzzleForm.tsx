'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Toggle } from '@/components/ui/Toggle';
import { PuzzleOptions, CreatePuzzleInput } from '@/lib/puzzle/types';

interface PuzzleFormProps {
    onSubmit: (data: CreatePuzzleInput) => void;
    isLoading?: boolean;
    defaultValues?: {
        title?: string;
        description?: string;
        words?: string[];
        options?: PuzzleOptions;
    };
    submitLabel?: string;
}

export function PuzzleForm({
    onSubmit,
    isLoading = false,
    defaultValues,
    submitLabel = 'Generate Puzzle',
}: PuzzleFormProps) {
    const [title, setTitle] = useState(defaultValues?.title ?? '');
    const [description, setDescription] = useState(defaultValues?.description ?? '');
    const [words, setWords] = useState(
        defaultValues?.words ? defaultValues.words.join('\n') : ''
    );
    const [size, setSize] = useState(defaultValues?.options?.size ?? 15);
    const [allowDiagonal, setAllowDiagonal] = useState(
        defaultValues?.options?.allowDiagonal ?? true
    );
    const [allowBackward, setAllowBackward] = useState(
        defaultValues?.options?.allowBackward ?? false
    );

    const wordList = words
        .split('\n')
        .map((w) => w.trim().toUpperCase())
        .filter((w) => w.length > 0);

    const wordCount = wordList.length;
    const isValid = wordCount >= 10 && wordCount <= 30;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValid) return;

        onSubmit({
            title,
            description: description || undefined,
            words: wordList,
            options: {
                size,
                allowDiagonal,
                allowBackward,
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
                <label htmlFor="title" className="block text-sm font-bold uppercase mb-2 text-gray-700 dark:text-zinc-300">
                    Title <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <Input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., JavaScript Terms"
                    required
                />
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-bold uppercase mb-2 text-gray-700 dark:text-zinc-300">
                    Description
                </label>
                <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional description for your puzzle..."
                />
            </div>

            {/* Words */}
            <div>
                <label htmlFor="words" className="block text-sm font-bold uppercase mb-2 text-gray-700 dark:text-zinc-300">
                    Word List <span className="text-red-500 dark:text-red-400">*</span>
                    <span className="ml-2 text-gray-500 dark:text-zinc-500">
                        ({wordCount}/30 words)
                    </span>
                </label>
                <Textarea
                    id="words"
                    value={words}
                    onChange={(e) => setWords(e.target.value)}
                    placeholder="Enter one word per line (10-30 words)&#10;FUNCTION&#10;VARIABLE&#10;CONST"
                    required
                />
                {!isValid && wordCount > 0 && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-semibold">
                        {wordCount < 10
                            ? `Need 10 more words (${10 - wordCount} remaining)`
                            : `Too many words (${wordCount - 30} over limit)`}
                    </p>
                )}
            </div>

            {/* Options */}
            <div className="border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 space-y-4 rounded-xl">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 dark:text-zinc-100">Options</h3>

                {/* Grid Size */}
                <div>
                    <label htmlFor="size" className="block text-sm font-bold uppercase mb-2 text-gray-700 dark:text-zinc-300">
                        Grid Size: {size}x{size}
                    </label>
                    <input
                        id="size"
                        type="range"
                        min="10"
                        max="30"
                        value={size}
                        onChange={(e) => setSize(Number(e.target.value))}
                        className="w-full accent-purple-500"
                    />
                    <div className="flex justify-between text-xs font-mono mt-1 text-gray-500 dark:text-zinc-500">
                        <span>10</span>
                        <span>30</span>
                    </div>
                </div>

                <hr className="border-gray-200 dark:border-zinc-700" />

                {/* Toggles */}
                <div className="space-y-2">
                    <Toggle
                        checked={allowDiagonal}
                        onChange={setAllowDiagonal}
                        label="Diagonal Words"
                        icon="📐"
                    />
                    <Toggle
                        checked={allowBackward}
                        onChange={setAllowBackward}
                        label="Backward Words"
                        icon="↩️"
                    />
                </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
                <Button
                    type="submit"
                    disabled={!isValid || isLoading}
                    className="flex-1"
                >
                    {isLoading ? 'Generating...' : submitLabel}
                </Button>
            </div>
        </form>
    );
}
