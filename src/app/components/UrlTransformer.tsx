'use client';
import {useState} from "react";

type TransformType = 'encode' | 'decode';

const UrlTransformer = ({classes: string = ''}) => {
    const [url, setUrl] = useState<string>('');
    const [transform, setTransform] = useState<TransformType>('encode');

    const transformUrl = () => {
        let result = url;
        switch (transform) {
            case 'encode':
                result = encodeURIComponent(url);
                break;
            case 'decode':
                result = decodeURIComponent(url);
                break;
        }
        return result;
    };

    return <>
        <div className={'mt-4'}>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 lg:text-4xl">
                URL Encoder / Decoder
            </h3>
            <form className="flex gap-4 mt-2">
                <textarea
                    className="min-w-[300px] p-4 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 lg:text-lg"
                    rows={4}
                    placeholder="Texte a encoder/decoder"
                    onChange={(e) => setUrl(e.target.value)}
                />
                <select
                    className="w-full p-4 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 lg:text-lg h-14"
                    onChange={(e) => setTransform(e.target.value as TransformType)}
                    defaultValue={transform}
                >
                    <option value="encode">Encode</option>
                    <option value="decode">Decode</option>
                </select>
                <span
                    className="p-4 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 lg:text-lg h-14">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-900 dark:text-gray-100"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                    </svg>
                </span>
                <textarea
                    className="w-full p-4 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 lg:text-lg"
                    placeholder="Résultat"
                    readOnly
                    value={transformUrl()}
                />
            </form>
        </div>
    </>
}

export default UrlTransformer;