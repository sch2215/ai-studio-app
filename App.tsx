
import React, { useState, useCallback, useMemo } from 'react';
import { ARTIST_TAGS } from './constants/artists';
import { ArtistPrefixOption, WeightDistributionOption } from './types';
import ArtistSelector from './components/ArtistSelector';
import ConfigurationPanel from './components/ConfigurationPanel';
import ResultDisplay from './components/ResultDisplay';
import HistoryDisplay from './components/HistoryDisplay';

const App: React.FC = () => {
    // FIX: Created a new sorted array from ARTIST_TAGS instead of mutating the import.
    const [masterArtistList, setMasterArtistList] = useState<string[]>([...ARTIST_TAGS].sort());
    const [selectedArtists, setSelectedArtists] = useState<Set<string>>(new Set());
    const [minWeight, setMinWeight] = useState<number>(0.05);
    const [maxWeight, setMaxWeight] = useState<number>(1.5);
    const [artistPrefix, setArtistPrefix] = useState<ArtistPrefixOption>(ArtistPrefixOption.RANDOM);
    const [minTags, setMinTags] = useState<number>(3);
    const [maxTags, setMaxTags] = useState<number>(7);
    const [generatedTags, setGeneratedTags] = useState<string>('');
    const [weightDistribution, setWeightDistribution] = useState<WeightDistributionOption>(WeightDistributionOption.UNIFORM);
    const [history, setHistory] = useState<string[]>([]);

    const handleToggleArtist = useCallback((artist: string) => {
        setSelectedArtists(prev => {
            const newSet = new Set(prev);
            if (newSet.has(artist)) {
                newSet.delete(artist);
            } else {
                newSet.add(artist);
            }
            return newSet;
        });
    }, []);

    const handleAddArtist = useCallback((artist: string) => {
        const trimmedArtist = artist.trim();
        if (trimmedArtist && !masterArtistList.includes(trimmedArtist)) {
            // FIX: Added a compare function to sort to ensure correct type inference.
            setMasterArtistList(prev => [...prev, trimmedArtist].sort((a, b) => a.localeCompare(b)));
            handleToggleArtist(trimmedArtist);
        }
    }, [masterArtistList, handleToggleArtist]);

    const handleSelectAll = useCallback((artistsToSelect: string[]) => {
        setSelectedArtists(new Set(artistsToSelect));
    }, []);

    const handleDeselectAll = useCallback(() => {
        setSelectedArtists(new Set());
    }, []);

    const generateTags = useCallback(() => {
        if (selectedArtists.size === 0) {
            setGeneratedTags("조합할 작가 태그를 하나 이상 선택해주세요.");
            return;
        }

        const selectedArray = Array.from(selectedArtists);
        const count = Math.floor(Math.random() * (maxTags - minTags + 1)) + minTags;
        const numToPick = Math.min(count, selectedArray.length);

        // Shuffle and pick
        // FIX: The `sort` method with a random comparator can cause incorrect type inference in TypeScript. Asserting the result to `string[]` ensures correct typing for subsequent operations.
        const shuffled = selectedArray.sort(() => 0.5 - Math.random()) as string[];
        const picked = shuffled.slice(0, numToPick);

        const finalTags = picked.map(tag => {
            // Add a space if the tag ends with a number to prevent weight parsing issues.
            let processedTag = /\d$/.test(tag) ? `${tag} ` : tag;

            // Apply artist prefix
            let usePrefix = false;
            switch (artistPrefix) {
                case ArtistPrefixOption.ALL:
                    usePrefix = true;
                    break;
                case ArtistPrefixOption.RANDOM:
                    usePrefix = Math.random() > 0.5;
                    break;
                case ArtistPrefixOption.NONE:
                default:
                    usePrefix = false;
                    break;
            }
            if (usePrefix) {
                processedTag = `artist:${processedTag}`;
            }

            // Apply weight
            let randomFactor: number;
            switch (weightDistribution) {
                case WeightDistributionOption.FAVOR_LOW:
                    randomFactor = Math.pow(Math.random(), 2); // Skews towards 0
                    break;
                case WeightDistributionOption.FAVOR_HIGH:
                    randomFactor = 1 - Math.pow(1 - Math.random(), 2); // Skews towards 1
                    break;
                case WeightDistributionOption.NORMAL:
                    // Simple approximation of normal distribution (triangular)
                    randomFactor = (Math.random() + Math.random()) / 2;
                    break;
                case WeightDistributionOption.UNIFORM:
                default:
                    randomFactor = Math.random();
                    break;
            }
            const weight = randomFactor * (maxWeight - minWeight) + minWeight;

            if (weight.toFixed(2) !== '0.00') {
                 processedTag = `${weight.toFixed(2)}::${processedTag}::`;
            }

            return processedTag;
        });

        const finalTagString = finalTags.join(', ');
        setGeneratedTags(finalTagString);

        setHistory(prev => {
            const newHistory = [finalTagString, ...prev.filter(item => item !== finalTagString)];
            return newHistory.slice(0, 20);
        });

    }, [selectedArtists, minWeight, maxWeight, artistPrefix, minTags, maxTags, weightDistribution]);
    
    const handleHistorySelect = useCallback((tags: string) => {
        setGeneratedTags(tags);
    }, []);
    
    const memoizedResultDisplay = useMemo(() => <ResultDisplay generatedTags={generatedTags} />, [generatedTags]);

    return (
        <div className="min-h-screen font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-beige-400">
                        작가 태그 조합기
                    </h1>
                    <p className="mt-2 text-lg text-warm-gray-400">
                        작가 태그를 무작위로 조합하여 독특한 예술적 프롬프트를 생성하세요.
                    </p>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-6">
                        <ArtistSelector
                            masterArtistList={masterArtistList}
                            selectedArtists={selectedArtists}
                            onToggleArtist={handleToggleArtist}
                            onAddArtist={handleAddArtist}
                            onSelectAll={handleSelectAll}
                            onDeselectAll={handleDeselectAll}
                        />
                    </div>
                    <div className="flex flex-col gap-6">
                        <ConfigurationPanel
                            minWeight={minWeight}
                            setMinWeight={setMinWeight}
                            maxWeight={maxWeight}
                            setMaxWeight={setMaxWeight}
                            artistPrefix={artistPrefix}
                            setArtistPrefix={setArtistPrefix}
                            weightDistribution={weightDistribution}
                            setWeightDistribution={setWeightDistribution}
                            minTags={minTags}
                            setMinTags={setMinTags}
                            maxTags={maxTags}
                            setMaxTags={setMaxTags}
                            onGenerate={generateTags}
                            selectedCount={selectedArtists.size}
                        />
                         {memoizedResultDisplay}
                         <HistoryDisplay history={history} onSelect={handleHistorySelect} />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;