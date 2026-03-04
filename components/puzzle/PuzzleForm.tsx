'use client';

import { useState, useMemo } from 'react';
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
        authorName?: string;
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
    const [authorName, setAuthorName] = useState(defaultValues?.authorName ?? '');
    const [description, setDescription] = useState(defaultValues?.description ?? '');
    const [words, setWords] = useState(
        defaultValues?.words ? defaultValues.words.join('\n') : ''
    );
    const [size, setSize] = useState(Math.min(defaultValues?.options?.size ?? 15, 15));
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

    // Validation checks
    const validation = useMemo(() => {
        const errors: string[] = [];

        // Check word count
        if (wordCount < 10) {
            errors.push(`Need ${10 - wordCount} more word${10 - wordCount > 1 ? 's' : ''}`);
        }
        if (wordCount > 30) {
            errors.push(`${wordCount - 30} too many words`);
        }

        // Check word length (max 13 characters)
        const tooLongWords = wordList.filter(w => w.length > 13);
        if (tooLongWords.length > 0) {
            errors.push(`Words too long (max 13 chars): ${tooLongWords.join(', ')}`);
        }

        // Check for duplicate words
        const duplicates = wordList.filter((word, index) => wordList.indexOf(word) !== index);
        if (duplicates.length > 0) {
            errors.push(`Duplicate words: ${duplicates.join(', ')}`);
        }

        // Check for overlapping words (one word is substring of another)
        const overlapping: string[] = [];
        for (let i = 0; i < wordList.length; i++) {
            for (let j = 0; j < wordList.length; j++) {
                if (i !== j && wordList[i].includes(wordList[j]) && wordList[i] !== wordList[j]) {
                    overlapping.push(`${wordList[j]} → ${wordList[i]}`);
                }
            }
        }
        if (overlapping.length > 0) {
            errors.push(`Overlapping words: ${[...new Set(overlapping)].join(', ')}`);
        }

        return {
            isValid: wordCount >= 10 && wordCount <= 30 && errors.length === 0,
            errors
        };
    }, [wordList, wordCount]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validation.isValid) return;

        onSubmit({
            title,
            description: description || undefined,
            authorName: authorName || undefined,
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

            {/* Author Name */}
            <div>
                <label htmlFor="authorName" className="block text-sm font-bold uppercase mb-2 text-gray-700 dark:text-zinc-300">
                    Made By (Optional)
                </label>
                <Input
                    id="authorName"
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g., Decka"
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
                        ({wordCount}/30 words, max 13 chars each)
                    </span>
                </label>
                <Textarea
                    id="words"
                    value={words}
                    onChange={(e) => setWords(e.target.value)}
                    placeholder="Enter one word per line (10-30 words)&#10;FUNCTION&#10;VARIABLE&#10;CONST"
                    required
                />
                {validation.errors.length > 0 && (
                    <div className="mt-2 space-y-1">
                        {validation.errors.map((error, idx) => (
                            <p key={idx} className="mt-1 text-sm text-red-600 dark:text-red-400 font-semibold">
                                ❌ {error}
                            </p>
                        ))}
                    </div>
                )}
                {wordCount >= 10 && wordCount <= 30 && validation.errors.length === 0 && (
                    <p className="mt-2 text-sm text-green-600 dark:text-green-400 font-semibold">
                        ✅ Word list looks good!
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
                        max="15"
                        value={size}
                        onChange={(e) => setSize(Number(e.target.value))}
                        className="w-full accent-purple-500"
                    />
                    <div className="flex justify-between text-xs font-mono mt-1 text-gray-500 dark:text-zinc-500">
                        <span>10</span>
                        <span>15</span>
                    </div>
                    <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 italic">
                        ⚠️ The puzzle grid size is responsive to your word list, so the actual grid may be larger than this setting to fit all words.
                    </p>
                </div>

                <hr className="border-gray-200 dark:border-zinc-700" />

                {/* Toggles */}
                <div className="space-y-2">
                    <Toggle
                        checked={allowDiagonal}
                        onChange={setAllowDiagonal}
                        label="Diagonal Words"
                    />
                    <Toggle
                        checked={allowBackward}
                        onChange={setAllowBackward}
                        label="Backward Words"
                    />
                </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
                <Button
                    type="submit"
                    disabled={!validation.isValid || isLoading}
                    className="flex-1"
                >
                    {isLoading ? 'Generating...' : submitLabel}
                </Button>
            </div>
        </form>
    );
}
