'use client';

import { useEffect, useState } from 'react';
import { api, Auction } from '@/lib/api';

interface PlayerAuctionInfoProps {
    playerId: string;
}

export function PlayerAuctionInfo({ playerId }: PlayerAuctionInfoProps) {
    const [auction, setAuction] = useState<Auction | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAuction = async () => {
            try {
                const auctionData = await api.getAuctionByPlayerId(playerId);
                setAuction(auctionData);
            } catch (error) {
                // Silently fail - not all players are on the market
                setAuction(null);
            } finally {
                setLoading(false);
            }
        };

        fetchAuction();
    }, [playerId]);

    if (loading) {
        return null; // Don't show anything while loading
    }

    if (!auction) {
        return null; // Don't show anything if no auction
    }

    return (
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
                <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
                <h2 className="text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 tracking-tight">
                    Transfer Market
                </h2>
            </div>
            <div className="relative overflow-hidden rounded-xl border-2 border-blue-500/20 bg-black/40 backdrop-blur-md p-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                <div className="relative z-10 space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <div className="text-[10px] text-blue-500 font-bold tracking-widest uppercase mb-2">Start Price</div>
                            <div className="text-xl font-black text-white">
                                {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(auction.startPrice)}
                            </div>
                        </div>
                        <div>
                            <div className="text-[10px] text-blue-500 font-bold tracking-widest uppercase mb-2">Current Price</div>
                            <div className="text-xl font-black text-emerald-400">
                                {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(auction.currentPrice)}
                            </div>
                        </div>
                        <div>
                            <div className="text-[10px] text-blue-500 font-bold tracking-widest uppercase mb-2">Buyout Price</div>
                            <div className="text-xl font-black text-blue-400">
                                {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(auction.buyoutPrice)}
                            </div>
                        </div>
                        <div>
                            <div className="text-[10px] text-blue-500 font-bold tracking-widest uppercase mb-2">Status</div>
                            <div className={`text-lg font-black ${auction.status === 'ACTIVE' ? 'text-emerald-400' : 'text-slate-400'}`}>
                                {auction.status}
                            </div>
                        </div>
                    </div>
                    {auction.currentBidder && (
                        <div className="pt-4 border-t border-emerald-900/30">
                            <div className="text-[10px] text-blue-500 font-bold tracking-widest uppercase mb-2">Current Bidder</div>
                            <div className="text-lg font-black text-white">{auction.currentBidder.name}</div>
                        </div>
                    )}
                    {auction.bidHistory && auction.bidHistory.length > 0 && (
                        <div className="pt-4 border-t border-emerald-900/30">
                            <div className="text-[10px] text-blue-500 font-bold tracking-widest uppercase mb-2">Bid History</div>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {auction.bidHistory.map((bid: any, index: number) => (
                                    <div key={index} className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400">{bid.teamName || 'Unknown'}</span>
                                        <span className="text-white font-mono font-bold">
                                            {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(bid.amount)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

