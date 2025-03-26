"use client";

import { useState } from "react";
import predefinedPatterns, { RegExPattern } from "@/app/data/regex/predefinedPatterns";

export interface GeneratedRegEx {
    pattern: string;
    flags: string;
}

interface RegExGeneratorProps {
    onRegExGenerated: (regex: GeneratedRegEx) => void;
}

const RegExGenerator = ({ onRegExGenerated }: RegExGeneratorProps) => {
    const [selectedPatternId, setSelectedPatternId] = useState<string>(predefinedPatterns[0].id);
    const [paramValues, setParamValues] = useState<Record<string, string | boolean>>({});
    const [customPattern, setCustomPattern] = useState<string>("");
    const [customFlags, setCustomFlags] = useState<string>("g");
    const [isCustom, setIsCustom] = useState<boolean>(false);
    const [useExample, setUseExample] = useState<boolean>(false);

    const selectedPattern = predefinedPatterns.find(p => p.id === selectedPatternId);

    const handlePatternChange = (patternId: string) => {
        setSelectedPatternId(patternId);
        // Réinitialiser les valeurs des paramètres
        setParamValues({});
    };

    const handleParamChange = (paramName: string, value: string | boolean) => {
        setParamValues(prev => ({
            ...prev,
            [paramName]: value
        }));
    };

    const generateRegEx = (): GeneratedRegEx => {
        if (isCustom) {
            return {
                pattern: customPattern,
                flags: customFlags
            };
        }

        if (!selectedPattern) {
            return { pattern: "", flags: "g" };
        }

        let pattern = selectedPattern.pattern;
        const flags = selectedPattern.flags || "g";

        // Remplacer les paramètres dans le pattern
        if (selectedPattern.params) {
            selectedPattern.params.forEach(param => {
                const value = paramValues[param.name] !== undefined 
                    ? String(paramValues[param.name]) 
                    : String(param.defaultValue);
                
                pattern = pattern.replace(new RegExp(`\\{${param.name}\\}`, 'g'), value);
            });
        }

        return { pattern, flags };
    };

    const handleGenerate = () => {
        const regex = generateRegEx();
        onRegExGenerated(regex);
        
        // Si l'option est activée, envoyer également l'exemple
        if (useExample && selectedPattern?.example && !isCustom) {
            // Utiliser un délai pour s'assurer que l'expression régulière est d'abord appliquée
            setTimeout(() => {
                const exampleEvent = new CustomEvent('use-regex-example', { 
                    detail: { example: selectedPattern.example }
                });
                window.dispatchEvent(exampleEvent);
            }, 100);
        }
    };

    const handleUseExample = () => {
        if (selectedPattern?.example && !isCustom) {
            const exampleEvent = new CustomEvent('use-regex-example', { 
                detail: { example: selectedPattern.example }
            });
            window.dispatchEvent(exampleEvent);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h4 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Générateur d&apos;Expressions Régulières
            </h4>

            <div className="space-y-4">
                {/* Mode Selection */}
                <div className="flex space-x-4">
                    <button
                        onClick={() => setIsCustom(false)}
                        className={`px-4 py-2 rounded-md transition-colors ${
                            !isCustom
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                        Modèles prédéfinis
                    </button>
                    <button
                        onClick={() => setIsCustom(true)}
                        className={`px-4 py-2 rounded-md transition-colors ${
                            isCustom
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                        Personnalisé
                    </button>
                </div>

                {isCustom ? (
                    /* Custom Pattern Input */
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                Expression personnalisée
                            </label>
                            <input
                                type="text"
                                value={customPattern}
                                onChange={(e) => setCustomPattern(e.target.value)}
                                className="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="Entrez votre expression régulière..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                Drapeaux (flags)
                            </label>
                            <input
                                type="text"
                                value={customFlags}
                                onChange={(e) => setCustomFlags(e.target.value)}
                                className="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="g, i, m, s, u, y"
                            />
                        </div>
                    </div>
                ) : (
                    /* Predefined Patterns */
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                Modèle
                            </label>
                            <select
                                value={selectedPatternId}
                                onChange={(e) => handlePatternChange(e.target.value)}
                                className="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all"
                            >
                                {predefinedPatterns.map((pattern) => (
                                    <option key={pattern.id} value={pattern.id}>
                                        {pattern.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedPattern && (
                            <div className="text-sm text-gray-600 dark:text-gray-400 italic">
                                {selectedPattern.description}
                            </div>
                        )}

                        {/* Example for the selected pattern */}
                        {selectedPattern?.example && (
                            <div className="pt-1">
                                <div className="flex justify-between items-center">
                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Exemple
                                    </div>
                                    <button
                                        onClick={handleUseExample}
                                        className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        Utiliser cet exemple
                                    </button>
                                </div>
                                <div className="mt-1 text-sm p-2 bg-gray-100 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                                    {selectedPattern.example}
                                </div>
                                <div className="mt-2 flex items-center">
                                    <input
                                        type="checkbox"
                                        id="use-example"
                                        checked={useExample}
                                        onChange={(e) => setUseExample(e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                                    />
                                    <label htmlFor="use-example" className="text-xs text-gray-600 dark:text-gray-400">
                                        Utiliser cet exemple automatiquement avec l&apos;expression
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Parameters for the selected pattern */}
                        {selectedPattern?.params && selectedPattern.params.length > 0 && (
                            <div className="space-y-3 pt-2">
                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Paramètres
                                </div>
                                {selectedPattern.params.map((param) => (
                                    <div key={param.name}>
                                        <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
                                            {param.label}
                                        </label>
                                        {param.type === "text" && (
                                            <input
                                                type="text"
                                                value={
                                                    paramValues[param.name] !== undefined
                                                        ? String(paramValues[param.name])
                                                        : String(param.defaultValue)
                                                }
                                                onChange={(e) => handleParamChange(param.name, e.target.value)}
                                                className="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all"
                                            />
                                        )}
                                        {param.type === "select" && param.options && (
                                            <select
                                                value={
                                                    paramValues[param.name] !== undefined
                                                        ? String(paramValues[param.name])
                                                        : String(param.defaultValue)
                                                }
                                                onChange={(e) => handleParamChange(param.name, e.target.value)}
                                                className="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all"
                                            >
                                                {param.options.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                        {param.type === "checkbox" && (
                                            <input
                                                type="checkbox"
                                                checked={
                                                    paramValues[param.name] !== undefined
                                                        ? Boolean(paramValues[param.name])
                                                        : Boolean(param.defaultValue)
                                                }
                                                onChange={(e) => handleParamChange(param.name, e.target.checked)}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Preview of the generated regex */}
                <div className="pt-2">
                    <div className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Aperçu
                    </div>
                    <div className="font-mono text-sm p-2 bg-gray-100 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                        /{generateRegEx().pattern}/{generateRegEx().flags}
                    </div>
                </div>

                {/* Generate Button */}
                <button
                    onClick={handleGenerate}
                    className="w-full py-2 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                >
                    Utiliser cette expression
                </button>
            </div>
        </div>
    );
};

export default RegExGenerator; 