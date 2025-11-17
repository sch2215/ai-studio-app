
import React, { useState, useEffect } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';

interface ResultDisplayProps {
    generatedTags: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ generatedTags }) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    const handleCopy = () => {
        if (generatedTags) {
            navigator.clipboard.writeText(generatedTags);
            setCopied(true);
        }
    };

    return (
        <div className="bg-warm-gray-900 rounded-lg p-4 sm:p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-beige-400">3. 결과</h2>
            <div className="relative">
                <textarea
                    readOnly
                    value={generatedTags}
                    placeholder="생성된 태그가 여기에 표시됩니다..."
                    className="w-full h-48 bg-warm-gray-950/50 border border-warm-gray-700 rounded-md p-4 resize-none focus:outline-none custom-scrollbar"
                />
                <button
                    onClick={handleCopy}
                    className="absolute top-3 right-3 bg-warm-gray-800 hover:bg-warm-gray-700 text-beige-200 p-2 rounded-md transition duration-200"
                    aria-label="클립보드에 복사"
                >
                    {copied ? (
                        <span className="text-sm text-beige-400">복사됨!</span>
                    ) : (
                        <ClipboardIcon />
                    )}
                </button>
            </div>
        </div>
    );
};

export default ResultDisplay;