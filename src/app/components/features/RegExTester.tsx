"use client";

import { useEffect, useState, useCallback } from "react";
import RegExGenerator, { GeneratedRegEx } from "./RegExGenerator";

const RegExTester = () => {
    const [pattern, setPattern] = useState<string>('');
    const [flags, setFlags] = useState<string>('g');
    const [testString, setTestString] = useState<string>('');
    const [matches, setMatches] = useState<{text: string, start: number, end: number}[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [highlightedText, setHighlightedText] = useState<React.ReactNode[]>([]);
    const [showGenerator, setShowGenerator] = useState<boolean>(false);

    const flagOptions = [
        { value: 'g', label: 'Global (g)', description: 'Recherche toutes les occurrences' },
        { value: 'i', label: 'Insensible à la casse (i)', description: 'Ignore les différences majuscules/minuscules' },
        { value: 'm', label: 'Multiligne (m)', description: 'Traite les caractères ^ et $ comme début/fin de ligne' },
        { value: 's', label: 'Dotall (s)', description: 'Le point (.) correspond également aux sauts de ligne' },
        { value: 'u', label: 'Unicode (u)', description: 'Traite le motif comme une séquence de points de code Unicode' },
        { value: 'y', label: 'Sticky (y)', description: 'Commence la recherche à la position lastIndex' },
    ];

    // Écouter l'événement pour utiliser l'exemple du générateur
    useEffect(() => {
        const handleUseExample = (event: CustomEvent) => {
            if (event.detail && event.detail.example) {
                setTestString(event.detail.example);
            }
        };

        // Ajouter l'écouteur d'événement
        window.addEventListener('use-regex-example', handleUseExample as EventListener);

        // Nettoyer l'écouteur d'événement
        return () => {
            window.removeEventListener('use-regex-example', handleUseExample as EventListener);
        };
    }, []);

    const handleFlagChange = (flag: string) => {
        if (flags.includes(flag)) {
            setFlags(flags.replace(flag, ''));
        } else {
            setFlags(flags + flag);
        }
    };

    // Fonction pour tester l'expression régulière en temps réel
    const testRegex = useCallback(() => {
        setError(null);
        setMatches([]);
        setHighlightedText([testString]);

        if (!pattern || !testString) {
            return;
        }

        try {
            const regex = new RegExp(pattern, flags);
            const results: {text: string, start: number, end: number}[] = [];
            
            // Trouver toutes les correspondances avec leurs positions
            if (flags.includes('g')) {
                let match;
                while ((match = regex.exec(testString)) !== null) {
                    results.push({
                        text: match[0],
                        start: match.index,
                        end: match.index + match[0].length
                    });
                    
                    // Éviter les boucles infinies pour les expressions qui correspondent à des chaînes vides
                    if (match[0].length === 0) {
                        regex.lastIndex++;
                    }
                }
            } else {
                const match = regex.exec(testString);
                if (match) {
                    results.push({
                        text: match[0],
                        start: match.index,
                        end: match.index + match[0].length
                    });
                }
            }
            
            setMatches(results);

            // Intégration de highlightMatches ici
            if (results.length === 0 || !testString) {
                setHighlightedText([testString]);
                return;
            }

            const parts: React.ReactNode[] = [];
            let lastIndex = 0;

            // Trier les correspondances par position de début
            const sortedMatches = [...results].sort((a, b) => a.start - b.start);

            sortedMatches.forEach((match, index) => {
                // Ajouter le texte avant la correspondance
                if (match.start > lastIndex) {
                    parts.push(testString.substring(lastIndex, match.start));
                }

                // Ajouter la correspondance mise en évidence
                parts.push(
                    <span 
                        key={`match-${index}`} 
                        className="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded"
                    >
                        {testString.substring(match.start, match.end)}
                    </span>
                );

                lastIndex = match.end;
            });

            // Ajouter le texte restant après la dernière correspondance
            if (lastIndex < testString.length) {
                parts.push(testString.substring(lastIndex));
            }

            setHighlightedText(parts);

        } catch (err) {
            setError((err as Error).message);
        }
    }, [pattern, flags, testString]);

    useEffect(() => {
        testRegex();
    }, [testRegex]);

    const handleCopy = async () => {
        if (matches.length > 0) {
            await navigator.clipboard.writeText(matches.map(match => match.text).join('\n'));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Fonction pour appliquer l'expression régulière générée
    const handleRegExGenerated = (regex: GeneratedRegEx) => {
        setPattern(regex.pattern);
        setFlags(regex.flags);
        setShowGenerator(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Testeur d&apos;Expressions Régulières
            </h3>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 shadow-lg">
                <div className="space-y-6">
                    {/* Pattern Input with Generator Toggle */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Expression Régulière
                            </label>
                            <button
                                onClick={() => setShowGenerator(!showGenerator)}
                                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                {showGenerator ? "Masquer le générateur" : "Utiliser le générateur"}
                            </button>
                        </div>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                /
                            </span>
                            <input
                                className="flex-1 px-4 py-3 rounded-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all"
                                type="text"
                                placeholder="Entrez votre expression régulière..."
                                value={pattern}
                                onChange={(e) => setPattern(e.target.value)}
                            />
                            <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                /{flags}
                            </span>
                        </div>
                    </div>

                    {/* RegEx Generator */}
                    {showGenerator && (
                        <div className="mb-4">
                            <RegExGenerator onRegExGenerated={handleRegExGenerated} />
                        </div>
                    )}

                    {/* Flags Selection */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Drapeaux (Flags)
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {flagOptions.map((flag) => (
                                <button
                                    key={flag.value}
                                    onClick={() => handleFlagChange(flag.value)}
                                    className={`px-3 py-2 text-sm rounded-md transition-colors ${
                                        flags.includes(flag.value)
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                                    title={flag.description}
                                >
                                    {flag.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Test String Input */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Texte à tester
                            </label>
                            <button
                                onClick={() => setTestString('')}
                                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                                Effacer
                            </button>
                        </div>
                        <textarea
                            className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all"
                            rows={5}
                            placeholder="Entrez le texte à tester..."
                            value={testString}
                            onChange={(e) => setTestString(e.target.value)}
                        />
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
                            <p className="font-medium">Erreur:</p>
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Highlighted Text Preview */}
                    {testString && (
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Aperçu avec correspondances
                            </label>
                            <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg min-h-[100px] whitespace-pre-wrap font-mono text-sm overflow-auto max-h-60">
                                {highlightedText}
                            </div>
                        </div>
                    )}

                    {/* Results Section */}
                    {matches.length > 0 && (
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Résultats ({matches.length} correspondance{matches.length > 1 ? 's' : ''})
                                </label>
                                <button
                                    onClick={handleCopy}
                                    className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
                                >
                                    {copied ? 'Copié !' : 'Copier tout'}
                                </button>
                            </div>
                            <div className="max-h-60 overflow-y-auto p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <ul className="space-y-1">
                                    {matches.map((match, index) => (
                                        <li key={index} className="font-mono text-sm flex items-center">
                                            <span className="text-gray-500 dark:text-gray-400 mr-2">{index + 1}.</span>
                                            <span className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">{match.text}</span>
                                            <span className="text-gray-500 dark:text-gray-400 ml-2 text-xs">
                                                (position: {match.start}-{match.end})
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Example Card */}
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-sm text-blue-800 dark:text-blue-200">
                            <span className="font-medium">Astuce :</span> Utilisez le générateur pour créer facilement des expressions régulières courantes. Chaque modèle propose un exemple que vous pouvez utiliser directement.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegExTester; 