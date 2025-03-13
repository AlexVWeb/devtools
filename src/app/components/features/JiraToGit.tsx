'use client';
import React, { useEffect, useState } from "react";
import toast from 'react-hot-toast';

type TransformType = 'fix' | 'issue' | 'bug' | 'feat';
const JiraToGit = () => {
    const [numberTicket, setNumberTicket] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [type, setType] = useState<TransformType>('fix');
    const [prefix, setPrefix] = useState<string>('');
    const [commit, setCommit] = useState<string>('');
    const [branch, setBranch] = useState<string>('');
    const [copied, setCopied] = React.useState({ commit: false, branch: false });
    const [isLoading, setIsLoading] = React.useState(false);

    useEffect(() => {
        const savedPrefix = localStorage.getItem('prefix');
        if (savedPrefix) {
            setPrefix(savedPrefix);
        }
    }, []);

    const promptAi = {
        model: "gpt-4o",
        messages: [
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": "You are a helpful assistant that generates commit messages and branch names in a consistent JSON format."
                    }
                ]
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": `Return only a JSON object with "branch" and "commit" properties using these formats:
                        - branch: ${type}/${prefix}-${numberTicket}_{lowercase description with underscores in English}
                        - commit: ${type}(#${prefix}-${numberTicket}): {create a short English description of the title}`
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
        localStorage.setItem('prefix', prefix);
        setPrefix(prefix);
    }

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
            toast.error('Une erreur est survenue lors de la génération du commit');
            console.error(error);
        }
    }

    const generate = async () => {
        const data = await fetchAi();
        if (data && data.choices && data.choices.length > 0) {
            const generatedText = data.choices[0].message.content;

            const commitRegex = /commit:(.*?);/i;
            const commitMatch = generatedText.match(commitRegex);
            const commit = commitMatch ? commitMatch[1].trim() : '';

            const branchRegex = /branch:(.*)/i;
            const branchMatch = generatedText.match(branchRegex);
            const branch = branchMatch ? branchMatch[1].trim() : '';

            return {commit, branch};
        }

        return {commit: '', branch: ''};
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
            <h3 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Jira To Git
            </h3>

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