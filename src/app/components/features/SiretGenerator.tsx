"use client";

import { useState } from 'react';

interface GeneratedSiret {
    value: string;
    timestamp: number;
}

const SiretGenerator = () => {
    const [sirets, setSirets] = useState<GeneratedSiret[]>([]);
    const [copied, setCopied] = useState<string | null>(null);

    const calculateLuhnKey = (numbers: string): number => {
        let sum = 0;
        let isEven = true;

        for (let i = numbers.length - 1; i >= 0; i--) {
            let digit = parseInt(numbers[i]);

            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            isEven = !isEven;
        }

        return (10 - (sum % 10)) % 10;
    };

    const generateSiret = (): string => {
        let sirenBase = '';
        for (let i = 0; i < 8; i++) {
            sirenBase += Math.floor(Math.random() * 10);
        }
        const sirenKey = calculateLuhnKey(sirenBase);
        const siren = sirenBase + sirenKey;

        let nic = '';
        for (let i = 0; i < 4; i++) {
            nic += Math.floor(Math.random() * 10);
        }

        const siretWithoutKey = siren + nic;
        const key = calculateLuhnKey(siretWithoutKey);

        return siretWithoutKey + key;
    };

    const generateNewSirets = (): void => {
        const newSirets = Array.from({ length: 5 }, () => ({
            value: generateSiret(),
            timestamp: Date.now() + Math.random()
        }));
        setSirets(newSirets);
    };

    const handleCopy = async (siret: string) => {
        await navigator.clipboard.writeText(siret);
        setCopied(siret);
        setTimeout(() => setCopied(null), 2000);
    };

    const formatSiret = (siret: string): string => {
        return `${siret.slice(0, 3)} ${siret.slice(3, 6)} ${siret.slice(6, 9)} ${siret.slice(9)}`;
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Générateur de SIRET
            </h3>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 shadow-lg">
                <div className="space-y-6">
                    {/* Generation Button */}
                    <button
                        onClick={generateNewSirets}
                        className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        Générer 5 nouveaux SIRET
                    </button>

                    {/* Results Section */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            SIRET générés
                        </label>
                        <div className="space-y-3">
                            {sirets.map((siret) => (
                                <div
                                    key={siret.timestamp}
                                    className="relative group"
                                >
                                    <input
                                        className="w-full px-4 py-3 pr-24 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all"
                                        type="text"
                                        readOnly
                                        value={formatSiret(siret.value)}
                                    />
                                    <button
                                        onClick={() => handleCopy(siret.value)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
                                    >
                                        {copied === siret.value ? 'Copié !' : 'Copier'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Info Card */}
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-sm text-blue-800 dark:text-blue-200">
                            <span className="font-medium">Note :</span> Ces SIRET sont générés de manière aléatoire et sont mathématiquement valides selon l'algorithme de Luhn. Ils sont parfaits pour les tests mais ne correspondent à aucune entreprise réelle.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SiretGenerator;