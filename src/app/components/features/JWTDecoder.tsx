"use client";

import { useState, useEffect } from 'react';
import { LocalStorageService } from '@/app/services/localStorage';

interface DecodedJWT {
    header: any;
    payload: any;
    signature: string;
}

const JWTDecoder = () => {
    const [input, setInput] = useState<string>('');
    const [decodedJWT, setDecodedJWT] = useState<DecodedJWT | null>(null);
    const [error, setError] = useState<string>('');
    const [copiedStates, setCopiedStates] = useState({
        input: false,
        header: false,
        payload: false,
        signature: false
    });

    // Charger les données sauvegardées au montage du composant
    useEffect(() => {
        const savedData = LocalStorageService.getData('jwt');
        if (savedData) {
            setInput(savedData.input);
            setDecodedJWT(savedData.decodedJWT);
        }
    }, []);

    // Sauvegarder les données à chaque modification
    useEffect(() => {
        LocalStorageService.updateData('jwt', {
            input,
            decodedJWT
        });
    }, [input, decodedJWT]);

    const decodeJWT = () => {
        try {
            setError('');
            const [headerB64, payloadB64, signature] = input.split('.');
            
            if (!headerB64 || !payloadB64 || !signature) {
                throw new Error('Format JWT invalide');
            }

            const header = JSON.parse(atob(headerB64));
            const payload = JSON.parse(atob(payloadB64));

            setDecodedJWT({
                header,
                payload,
                signature
            });
        } catch (error) {
            setError('JWT invalide ou mal formaté');
            setDecodedJWT(null);
        }
    };

    const handleCopy = async (text: string, field: keyof typeof copiedStates) => {
        await navigator.clipboard.writeText(text);
        setCopiedStates(prev => ({
            ...prev,
            [field]: true
        }));
        setTimeout(() => {
            setCopiedStates(prev => ({
                ...prev,
                [field]: false
            }));
        }, 2000);
    };

    const formatJSON = (obj: any): string => {
        return JSON.stringify(obj, null, 2);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Décodeur JWT
            </h3>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 shadow-lg">
                <div className="space-y-6">
                    {/* Input Section */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            JWT à décoder
                        </label>
                        <div className="relative group">
                            <textarea
                                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px]"
                                placeholder="Collez votre JWT ici..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button
                                onClick={() => handleCopy(input, 'input')}
                                className="absolute right-2 top-2 px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
                            >
                                {copiedStates.input ? 'Copié !' : 'Copier'}
                            </button>
                        </div>
                        <button
                            onClick={decodeJWT}
                            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Décoder le JWT
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <div className="text-sm text-red-800 dark:text-red-200">
                                {error}
                            </div>
                        </div>
                    )}

                    {/* Decoded JWT Section */}
                    {decodedJWT && (
                        <div className="space-y-4">
                            {/* Header */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Header
                                </label>
                                <div className="relative group">
                                    <textarea
                                        className="w-full px-4 py-3 pr-24 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px] font-mono text-sm"
                                        readOnly
                                        value={formatJSON(decodedJWT.header)}
                                    />
                                    <button
                                        onClick={() => handleCopy(formatJSON(decodedJWT.header), 'header')}
                                        className="absolute right-2 top-2 px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
                                    >
                                        {copiedStates.header ? 'Copié !' : 'Copier'}
                                    </button>
                                </div>
                            </div>

                            {/* Payload */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Payload
                                </label>
                                <div className="relative group">
                                    <textarea
                                        className="w-full px-4 py-3 pr-24 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px] font-mono text-sm"
                                        readOnly
                                        value={formatJSON(decodedJWT.payload)}
                                    />
                                    <button
                                        onClick={() => handleCopy(formatJSON(decodedJWT.payload), 'payload')}
                                        className="absolute right-2 top-2 px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
                                    >
                                        {copiedStates.payload ? 'Copié !' : 'Copier'}
                                    </button>
                                </div>
                            </div>

                            {/* Signature */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Signature
                                </label>
                                <div className="relative group">
                                    <textarea
                                        className="w-full px-4 py-3 pr-24 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all min-h-[50px] font-mono text-sm"
                                        readOnly
                                        value={decodedJWT.signature}
                                    />
                                    <button
                                        onClick={() => handleCopy(decodedJWT.signature, 'signature')}
                                        className="absolute right-2 top-2 px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
                                    >
                                        {copiedStates.signature ? 'Copié !' : 'Copier'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Info Card */}
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-sm text-blue-800 dark:text-blue-200">
                            <span className="font-medium">Note :</span> {"Un JWT (JSON Web Token) est composé de trois parties : le header (en-tête), le payload (charge utile) et la signature. Chaque partie est encodée en Base64 et séparée par des points."}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JWTDecoder; 