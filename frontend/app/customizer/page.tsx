'use client';

import { useState } from 'react';
import { MiniPlayer } from '@/components/MiniPlayer';
import { PlayerAppearance, SkinTone, HairStyle, BodyType, Accessory } from '@/types/player';

const skinTones: SkinTone[] = ['#F4C2A5', '#E0AC69', '#C68642', '#8D5524', '#5C3317'];
const hairStyles: HairStyle[] = ['buzz', 'short', 'messy', 'spiky', 'mohawk', 'afro'];
const bodyTypes: BodyType[] = ['thin', 'normal'];
const accessories: Accessory[] = ['none', 'glasses', 'bandana'];

export default function CustomizerPage() {
    const [appearance, setAppearance] = useState<PlayerAppearance>({
        skinTone: '#E0AC69',
        hairColor: '#2C1810',
        hairStyle: 'short',
        bodyType: 'normal',
        jerseyColorPrimary: '#FF4444',
        jerseyColorSecondary: '#FFFFFF',
        accessory: 'none',
    });

    const updateAppearance = (key: keyof PlayerAppearance, value: any) => {
        setAppearance((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
                        🎨 Player Customizer
                    </h1>
                    <p className="text-lg text-purple-100">
                        Design your perfect player
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Controls */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Customize</h2>

                            {/* Skin Tone */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Skin Tone
                                </label>
                                <div className="flex gap-2">
                                    {skinTones.map((tone) => (
                                        <button
                                            key={tone}
                                            onClick={() => updateAppearance('skinTone', tone)}
                                            className={`w-12 h-12 rounded-full border-4 transition-all ${appearance.skinTone === tone
                                                    ? 'border-purple-600 scale-110'
                                                    : 'border-gray-300 hover:border-purple-400'
                                                }`}
                                            style={{ backgroundColor: tone }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Hair Color */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Hair Color
                                </label>
                                <input
                                    type="color"
                                    value={appearance.hairColor}
                                    onChange={(e) => updateAppearance('hairColor', e.target.value)}
                                    className="w-full h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                                />
                            </div>

                            {/* Hair Style */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Hair Style
                                </label>
                                <select
                                    value={appearance.hairStyle}
                                    onChange={(e) => updateAppearance('hairStyle', e.target.value as HairStyle)}
                                    className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium"
                                >
                                    {hairStyles.map((style) => (
                                        <option key={style} value={style}>
                                            {style.charAt(0).toUpperCase() + style.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Body Type */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Body Type
                                </label>
                                <div className="flex gap-4">
                                    {bodyTypes.map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => updateAppearance('bodyType', type)}
                                            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${appearance.bodyType === type
                                                    ? 'bg-purple-600 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                        >
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Jersey Primary */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Jersey Color (Primary)
                                </label>
                                <input
                                    type="color"
                                    value={appearance.jerseyColorPrimary}
                                    onChange={(e) => updateAppearance('jerseyColorPrimary', e.target.value)}
                                    className="w-full h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                                />
                            </div>

                            {/* Jersey Secondary */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Jersey Color (Secondary)
                                </label>
                                <input
                                    type="color"
                                    value={appearance.jerseyColorSecondary}
                                    onChange={(e) => updateAppearance('jerseyColorSecondary', e.target.value)}
                                    className="w-full h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                                />
                            </div>

                            {/* Accessory */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Accessory
                                </label>
                                <select
                                    value={appearance.accessory}
                                    onChange={(e) => updateAppearance('accessory', e.target.value as Accessory)}
                                    className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium"
                                >
                                    {accessories.map((acc) => (
                                        <option key={acc} value={acc}>
                                            {acc.charAt(0).toUpperCase() + acc.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Preview</h2>
                            <div className="bg-white rounded-2xl p-8 shadow-xl">
                                <MiniPlayer
                                    appearance={appearance}
                                    size={250}
                                />
                            </div>
                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600 mb-2">Player Configuration</p>
                                <pre className="text-xs bg-gray-800 text-green-400 p-4 rounded-lg overflow-auto max-w-sm">
                                    {JSON.stringify({ appearance }, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back Button */}
                <div className="text-center mt-8">
                    <a
                        href="/"
                        className="inline-block bg-white text-purple-700 px-8 py-3 rounded-lg font-bold text-lg hover:bg-purple-100 transition-all transform hover:scale-105 shadow-lg"
                    >
                        ← Back to Gallery
                    </a>
                </div>
            </div>
        </div>
    );
}
