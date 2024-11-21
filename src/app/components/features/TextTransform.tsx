"use client";

import { useState } from "react";

type TransformType = 'snake' | 'camel' | 'pascal' | 'kebab' | 'screaming' | 'upper' | 'lower';

interface TransformOption {
    value: TransformType;
    label: string;
    description: string;
    example: string;
}

const TextTransform = () => {
    const [text, setText] = useState<string>('');
    const [transform, setTransform] = useState<TransformType>('snake');
    const [copied, setCopied] = useState(false);

    const transformOptions: TransformOption[] = [
        { value: 'snake', label: 'Snake Case', description: 'Mots séparés par des underscores', example: 'hello_world' },
        { value: 'camel', label: 'Camel Case', description: 'Première lettre en minuscule, puis majuscules', example: 'helloWorld' },
        { value: 'pascal', label: 'Pascal Case', description: 'Chaque mot commence par une majuscule', example: 'HelloWorld' },
        { value: 'kebab', label: 'Kebab Case', description: 'Mots séparés par des tirets', example: 'hello-world' },
        { value: 'screaming', label: 'Screaming Snake', description: 'Snake case en majuscules', example: 'HELLO_WORLD' },
        { value: 'upper', label: 'Upper Case', description: 'Tout en majuscules', example: 'HELLO WORLD' },
        { value: 'lower', label: 'Lower Case', description: 'Tout en minuscules', example: 'hello world' },
    ];

    const transformText = () => {
        let result = text;
        switch (transform) {
            case 'snake':
                result = text.replace(/\s+/g, '_').toLowerCase();
                break;
            case 'camel':
                result = text.toLowerCase().replace(/\s+(.)/g, (_match, group) => group.toUpperCase());
                break;
            case 'pascal':
                result = text.toLowerCase().replace(/\s+(.)/g, (_match, group) => group.toUpperCase());
                result = result.charAt(0).toUpperCase() + result.slice(1);
                break;
            case 'kebab':
                result = text.replace(/\s+/g, '-').toLowerCase();
                break;
            case 'screaming':
                result = text.replace(/\s+/g, '_').toUpperCase();
                break;
            case 'upper':
                result = text.toUpperCase();
                break;
            case 'lower':
                result = text.toLowerCase();
                break;
        }
        return result;
    };

    const handleCopy = async () => {
        const transformedText = transformText();
        if (transformedText) {
            await navigator.clipboard.writeText(transformedText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const currentTransform = transformOptions.find(opt => opt.value === transform);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Transform String
            </h3>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 shadow-lg">
                <div className="space-y-6">
                    {/* Input Section */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Texte à transformer
                        </label>
                        <input
                            className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all"
                            type="text"
                            placeholder="Entrez votre texte ici..."
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>

                    {/* Transform Type Selection */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Type de transformation
                            </label>
                            <select
                                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all"
                                onChange={(e) => setTransform(e.target.value as TransformType)}
                                value={transform}
                            >
                                {transformOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Description
                            </label>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                {currentTransform?.description}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-500">
                                Exemple: {currentTransform?.example}
                            </div>
                        </div>
                    </div>

                    {/* Result Section */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Résultat
                        </label>
                        <div className="relative">
                            <input
                                className="w-full px-4 py-3 pr-24 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all"
                                type="text"
                                readOnly
                                value={transformText()}
                            />
                            <button
                                onClick={handleCopy}
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
                            >
                                {copied ? 'Copié !' : 'Copier'}
                            </button>
                        </div>
                    </div>

                    {/* Example Card */}
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-sm text-blue-800 dark:text-blue-200">
                            <span className="font-medium">Astuce :</span> Utilisez des espaces pour séparer vos mots. La transformation les convertira automatiquement selon le format choisi.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TextTransform;