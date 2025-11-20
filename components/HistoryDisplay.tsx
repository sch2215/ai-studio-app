
import React from 'react';

interface HistoryDisplayProps {
    history: string[];
    onSelect: (tags: string) => void;
}

const HistoryDisplay: React.FC<HistoryDisplayProps> = ({ history, onSelect }) => {
    return (
        <div className="bg-warm-gray-900 rounded-lg p-4 sm:p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-beige-400">최근 기록 (최대 20개)</h2>
            {history.length === 0 ? (
                <p className="text-warm-gray-400 text-center py-4">생성 기록이 없습니다.</p>
            ) : (
                <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                    {history.map((tags, index) => (
                        <div
                            key={`${index}-${tags.substring(0, 10)}`}
                            onClick={() => onSelect(tags)}
                            className="bg-warm-gray-800/50 p-3 rounded-md cursor-pointer hover:bg-warm-gray-800 transition duration-150"
                        >
                            <p className="text-sm text-beige-300 truncate">
                                {tags}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoryDisplay;