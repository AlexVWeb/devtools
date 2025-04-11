'use client';
import React, { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { LocalStorageService } from '@/app/services/localStorage';

type TransformType = 'fix' | 'issue' | 'bug' | 'feat';
type LanguageType = 'fr' | 'en';

const JiraToGit = () => {
    const [numberTicket, setNumberTicket] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [type, setType] = useState<TransformType>('fix');
    const [prefix, setPrefix] = useState<string>('');
    const [commit, setCommit] = useState<string>('');
    const [branch, setBranch] = useState<string>('');
    const [language, setLanguage] = useState<LanguageType>(() => {
        if (typeof window !== 'undefined') {
            const savedData = LocalStorageService.getData('jiraToGit');
            return (savedData?.language as LanguageType) || 'fr';
        }
        return 'fr';
    });
    const [copied, setCopied] = React.useState({ commit: false, branch: false });
    const [isLoading, setIsLoading] = React.useState(false);

    // Charger les données sauvegardées au montage du composant
    useEffect(() => {
        const savedData = LocalStorageService.getData('jiraToGit');
        if (savedData) {
            setPrefix(savedData.prefix || '');
            setNumberTicket(savedData.numberTicket || '');
            setTitle(savedData.title || '');
            setType(savedData.type as TransformType || 'fix');
        }
    }, []);

    // Sauvegarder les données à chaque modification
    useEffect(() => {
        LocalStorageService.updateData('jiraToGit', {
            prefix,
            numberTicket,
            title,
            type,
            language,
            lastUpdated: new Date().toISOString()
        });
    }, [prefix, numberTicket, title, type, language]);

    // Ajouter un log pour déboguer
    useEffect(() => {
        console.log('Current language:', language);
        const savedData = LocalStorageService.getData('jiraToGit');
        console.log('Saved data:', savedData);
    }, [language]);

    const promptAi = {
        model: "gpt-4o",
        messages: [
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": "You are a helpful assistant that generates commit messages and branch names based on the exact title provided, without adding any interpretation."
                    }
                ]
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": `Generate a JSON object with these exact values:
                        - title: "${title}"
                        - prefix: "${prefix}"
                        - numberTicket: "${numberTicket}"
                        - type: "${type}"
                        And derive these properties:
                        - branch: ${type}/${prefix}-${numberTicket}_${language === 'en' ? '{title translated to english}' : '{keep title in french}'}_in_lowercase_with_underscores
                        - commit: ${type}(#${prefix}-${numberTicket}): ${language === 'en' ? '{title translated to english in lowercase}' : '{keep title in french in lowercase}'}`
                    }
                ]
            },
        ],
        response_format: {
            "type": "json_schema",
            "json_schema": {
                "name": "ticket_commit_info",
                "strict": true,
                "schema": {
                    "type": "object",
                    "properties": {
                        "title": {
                            "type": "string",
                            "description": "The title of the ticket."
                        },
                        "prefix": {
                            "type": "string",
                            "description": "The prefix associated with the ticket."
                        },
                        "numberTicket": {
                            "type": "string",
                            "description": "The unique number of the ticket."
                        },
                        "type": {
                            "type": "string",
                            "description": "The type of the ticket."
                        },
                        "branch": {
                            "type": "string",
                            "description": "The branch name formatted as ${type}/${prefix}-${numberTicket}_{lowercase description with underscores in English}."
                        },
                        "commit": {
                            "type": "string",
                            "description": "The commit message formatted as ${type}(#${prefix}-${numberTicket}): {create a short English description of the title}."
                        }
                    },
                    "required": [
                        "title",
                        "prefix",
                        "numberTicket",
                        "type",
                        "branch",
                        "commit"
                    ],
                    "additionalProperties": false
                }
            }
        },
        temperature: 1,
        max_completion_tokens: 2048,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
    };

    const updatePrefix = (prefix: string) => {
        setPrefix(prefix);
    }

    const fetchAi = async () => {
        try {
            if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
                throw new Error('OpenAI API key is missing');
            }
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
                },
                body: JSON.stringify(promptAi)
            });
            return await response.json();
        } catch (error) {
            toast.error('Une erreur est survenue lors de la génération du commit');
            console.error(error);
        }
    }

    const generate = async () => {
        const data = await fetchAi();
        if (data && data.choices && data.choices.length > 0) {
            try {
                const content = data.choices[0].message.content;
                const parsedContent = JSON.parse(content);
                
                return {
                    commit: parsedContent.commit,
                    branch: parsedContent.branch
                };
            } catch (error) {
                console.error('Erreur lors du parsing de la réponse:', error);
                toast.error('Erreur lors du traitement de la réponse');
                return { commit: '', branch: '' };
            }
        }

        return { commit: '', branch: '' };
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const {commit, branch} = await generate();
        setCommit(commit);
        setBranch(branch);
        console.log({commit, branch});
    }

    const handleCopy = async (text: string, type: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(prev => ({ ...prev, [type]: true }));
        setTimeout(() => setCopied(prev => ({ ...prev, [type]: false })), 2000);
    };

    const handleGenerateClick = async (e: React.FormEvent<Element>) => {
        e.preventDefault();
        setIsLoading(true);
        await handleSubmit(e);
        setIsLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Jira To Git
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setLanguage('fr')}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                            language === 'fr' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'
                        }`}
                    >
                        🇫🇷 FR
                    </button>
                    <button
                        onClick={() => setLanguage('en')}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                            language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'
                        }`}
                    >
                        🇬🇧 EN
                    </button>
                </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 shadow-lg">
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Prefix du projet
                    </label>
                    <input
                        className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all"
                        type="text"
                        placeholder="ex: PROJ"
                        defaultValue={prefix}
                        onChange={(e) => updatePrefix(e.target.value)}
                    />
                </div>

                <form className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Numéro du ticket
                            </label>
                            <input
                                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all"
                                type="text"
                                placeholder="ex: 1234"
                                onChange={(e) => setNumberTicket(e.target.value)}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Titre
                            </label>
                            <input
                                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all"
                                type="text"
                                placeholder="Description du ticket"
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-1/3">
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Type
                            </label>
                            <select
                                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all"
                                onChange={(e) => setType(e.target.value as TransformType)}
                            >
                                <option value="fix">🔧 Fix</option>
                                <option value="issue">⚠️ Issue</option>
                                <option value="bug">🐛 Bug</option>
                                <option value="feat">✨ Feature</option>
                            </select>
                        </div>

                        <div className="w-2/3 flex items-end">
                            <button
                                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                onClick={handleGenerateClick}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Génération...' : 'Générer'}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Commit
                            </label>
                            <div className="relative">
                                <input
                                    className="w-full px-4 py-3 pr-12 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all"
                                    type="text"
                                    readOnly
                                    value={commit}
                                />
                                {commit && (
                                    <button
                                        onClick={() => handleCopy(commit, 'commit')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    >
                                        Copier
                                    </button>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Branche
                            </label>
                            <div className="relative">
                                <input
                                    className="w-full px-4 py-3 pr-12 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all"
                                    type="text"
                                    readOnly
                                    value={branch}
                                />
                                {branch && (
                                    <button
                                        onClick={() => handleCopy(branch, 'branch')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    >
                                        Copier
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </form>

                {(copied.commit || copied.branch) && (
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-lg">
                        Copié avec succès !
                    </div>
                )}
            </div>
        </div>
    );
}

export default JiraToGit;