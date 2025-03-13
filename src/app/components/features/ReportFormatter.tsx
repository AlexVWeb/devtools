'use client';
import React, { useState } from "react";
import { Loader2, ClipboardCopy, ArrowRightLeft } from "lucide-react";

const ReportFormatter = () => {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const promptAi = {
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: "# Prompt pour le formatage des comptes rendus de mentorat"
            },
            {
                role: "user",
                content: `
                Reformatez ce compte rendu en :
                1. Corrigeant les fautes d'orthographe et de grammaire
                2. Structurant le texte selon les 3 sections standard
                3. Conservant l'essentiel du contenu original
                4. Améliorant légèrement la clarté sans ajouter d'informations non mentionnées
                5. Utilisant un langage professionnel et formel adapté à un compte rendu de mentorat

                Format à suivre :
                1. Avancées de l'étudiant sur son projet depuis la dernière session
                - Reprendre uniquement les faits accomplis et les progrès réalisés depuis la dernière session
                - Utiliser des puces (*) si plusieurs points
                - Ne pas inclure les tâches à faire ici

                2. Principaux sujets abordés pendant la session, obstacles à surmonter (le cas échéant)
                - Lister uniquement les sujets qui ont été discutés pendant la session
                - Mentionner les obstacles ou problèmes identifiés
                - Ne pas inclure les actions à faire ou les objectifs futurs ici

                3. Objectifs 'SMART' fixés par l'étudiant et le mentor pour la prochaine session
                - Inclure TOUTES les actions "à faire" mentionnées dans le texte
                - Transformer chaque action en objectif SMART (Spécifique, Mesurable, Atteignable, Réaliste, Temporel)
                - Inclure TOUS les éléments listés après "à faire :", "todo :", "actions :", etc.

                IMPORTANT : 
                - Toute mention de "à faire", "todo" ou actions futures doit être placée UNIQUEMENT dans la section 3
                - Les sections 1 et 2 ne doivent contenir que des faits passés ou présents

                Texte à formater :
                ${inputText}

                Appliquez ce format en restant fidèle au contenu original et en évitant d'ajouter des informations non mentionnées.
                `
            }
        ]
    };

    const fetchAi = async () => {
        try {
            if (!process.env.REACT_APP_OPENAI_API_KEY) {
                throw new Error('OpenAI API key is missing');
            }
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
                },
                body: JSON.stringify(promptAi)
            });
            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const handleFormat = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const data = await fetchAi();
        if (data && data.choices && data.choices.length > 0) {
            setOutputText(data.choices[0].message.content);
        }
        setIsLoading(false);
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(outputText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h3 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Formateur de Compte Rendu Mentorat
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 shadow-lg">
                    <h4 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
                        Compte Rendu Original
                    </h4>
                    <textarea
                        className="w-full h-[500px] px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 transition-all resize-none font-light text-sm dark:text-gray-300 placeholder-gray-400"
                        placeholder="Collez votre compte rendu ici..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                </div>

                {/* Output Section */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                            Compte Rendu Formaté
                        </h4>
                        {outputText && (
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-2 px-3 py-1 text-sm rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                <ClipboardCopy className="w-4 h-4" />
                                {copied ? 'Copié !' : 'Copier'}
                            </button>
                        )}
                    </div>
                    <textarea
                        className="w-full h-[500px] px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 transition-all resize-none font-light text-sm dark:text-gray-300 placeholder-gray-400"
                        readOnly
                        value={outputText}
                        placeholder="Le compte rendu formaté apparaîtra ici..."
                    />
                </div>
            </div>

            {/* Action Button */}
            <div className="mt-6 flex justify-center">
                <button
                    onClick={handleFormat}
                    disabled={isLoading || !inputText}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg flex items-center gap-3 hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Formatage en cours...
                        </>
                    ) : (
                        <>
                            <ArrowRightLeft className="w-5 h-5" />
                            Formater le compte rendu
                        </>
                    )}
                </button>
            </div>

            {/* Success Message */}
            {copied && (
                <div className="fixed bottom-6 right-6">
                    <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-up">
                        Texte copié avec succès !
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportFormatter;