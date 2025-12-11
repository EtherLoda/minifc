'use client';

import React, { useMemo } from 'react';
import { PlayerAppearance, Position } from '@/types/player';

interface Props {
    appearance: PlayerAppearance;
    position: Position;
    size?: number;
    className?: string;
    style?: React.CSSProperties;
    preserveAspectRatio?: string;
}

export const MiniPlayer: React.FC<Props> = ({
    appearance,
    position,
    size = 100,
    className = '',
    style,
    preserveAspectRatio = "xMidYMid meet"
}) => {
    const { skinTone, hairColor, hairStyle, bodyType, jerseyColorPrimary, jerseyColorSecondary, accessory } = appearance;

    const containerStyle: React.CSSProperties = {
        width: size,
        height: size,
        ...style
    };

    const getPosColor = () => {
        switch (position) {
            case 'GK': return '#fbbf24';
            case 'DEF': return '#3b82f6';
            case 'MID': return '#22c55e';
            case 'FWD': return '#ef4444';
            default: return '#94a3b8';
        }
    };

    // Deterministic variety generator
    const varietySeed = useMemo(() => {
        let hash = 0;
        const str = hairColor + skinTone + hairStyle;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
    }, [hairColor, skinTone, hairStyle]);

    // --- Configuration ---
    const isThin = bodyType === 'thin';

    // Body Dimensions
    const torsoWidth = isThin ? 8 : 12;
    const torsoX = 16 - (torsoWidth / 2);

    // Limb Positions relative to torso
    const armL_X = torsoX - 2;
    const armR_X = torsoX + torsoWidth;
    const legL_X = torsoX + (isThin ? 1 : 2);
    const legR_X = torsoX + torsoWidth - (isThin ? 4 : 5);

    // Face Variations (0, 1, 2)
    const eyeType = varietySeed % 3;

    return (
        <div className={`relative select-none ${className}`} style={containerStyle}>
            <svg
                viewBox="0 0 32 32"
                className="w-full h-full"
                preserveAspectRatio={preserveAspectRatio}
                style={{ shapeRendering: 'crispEdges' }}
            >
                <defs>
                    <filter id={`pixel-outline-filter-${position}`} x="-50%" y="-50%" width="200%" height="200%">
                        <feMorphology in="SourceAlpha" operator="dilate" radius="1" result="dilated" />
                        <feFlood floodColor="rgba(15, 23, 42, 1)" result="flood" />
                        <feComposite in="flood" in2="dilated" operator="in" result="outline" />
                        <feMerge>
                            <feMergeNode in="outline" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Shadow on ground */}
                <rect x={isThin ? "10" : "8"} y="29" width={isThin ? "12" : "16"} height="2" fill="rgba(0,0,0,0.3)" rx="1" />

                {/* Character Group with Outline */}
                <g filter={`url(#pixel-outline-filter-${position})`}>

                    {/* --- BACK HAIR (Depth) --- */}
                    {(hairStyle === 'messy' || hairStyle === 'spiky') && (
                        <g fill={hairColor}>
                            <rect x="6" y="8" width="20" height="8" />
                            <rect x="5" y="10" width="1" height="4" />
                            <rect x="26" y="10" width="1" height="4" />
                        </g>
                    )}
                    {hairStyle === 'afro' && (
                        <g fill={hairColor}>
                            <rect x="4" y="4" width="24" height="12" rx="2" />
                            <rect x="3" y="6" width="26" height="8" />
                        </g>
                    )}

                    {/* --- NECK --- */}
                    <rect x="13" y="17" width="6" height="3" fill={skinTone} />

                    {/* --- TORSO (Jersey) --- */}
                    <rect x={torsoX} y="19" width={torsoWidth} height="8" fill={jerseyColorPrimary} />
                    {/* Jersey Pattern (Stripe) */}
                    <rect x={16 - 1} y="19" width="2" height="8" fill={jerseyColorSecondary} opacity="0.8" />

                    {/* --- ARMS --- */}
                    {/* Sleeves */}
                    <rect x={armL_X} y="19" width="2" height="4" fill={jerseyColorPrimary} />
                    <rect x={armR_X} y="19" width="2" height="4" fill={jerseyColorPrimary} />
                    {/* Skin */}
                    <rect x={armL_X} y="23" width="2" height="4" fill={skinTone} />
                    <rect x={armR_X} y="23" width="2" height="4" fill={skinTone} />

                    {/* --- LEGS / SHORTS --- */}
                    {/* Shorts */}
                    <rect x={torsoX} y="25" width={torsoWidth} height="4" fill="white" />
                    {/* Legs */}
                    <rect x={legL_X} y="29" width="3" height="2" fill={skinTone} />
                    <rect x={legR_X} y="29" width="3" height="2" fill={skinTone} />

                    {/* Boots */}
                    <rect x={legL_X - 1} y="30" width="4" height="2" fill="#1e293b" />
                    <rect x={legR_X} y="30" width="4" height="2" fill="#1e293b" />

                    {/* --- HEAD --- */}
                    {/* Main Face Block */}
                    <rect x="8" y="7" width="16" height="11" fill={skinTone} />

                    {/* Chin/Jaw Variation */}
                    {varietySeed % 2 === 0 ? (
                        <rect x="9" y="18" width="14" height="1" fill={skinTone} />
                    ) : (
                        <rect x="10" y="18" width="12" height="1" fill={skinTone} />
                    )}

                    {/* Ears */}
                    <rect x="6" y="12" width="2" height="3" fill={skinTone} />
                    <rect x="24" y="12" width="2" height="3" fill={skinTone} />

                    {/* --- FACE FEATURES --- */}
                    {/* Blush */}
                    <rect x="9" y="14" width="2" height="1" fill="#ff9999" opacity="0.6" />
                    <rect x="21" y="14" width="2" height="1" fill="#ff9999" opacity="0.6" />

                    {/* Eyes */}
                    <g fill="#1e293b">
                        {eyeType === 0 && (
                            <>
                                <rect x="10" y="11" width="2" height="3" />
                                <rect x="20" y="11" width="2" height="3" />
                            </>
                        )}
                        {eyeType === 1 && (
                            <>
                                <rect x="9" y="11" width="3" height="2" />
                                <rect x="20" y="11" width="3" height="2" />
                            </>
                        )}
                        {eyeType === 2 && (
                            <>
                                <rect x="10" y="10" width="2" height="4" />
                                <rect x="20" y="10" width="2" height="4" />
                            </>
                        )}
                    </g>

                    {/* Eye Highlights */}
                    <g fill="white">
                        <rect x={eyeType === 1 ? 9 : 10} y={11} width="1" height="1" opacity="0.8" />
                        <rect x={eyeType === 1 ? 20 : 20} y={11} width="1" height="1" opacity="0.8" />
                    </g>

                    {/* Mouth */}
                    <rect x="15" y="16" width="2" height="1" fill="#854d0e" opacity="0.6" />

                    {/* --- FRONT HAIR (Volume & Style) --- */}
                    <g fill={hairColor}>

                        {hairStyle === 'buzz' && (
                            <g>
                                <rect x="8" y="5" width="16" height="2" opacity="0.9" />
                                <rect x="8" y="7" width="1" height="3" opacity="0.9" />
                                <rect x="23" y="7" width="1" height="3" opacity="0.9" />
                            </g>
                        )}

                        {hairStyle === 'short' && (
                            <g>
                                <rect x="8" y="4" width="16" height="4" />
                                <rect x="7" y="6" width="1" height="5" />
                                <rect x="24" y="6" width="1" height="5" />
                                <rect x="9" y="7" width="3" height="2" />
                                <rect x="14" y="7" width="4" height="2" />
                                <rect x="20" y="7" width="2" height="2" />
                            </g>
                        )}

                        {hairStyle === 'messy' && (
                            <g>
                                <rect x="7" y="3" width="18" height="5" />
                                <rect x="6" y="5" width="1" height="3" />
                                <rect x="10" y="2" width="2" height="1" />
                                <rect x="15" y="1" width="2" height="2" />
                                <rect x="20" y="2" width="2" height="1" />
                                <rect x="8" y="7" width="4" height="3" />
                                <rect x="13" y="7" width="2" height="2" />
                                <rect x="19" y="7" width="3" height="3" />
                            </g>
                        )}

                        {hairStyle === 'spiky' && (
                            <g>
                                <rect x="8" y="5" width="16" height="3" />
                                <rect x="9" y="2" width="2" height="3" />
                                <rect x="14" y="1" width="4" height="4" />
                                <rect x="21" y="2" width="2" height="3" />
                                <rect x="7" y="6" width="1" height="4" />
                                <rect x="24" y="6" width="1" height="4" />
                            </g>
                        )}

                        {hairStyle === 'mohawk' && (
                            <g>
                                <rect x="14" y="1" width="4" height="8" />
                                <rect x="15" y="0" width="2" height="1" />
                                <rect x="9" y="7" width="5" height="4" opacity="0.3" />
                                <rect x="18" y="7" width="5" height="4" opacity="0.3" />
                            </g>
                        )}

                        {hairStyle === 'afro' && (
                            <g>
                                <rect x="5" y="3" width="22" height="6" />
                                <rect x="4" y="5" width="24" height="4" />
                            </g>
                        )}
                    </g>

                    {/* Accessories */}
                    {accessory === 'glasses' && (
                        <g fill="#1e293b" opacity="0.8">
                            <rect x="9" y="11" width="4" height="1" />
                            <rect x="9" y="13" width="4" height="1" />
                            <rect x="9" y="11" width="1" height="3" />
                            <rect x="12" y="11" width="1" height="3" />

                            <rect x="19" y="11" width="4" height="1" />
                            <rect x="19" y="13" width="4" height="1" />
                            <rect x="19" y="11" width="1" height="3" />
                            <rect x="22" y="11" width="1" height="3" />

                            <rect x="13" y="12" width="6" height="1" />
                        </g>
                    )}
                    {accessory === 'bandana' && (
                        <rect x="7" y="6" width="18" height="2" fill={jerseyColorSecondary} />
                    )}

                </g>
            </svg>
        </div>
    );
};
