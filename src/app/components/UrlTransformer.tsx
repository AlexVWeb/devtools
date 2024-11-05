"use client";

import { useState } from "react";

type TransformType = 'encode' | 'decode';

interface TransformOption {
    value: TransformType;
    label: string;
    description: string;
}

const UrlTransformer = () => {
    const [url, setUrl] = useState<string>('');
    const [transform, setTransform] = useState<TransformType>('encode');
    const [copied, setCopied] = useState(false);

    const transformOptions: TransformOption[] = [
        {
            value: 'encode',
            label: 'Encoder',
            description: 'Convertit les caractères spéciaux en format URL (ex: espace → %20)'
        },
        {
            value: 'decode',
            label: 'Decoder',
            description: 'Reconvertit les caractères encodés en format lisible'
        }
    ];

    const transformUrl = () => {
        try {
            return transform === 'encode' ? encodeURIComponent(url) : decodeURIComponent(url);
        } catch (error) {
            return "❌ URL invalide pour le décodage";
        }
    };

    const handleCopy = async () => {
        const transformedText = transformUrl();
        if (transformedText) {
            await navigator.clipboard.writeText(transformedText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleSwitch = () => {
        setTransform(transform === 'encode' ? 'decode' : 'encode');
    };

    const currentTransform = transformOptions.find(opt => opt.value === transform);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                URL Encoder / Decoder
            </h3>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 shadow-lg">
                {/* Type Selection */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                {currentTransform?.label}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {currentTransform?.description}
                            </p>
                        </div>
                        <button
                            onClick={handleSwitch}
                            className="px-4 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-lg transition-colors"
                        >
                            Basculer {transform === 'encode' ? 'en décodage' : 'en encodage'}
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Texte à {transform === 'encode' ? 'encoder' : 'décoder'}
                        </label>
                        <textarea
                            className="w-full h-48 px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                            placeholder={`Entrez le texte à ${transform === 'encode' ? 'encoder' : 'décoder'}...`}
                            onChange={(e) => setUrl(e.target.value)}
                            value={url}
                        />
                    </div>

                    {/* Output Section */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Résultat
                            </label>
                            <button
                                onClick={handleCopy}
                                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md transition-colors"
                            >
                                {copied ? 'Copié !' : 'Copier'}
                            </button>
                        </div>
                        <textarea
                            className="w-full h-48 px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                            placeholder="Résultat..."
                            readOnly
                            value={transformUrl()}
                        />
                    </div>
                </div>

                {/* Example Section */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Exemples :</h5>
                    <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                        <p>• Espace → %20</p>
                        <p>• ? → %3F</p>
                        <p>• = → %3D</p>
                        <p>• & → %26</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UrlTransformer;