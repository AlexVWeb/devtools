'use client';
import React, {useState} from "react";

type TransformType = 'fix' | 'issue' | 'bug' | 'feat';
const JiraToGit = () => {
    const [numberTicket, setNumberTicket] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [type, setType] = useState<TransformType>('fix');
    const [prefix, setPrefix] = useState<string>('JIR');

    const [commit, setCommit] = useState<string>('');
    const [branch, setBranch] = useState<string>('');
    const [disabled, setDisabled] = useState<boolean>(false);

    const promptAi = {
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "Vous êtes un générateur de commit."
            },
            {
                role: "user",
                content: `
                        Generate a corresponding commit and branch name according to the information in the following ticket:\n
                        Ticket Title: ${title}\n
                        Expected Commit Format: ${prefix}-${numberTicket}: {create a short English description of the title}\n
                        Expected Branch Format: ${type}/${prefix}-${numberTicket}/{lowercase description with underscores in English}\n
                        Ton retour doit être :\n
                        commit:{commit};branch:{branch}
                    `
            },
        ]
    }

    const fetchAi = async () => {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
            },
            body: JSON.stringify(promptAi)
        });
        return await response.json();
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
            setDisabled(false);

            return {commit, branch};
        }

        return {commit: '', branch: ''};
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setDisabled(true)
        const {commit, branch} = await generate();
        setCommit(commit);
        setBranch(branch);
    }

    return <>
        <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 lg:text-4xl mt-4">Jira To Git</h3>
        <form className="flex flex-col gap-4 mt-2">
            {/*  Champs de saisie */}
            <div className="flex gap-4">

                <input
                    max={999}
                    maxLength={3}
                    className="min-w-[150px] p-4 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 lg:text-lg"
                    type="number"
                    placeholder="NumberTicket"
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 3) {
                            setNumberTicket(value);
                        } else {
                            e.target.value = value.slice(0, 3);
                        }
                    }}
                />

                <input
                    className="min-w-[500px] p-4 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 lg:text-lg"
                    type="text"
                    placeholder="Title"
                    onChange={(e) => setTitle(e.target.value)}
                />
                <select
                    className="w-full p-4 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 lg:text-lg h-14"
                    onChange={(e) => setType(e.target.value as TransformType)}
                >
                    <option value="fix">Fix</option>
                    <option value="issue">Issue</option>
                    <option value="bug">Bug</option>
                    <option value="feat">Feature</option>
                </select>
                <button
                    className={"p-4 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 lg:text-lg"
                    + (disabled || !numberTicket || !title ? ' cursor-not-allowed' : ' cursor-pointer')}
                    onClick={handleSubmit}
                    disabled={disabled || !numberTicket || !title}
                >
                    Generate
                </button>
            </div>

            {/*  Champs de résultats commit et branches */}
            {
                (commit && branch) &&
                <div className="flex gap-4">
                    <div className="w-full flex flex-col gap-4">
                        <label className="text-gray-900 dark:text-gray-100 lg:text-lg">Commit</label>
                        <input
                            className="w-full p-4 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 lg:text-lg"
                            type="text"
                            placeholder="Commit"
                            readOnly
                            defaultValue={commit}
                        />

                        <label className="text-gray-900 dark:text-gray-100 lg:text-lg">Branch</label>
                        <input
                            className="w-full p-4 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 lg:text-lg"
                            type="text"
                            placeholder="Branch"
                            readOnly
                            defaultValue={branch}
                        />
                    </div>
                </div>
            }
        </form>
    </>
        ;
}

export default JiraToGit;