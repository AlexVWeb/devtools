'use client';
import {useState} from "react";

type TransformType = 'snake' | 'camel' | 'pascal' | 'kebab' | 'screaming' | 'upper' | 'lower';

const TextTransform = () => {
    const [text, setText] = useState<string>('');
    const [transform, setTransform] = useState<TransformType>('snake');

    const transformText = () => {
        let result = text;
        switch (transform) {
            case 'snake':
                result = text.replace(/\s+/g, '_').toLowerCase();
                break;
            case 'camel':
                result = text.replace(/\s+(.)/g, (match, group) => group.toUpperCase());
                break;
            case 'pascal':
                result = text.replace(/\s+(.)/g, (match, group) => group.toUpperCase());
                result = result.charAt(0).toUpperCase() + result.slice(1);
                break;
            case 'kebab':
                result = text.replace(/\s+/g, '-').toLowerCase();
                break;
            case 'screaming':
                result = text.replace(/\s+/g, '_').toUpperCase();
                break;
            case 'upper':
                result = text.toUpperCase();
                break;
            case 'lower':
                result = text.toLowerCase();
                break;
        }
        return result;
    };


    return (
        <div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 lg:text-4xl">Transform String</h3>
            <form className="flex gap-4 mt-2">
                <div>
                    <input
                        className="min-w-[300px] p-4 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 lg:text-lg"
                        type="text"
                        placeholder="Texte a transformer"
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>
                <select
                    className="w-full p-4 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 lg:text-lg"
                    onChange={(e) => setTransform(e.target.value as TransformType)}
                >
                    <option value="snake">Snake Case</option>
                    <option value="camel">Camel Case</option>
                    <option value="pascal">Pascal Case</option>
                    <option value="kebab">Kebab Case</option>
                    <option value="screaming">Screaming Snake Case</option>
                    <option value="upper">Upper Case</option>
                    <option value="lower">Lower Case</option>
                </select>

                <span
                    className="p-4 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 lg:text-lg">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-900 dark:text-gray-100"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </span>
                <input
                    className="w-full p-4 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 lg:text-lg"
                    type="text"
                    placeholder="Résultat"
                    readOnly
                    value={transformText()}
                />
            </form>
        </div>
    );
}

export default TextTransform;