
import React, { useState, useMemo, useRef } from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { UploadIcon } from './icons/UploadIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface ArtistSelectorProps {
    masterArtistList: string[];
    selectedArtists: Set<string>;
    onToggleArtist: (artist: string) => void;
    onAddArtist: (artist: string) => void;
    onImportArtists: (artists: string[]) => void;
    onSelectAll: (artistsToSelect: string[]) => void;
    onDeselectAll: () => void;
}

const ArtistSelector: React.FC<ArtistSelectorProps> = ({
    masterArtistList,
    selectedArtists,
    onToggleArtist,
    onAddArtist,
    onImportArtists,
    onSelectAll,
    onDeselectAll
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [customArtist, setCustomArtist] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleExport = () => {
        const content = masterArtistList.join('\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'artist_tags.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            // Split by newline or comma to support various formats
            const newArtists = text.split(/[,\n]+/).map(s => s.trim()).filter(s => s);
            
            if (newArtists.length > 0) {
                onImportArtists(newArtists);
                alert(`${newArtists.length}개의 태그를 처리했습니다.`);
            } else {
                alert("파일에서 유효한 태그를 찾을 수 없습니다.");
            }
            
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        };
        reader.readAsText(file);
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

            <div className="flex gap-2 mb-4">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".txt,.csv"
                    className="hidden"
                />
                <button 
                    onClick={handleImportClick}
                    className="flex-1 bg-warm-gray-800 hover:bg-warm-gray-700 border border-warm-gray-700 text-beige-300 font-semibold py-2 px-4 rounded-md transition duration-200 flex items-center justify-center gap-2 text-sm"
                >
                    <UploadIcon />
                    리스트 불러오기
                </button>
                <button 
                    onClick={handleExport}
                    className="flex-1 bg-warm-gray-800 hover:bg-warm-gray-700 border border-warm-gray-700 text-beige-300 font-semibold py-2 px-4 rounded-md transition duration-200 flex items-center justify-center gap-2 text-sm"
                >
                    <DownloadIcon />
                    리스트 내보내기
                </button>
            </div>

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
