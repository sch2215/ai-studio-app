
import React, { useState, useMemo } from 'react';
import { PlusIcon } from './icons/PlusIcon';

interface ArtistSelectorProps {
    masterArtistList: string[];
    selectedArtists: Set<string>;
    onToggleArtist: (artist: string) => void;
    onAddArtist: (artist: string) => void;
    onSelectAll: (artistsToSelect: string[]) => void;
    onDeselectAll: () => void;
}

const ArtistSelector: React.FC<ArtistSelectorProps> = ({
    masterArtistList,
    selectedArtists,
    onToggleArtist,
    onAddArtist,
    onSelectAll,
    onDeselectAll
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [customArtist, setCustomArtist] = useState('');

    const filteredArtists = useMemo(() => {
        return masterArtistList.filter(artist =>
            artist.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [masterArtistList, searchTerm]);

    const handleAddCustom = (e: React.FormEvent) => {
        e.preventDefault();
        onAddArtist(customArtist);
        setCustomArtist('');
    };

    return (
        <div className="bg-warm-gray-900 rounded-lg p-4 sm:p-6 shadow-lg flex flex-col h-full">
            <h2 className="text-xl font-bold mb-4 text-beige-400">1. 작가 태그 선택</h2>
            
            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="작가를 검색하세요..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-warm-gray-800 border border-warm-gray-700 rounded-md py-2 px-4 focus:ring-2 focus:ring-beige-500 focus:border-beige-500 outline-none transition"
                />
            </div>
            
            <form onSubmit={handleAddCustom} className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="새 작가 태그 추가"
                    value={customArtist}
                    onChange={(e) => setCustomArtist(e.target.value)}
                    className="flex-grow bg-warm-gray-800 border border-warm-gray-700 rounded-md py-2 px-4 focus:ring-2 focus:ring-beige-500 focus:border-beige-500 outline-none transition"
                />
                <button type="submit" className="bg-beige-600 hover:bg-beige-500 text-white font-semibold py-2 px-4 rounded-md transition duration-200 flex items-center gap-2 disabled:bg-warm-gray-700 disabled:cursor-not-allowed" disabled={!customArtist.trim()}>
                    <PlusIcon />
                    추가
                </button>
            </form>

            <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-warm-gray-400">{selectedArtists.size} / {filteredArtists.length}개 선택됨</span>
                <div className="flex gap-2">
                    <button onClick={() => onSelectAll(filteredArtists)} className="text-xs text-beige-400 hover:text-beige-300">보이는 항목 전체 선택</button>
                    <button onClick={onDeselectAll} className="text-xs text-beige-400 hover:text-beige-300">전체 선택 해제</button>
                </div>
            </div>

            <div className="flex-grow border border-warm-gray-700 rounded-md p-2 overflow-y-auto custom-scrollbar h-96">
                {filteredArtists.map(artist => (
                    <div
                        key={artist}
                        onClick={() => onToggleArtist(artist)}
                        className={`cursor-pointer p-2 rounded-md transition duration-150 text-sm ${
                            selectedArtists.has(artist)
                                ? 'bg-beige-500/20 text-beige-300 font-medium'
                                : 'hover:bg-warm-gray-800/50'
                        }`}
                    >
                        {artist}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ArtistSelector;