
import React from 'react';
import { ArtistPrefixOption, WeightDistributionOption } from '../types';

interface ConfigurationPanelProps {
    minWeight: number;
    setMinWeight: (value: number) => void;
    maxWeight: number;
    setMaxWeight: (value: number) => void;
    artistPrefix: ArtistPrefixOption;
    setArtistPrefix: (value: ArtistPrefixOption) => void;
    weightDistribution: WeightDistributionOption;
    setWeightDistribution: (value: WeightDistributionOption) => void;
    minTags: number;
    setMinTags: (value: number) => void;
    maxTags: number;
    setMaxTags: (value: number) => void;
    onGenerate: () => void;
    selectedCount: number;
}

const Slider: React.FC<{ label: string; value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; min: number; max: number; step: number }> = ({ label, value, onChange, min, max, step }) => (
    <div>
        <label className="block text-sm font-medium text-beige-200 mb-1">{label}: <span className="font-bold text-beige-400">{value.toFixed(2)}</span></label>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className="w-full h-2 bg-warm-gray-700 rounded-lg appearance-none cursor-pointer accent-beige-500"
        />
    </div>
);

const prefixLabels: { [key in ArtistPrefixOption]: string } = {
    [ArtistPrefixOption.ALL]: '전부 붙이기',
    [ArtistPrefixOption.NONE]: '전부 빼기',
    [ArtistPrefixOption.RANDOM]: '랜덤',
};

const distributionLabels: { [key in WeightDistributionOption]: string } = {
    [WeightDistributionOption.UNIFORM]: '균등',
    [WeightDistributionOption.FAVOR_LOW]: '낮은 가중치 선호',
    [WeightDistributionOption.FAVOR_HIGH]: '높은 가중치 선호',
    [WeightDistributionOption.NORMAL]: '중간 가중치 선호',
};


const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
    minWeight, setMinWeight, maxWeight, setMaxWeight,
    artistPrefix, setArtistPrefix,
    weightDistribution, setWeightDistribution,
    minTags, setMinTags, maxTags, setMaxTags,
    onGenerate, selectedCount
}) => {
    
    const handleMinTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        setMinTags(value);
        if (value > maxTags) {
            setMaxTags(value);
        }
    };

    const handleMaxTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        setMaxTags(value);
        if (value < minTags) {
            setMinTags(value);
        }
    };
    
    return (
        <div className="bg-warm-gray-900 rounded-lg p-4 sm:p-6 shadow-lg space-y-6">
            <h2 className="text-xl font-bold text-beige-400">2. 조합 설정</h2>

            <div>
                <h3 className="font-semibold mb-2 text-beige-200">가중치 범위</h3>
                <div className="space-y-4">
                    <Slider label="최소 가중치" value={minWeight} onChange={e => setMinWeight(parseFloat(e.target.value))} min={0} max={3} step={0.05} />
                    <Slider label="최대 가중치" value={maxWeight} onChange={e => setMaxWeight(parseFloat(e.target.value))} min={0} max={3} step={0.05} />
                </div>
            </div>

            <div>
                <h3 className="font-semibold mb-2 text-beige-200">가중치 분포</h3>
                <div className="flex flex-wrap gap-4">
                    {(Object.values(WeightDistributionOption)).map(option => (
                        <label key={option} className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="weight-distribution"
                                value={option}
                                checked={weightDistribution === option}
                                onChange={() => setWeightDistribution(option)}
                                className="form-radio h-4 w-4 text-beige-600 bg-warm-gray-800 border-warm-gray-600 focus:ring-beige-500"
                            />
                            <span>{distributionLabels[option]}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="font-semibold mb-2 text-beige-200">"artist:" 접두사</h3>
                <div className="flex flex-wrap gap-4">
                    {(Object.values(ArtistPrefixOption)).map(option => (
                        <label key={option} className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="artist-prefix"
                                value={option}
                                checked={artistPrefix === option}
                                onChange={() => setArtistPrefix(option)}
                                className="form-radio h-4 w-4 text-beige-600 bg-warm-gray-800 border-warm-gray-600 focus:ring-beige-500"
                            />
                            <span>{prefixLabels[option]}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="font-semibold mb-2 text-beige-200">조합할 태그 수</h3>
                 <div className="space-y-4">
                    <Slider label="최소 태그" value={minTags} onChange={handleMinTagsChange} min={1} max={Math.max(20, selectedCount)} step={1} />
                    <Slider label="최대 태그" value={maxTags} onChange={handleMaxTagsChange} min={1} max={Math.max(20, selectedCount)} step={1} />
                </div>
            </div>
            
            <button
                onClick={onGenerate}
                disabled={selectedCount === 0}
                className="w-full bg-gradient-to-r from-beige-500 to-beige-600 hover:from-beige-600 hover:to-beige-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl disabled:from-warm-gray-700 disabled:to-warm-gray-800 disabled:cursor-not-allowed disabled:shadow-none"
            >
                태그 생성
            </button>
        </div>
    );
};

export default ConfigurationPanel;