"use client";

import { useState } from 'react';

const Base64 = () => {
    const [input, setInput] = useState<string>('');
    const [output, setOutput] = useState<string>('');
    const [copied, setCopied] = useState<boolean>(false);

    const encodeToBase64 = () => {
        try {
            const encoded = btoa(input);
            setOutput(encoded);
        } catch (error) {
            setOutput('Erreur : Texte invalide pour l\'encodage Base64');
        }
    };

    const decodeFromBase64 = () => {
        try {
            const decoded = atob(input);
            setOutput(decoded);
        } catch (error) {
            setOutput('Erreur : Base64 invalide');
        }
    };

    const handleCopy = async () => {
        if (output) {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Encodeur/Décodeur Base64
            </h3>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 shadow-lg">
                <div className="space-y-6">
                    {/* Input Section */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Texte à encoder/décoder
                        </label>
                        <textarea
                            className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px]"
                            placeholder="Entrez votre texte ici..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={encodeToBase64}
                            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Encoder en Base64
                        </button>
                        <button
                            onClick={decodeFromBase64}
                            className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                        >
                            Décoder du Base64
                        </button>
                    </div>

                    {/* Output Section */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Résultat
                        </label>
                        <div className="relative group">
                            <textarea
                                className="w-full px-4 py-3 pr-24 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px]"
                                readOnly
                                value={output}
                                placeholder="Le résultat apparaîtra ici..."
                            />
                            {output && (
                                <button
                                    onClick={handleCopy}
                                    className="absolute right-2 top-2 px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
                                >
                                    {copied ? 'Copié !' : 'Copier'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Info Card */}
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-sm text-blue-800 dark:text-blue-200">
                            <span className="font-medium">Note :</span> {"L'encodage Base64 est utile pour encoder des données binaires en texte ASCII. Le décodage permet de retrouver les données originales."}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Base64; 