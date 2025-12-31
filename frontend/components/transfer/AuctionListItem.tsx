'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Auction } from '@/lib/api';
import { MiniPlayer } from '@/components/MiniPlayer';
import { generateAppearance, convertAppearance } from '@/utils/playerUtils';
import { Clock, TrendingUp, Briefcase, History, DollarSign, Gavel, Zap, Loader2, X } from 'lucide-react';
import { clsx } from 'clsx';
import { SkillBars } from '@/components/ui/SkillBars';
import { useNotification } from '@/components/ui/NotificationContext';
import { api } from '@/lib/api';

interface AuctionListItemProps {
    auction: Auction;
    isOwnListing?: boolean;
    isWinning?: boolean;
    balance?: number | null; // User's current balance
    onUpdate?: () => void;
}

export function AuctionListItem({ auction, isOwnListing, isWinning, balance, onUpdate }: AuctionListItemProps) {
    const router = useRouter();
    const { showNotification } = useNotification();
    const [timeLeft, setTimeLeft] = useState<string>('');
    
    // Calculate minimum bid increment: max(10000, currentPrice * 2%)
    const calculateMinBidIncrement = (currentPrice: number): number => {
        const MIN_BID_INCREMENT_FIXED = 10000;
        const MIN_BID_INCREMENT_PERCENT = 0.02;
        const percentIncrement = Math.ceil(currentPrice * MIN_BID_INCREMENT_PERCENT);
        return Math.max(MIN_BID_INCREMENT_FIXED, percentIncrement);
    };
    
    // Check if this is the first bid (no bid history or currentPrice equals startPrice with no bids)
    const hasBids = auction.bidHistory && auction.bidHistory.length > 0;
    const isFirstBid = !hasBids || (auction.currentPrice === auction.startPrice && !hasBids);
    
    // For first bid, minimum is startPrice; for subsequent bids, add increment
    const minBid = isFirstBid 
        ? auction.startPrice 
        : auction.currentPrice + calculateMinBidIncrement(auction.currentPrice);
    
    const [bidAmount, setBidAmount] = useState<number>(minBid);
    const [loading, setLoading] = useState(false);
    const [showBuyoutConfirm, setShowBuyoutConfirm] = useState(false);

    useEffect(() => {
        const updateTimer = () => {
            const ends = new Date(auction.expiresAt).getTime();
            const now = new Date().getTime();
            const diff = ends - now;

            if (diff <= 0) {
                setTimeLeft('ENDED');
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            if (hours > 0) {
                setTimeLeft(`${hours}h ${minutes}m`);
            } else if (minutes > 0) {
                setTimeLeft(`${minutes}m ${seconds}s`);
            } else {
                setTimeLeft(`${seconds}s`);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [auction.expiresAt]);

    // Update bid amount when current price changes
    useEffect(() => {
        const hasBids = auction.bidHistory && auction.bidHistory.length > 0;
        const isFirstBid = !hasBids || (auction.currentPrice === auction.startPrice && !hasBids);
        const newMinBid = isFirstBid 
            ? auction.startPrice 
            : auction.currentPrice + calculateMinBidIncrement(auction.currentPrice);
        if (bidAmount < newMinBid) {
            setBidAmount(newMinBid);
        }
    }, [auction.currentPrice, auction.startPrice, auction.bidHistory, bidAmount]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const isUrgent = timeLeft.includes('s') && !timeLeft.includes('m') && timeLeft !== 'ENDED';
    const player = auction.player;

    const handleBid = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const hasBids = auction.bidHistory && auction.bidHistory.length > 0;
        const isFirstBid = !hasBids || (auction.currentPrice === auction.startPrice && !hasBids);
        const minBid = isFirstBid 
            ? auction.startPrice 
            : auction.currentPrice + calculateMinBidIncrement(auction.currentPrice);
        
        if (bidAmount < minBid) {
            const errorMsg = isFirstBid 
                ? `Minimum bid is ${formatCurrency(minBid)} (starting price)`
                : `Minimum bid is ${formatCurrency(minBid)} (current price + ${formatCurrency(calculateMinBidIncrement(auction.currentPrice))})`;
            showNotification({ 
                message: errorMsg, 
                type: 'error' 
            });
            return;
        }

        // Check balance
        if (balance !== null && balance !== undefined && bidAmount > balance) {
            showNotification({ 
                message: `Insufficient funds. Your balance is ${formatCurrency(balance)}`, 
                type: 'error' 
            });
            return;
        }

        setLoading(true);
        try {
            await api.placeBid(auction.id, bidAmount);
            showNotification({
                message: `Successfully bid ${formatCurrency(bidAmount)}!`,
                type: 'success'
            });
            if (onUpdate) onUpdate();
            // Reset bid amount to new minimum after successful bid
            const newMinIncrement = calculateMinBidIncrement(bidAmount);
            setBidAmount(bidAmount + newMinIncrement);
        } catch (error: any) {
            // Parse error message to show user-friendly message
            let errorMessage = error.message || 'Failed to place bid';
            if (errorMessage.includes('Minimum bid is')) {
                // Extract the minimum bid amount from error message
                const match = errorMessage.match(/Minimum bid is (\d+)/);
                if (match) {
                    const minBidAmount = parseInt(match[1]);
                    const hasBids = auction.bidHistory && auction.bidHistory.length > 0;
                    const isFirstBid = !hasBids || (auction.currentPrice === auction.startPrice && !hasBids);
                    if (isFirstBid) {
                        errorMessage = `Minimum bid is ${formatCurrency(minBidAmount)} (starting price)`;
                    } else {
                        const minIncrement = calculateMinBidIncrement(auction.currentPrice);
                        errorMessage = `Minimum bid is ${formatCurrency(minBidAmount)} (current price + ${formatCurrency(minIncrement)})`;
                    }
                }
            } else if (errorMessage.includes('Insufficient funds')) {
                errorMessage = `Insufficient funds. Your balance is ${balance !== null && balance !== undefined ? formatCurrency(balance) : 'unknown'}`;
            } else if (errorMessage.includes('400') || errorMessage.includes('Bad Request')) {
                const hasBids = auction.bidHistory && auction.bidHistory.length > 0;
                const isFirstBid = !hasBids || (auction.currentPrice === auction.startPrice && !hasBids);
                if (isFirstBid) {
                    errorMessage = `Minimum bid is ${formatCurrency(auction.startPrice)} (starting price)`;
                } else {
                    const minIncrement = calculateMinBidIncrement(auction.currentPrice);
                    const minBid = auction.currentPrice + minIncrement;
                    errorMessage = `Minimum bid is ${formatCurrency(minBid)} (current price + ${formatCurrency(minIncrement)})`;
                }
            }
            showNotification({ message: errorMessage, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleBuyout = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowBuyoutConfirm(true);
    };

    const confirmBuyout = async () => {
        setShowBuyoutConfirm(false);
        setLoading(true);
        try {
            await api.buyoutAuction(auction.id);
            showNotification({ message: 'Player successfully acquired!', type: 'success' });
            if (onUpdate) onUpdate();
        } catch (error: any) {
            showNotification({ message: error.message || 'Failed to complete buyout', type: 'error' });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div
            onClick={() => router.push(`/players/${auction.player.id}`)}
            className={clsx(
                "group relative flex flex-col md:flex-row items-start md:items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer",
                "bg-white dark:bg-black/20",
                isWinning
                    ? "border-emerald-500/50 shadow-lg shadow-emerald-500/10 hover:border-emerald-500"
                    : isOwnListing
                        ? "border-blue-500/50 shadow-lg shadow-blue-500/10 hover:border-blue-500"
                        : "border-slate-200 dark:border-emerald-900/20 hover:border-emerald-500/50 hover:shadow-md"
            )}
        >
            {/* Badge */}
            {(isWinning || isOwnListing) && (
                <div className={clsx(
                    "absolute top-2 right-2 px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter flex items-center gap-1 shadow-sm z-10",
                    isWinning ? "bg-emerald-500 text-white" : "bg-blue-500 text-white"
                )}>
                    {isWinning ? <TrendingUp size={10} /> : <Briefcase size={10} />}
                    {isWinning ? 'WINNING' : 'YOUR LISTING'}
                </div>
            )}

            {/* Player Avatar */}
            <div className="relative shrink-0">
                <div className="w-28 h-28 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-emerald-950/40 dark:to-emerald-900/20 flex items-center justify-center p-2 border-2 border-emerald-500/20">
                    <MiniPlayer
                        appearance={convertAppearance(player.appearance) || generateAppearance(player.id)}
                        size={96}
                    />
                </div>
                {/* OVR Badge */}
                <div className="absolute bottom-0 right-0 w-10 h-10 bg-emerald-500 rounded-lg border-2 border-white dark:border-emerald-900 shadow-lg flex items-center justify-center z-10">
                    <span className="text-sm font-black text-white">{player.overall}</span>
                </div>
            </div>

            {/* Player Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="text-base font-black italic text-slate-900 dark:text-white uppercase truncate">
                                {player.name}
                            </h3>
                            {/* Status Stats - moved next to name */}
                            <div className="flex items-center gap-1.5">
                                <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/5">
                                    <span className="text-[7px] font-bold text-amber-600 dark:text-amber-400 uppercase">STA</span>
                                    <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 tabular-nums">
                                        {Math.floor(player.stamina || 0)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/5">
                                    <span className="text-[7px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">FRM</span>
                                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                                        {Math.floor(player.form || 0)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/5">
                                    <span className="text-[7px] font-bold text-blue-600 dark:text-blue-400 uppercase">EXP</span>
                                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 tabular-nums">
                                        {Math.floor(player.experience || 0)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                            <span>Age {player.age}, Day {player.ageDays || 0}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span>{player.isGoalkeeper ? 'Goalkeeper' : 'Outfield'}</span>
                            {player.isYouth && (
                                <>
                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                    <span className="text-emerald-600 dark:text-emerald-400">Youth</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Team Name */}
                    <div className="text-right shrink-0">
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                            From
                        </div>
                        <div className="text-xs font-black text-slate-700 dark:text-slate-300">
                            {auction.team.name}
                        </div>
                    </div>
                </div>

                {/* Skills Display - using shared component */}
                <div className="mt-2">
                    <SkillBars 
                        currentSkills={player.currentSkills} 
                        potentialSkills={player.potentialSkills}
                        isGoalkeeper={player.isGoalkeeper}
                    />
                </div>

                {/* Bid History */}
                {auction.bidHistory && auction.bidHistory.length > 0 && (
                    <div className="mt-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 p-2">
                        <div className="flex items-center gap-1.5 mb-2">
                            <History size={12} className="text-slate-500 dark:text-slate-400" />
                            <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Bid History ({auction.bidHistory.length})
                            </span>
                        </div>
                        <div className="space-y-1 max-h-24 overflow-y-auto">
                            {auction.bidHistory.slice().reverse().slice(0, 5).map((bid: any, index: number) => (
                                <div key={index} className="flex items-center justify-between text-[9px] py-0.5 border-b border-slate-200 dark:border-slate-700 last:border-0">
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <span className="text-slate-600 dark:text-slate-400 font-bold truncate">
                                            {bid.teamName || bid.teamId?.substring(0, 8) || 'Unknown'}
                                        </span>
                                        <span className="text-slate-400 text-[8px] shrink-0">
                                            {bid.timestamp ? new Date(bid.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                        </span>
                                    </div>
                                    <span className="text-emerald-600 dark:text-emerald-400 font-black tabular-nums shrink-0 ml-2">
                                        {formatCurrency(bid.amount)}
                                    </span>
                                </div>
                            ))}
                            {auction.bidHistory.length > 5 && (
                                <div className="text-[8px] text-slate-400 text-center pt-1">
                                    +{auction.bidHistory.length - 5} more
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>

            {/* Auction Info */}
            <div className="shrink-0 w-full md:w-48 text-left md:text-right space-y-2">
                <div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mb-1">
                        Current Price
                    </div>
                    <div className="text-xl font-black italic text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(auction.currentPrice)}
                    </div>
                </div>
                <div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mb-1">
                        Buyout
                    </div>
                    <div className="text-sm font-black text-slate-700 dark:text-slate-300">
                        {formatCurrency(auction.buyoutPrice)}
                    </div>
                </div>
                <div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mb-1">
                        {auction.status === 'ACTIVE' ? 'Expires In' : 'Status'}
                    </div>
                    <div className={clsx(
                        "text-sm font-black italic flex items-center gap-1",
                        "md:justify-end",
                        auction.status === 'ACTIVE' && isUrgent ? "text-rose-500 animate-pulse" : "text-slate-700 dark:text-slate-300"
                    )}>
                        <Clock size={14} />
                        {auction.status === 'ACTIVE' ? timeLeft : auction.status}
                    </div>
                </div>
                {/* Bid Input and Actions */}
                {!isOwnListing && timeLeft !== 'ENDED' && auction.status === 'ACTIVE' && (
                    <div className="mt-3 space-y-2" onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                            <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                            <input
                                type="number"
                                value={bidAmount}
                                onChange={(e) => setBidAmount(parseInt(e.target.value) || 0)}
                                min={minBid}
                                step={isFirstBid ? 1000 : calculateMinBidIncrement(auction.currentPrice)}
                                className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-black/20 border-2 border-emerald-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 font-black italic"
                                placeholder={`Min: ${formatCurrency(minBid)}`}
                            />
                        </div>
                        <div className="text-[9px] text-slate-500 dark:text-slate-400 font-bold text-center">
                            {isFirstBid ? (
                                <>Minimum bid: {formatCurrency(minBid)} (starting price)</>
                            ) : (
                                <>Minimum bid: {formatCurrency(minBid)} (current + {formatCurrency(calculateMinBidIncrement(auction.currentPrice))})</>
                            )}
                        </div>
                        {balance !== null && balance !== undefined && (
                            <div className={clsx(
                                "text-[9px] font-bold text-center",
                                bidAmount > balance ? "text-rose-500 dark:text-rose-400" : "text-slate-500 dark:text-slate-400"
                            )}>
                                Your balance: {formatCurrency(balance)}
                                {bidAmount > balance && (
                                    <span className="ml-1">⚠️ Insufficient funds</span>
                                )}
                            </div>
                        )}
                        <div className="flex gap-2">
                            <button
                                onClick={handleBid}
                                disabled={loading || bidAmount < minBid || (balance !== null && balance !== undefined && bidAmount > balance)}
                                className={clsx(
                                    "flex-1 py-2 rounded-lg font-black italic text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5",
                                    loading || bidAmount < minBid || (balance !== null && balance !== undefined && bidAmount > balance)
                                        ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                                        : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 active:scale-95"
                                )}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Gavel size={14} />
                                        PLACE BID
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleBuyout}
                                disabled={loading || (balance !== null && balance !== undefined && auction.buyoutPrice > balance)}
                                className={clsx(
                                    "flex-1 py-2 rounded-lg font-black italic text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5",
                                    loading || (balance !== null && balance !== undefined && auction.buyoutPrice > balance)
                                        ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                                        : "bg-emerald-900 hover:bg-black text-white shadow-lg active:scale-95"
                                )}
                            >
                                <Zap size={14} fill="currentColor" />
                                BUYOUT
                            </button>
                        </div>
                    </div>
                )}
                {isOwnListing && (
                    <div className="mt-2 py-2 rounded-lg font-black italic text-xs uppercase tracking-wider bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 text-center">
                        YOUR AUCTION
                    </div>
                )}
                {timeLeft === 'ENDED' && (
                    <div className="mt-2 py-2 rounded-lg font-black italic text-xs uppercase tracking-wider bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 text-center">
                        ENDED
                    </div>
                )}
            </div>

            {/* Buyout Confirmation Dialog */}
            {showBuyoutConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
                    <div className="relative w-full max-w-md bg-white dark:bg-black/90 rounded-2xl border-2 border-emerald-500/50 shadow-2xl p-6 space-y-6" onClick={(e) => e.stopPropagation()}>
                        {/* Close button */}
                        <button
                            onClick={() => setShowBuyoutConfirm(false)}
                            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <X size={20} className="text-slate-500" />
                        </button>

                        {/* Header */}
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                                <Zap size={32} className="text-emerald-500" fill="currentColor" />
                            </div>
                            <h3 className="text-2xl font-black italic text-slate-900 dark:text-white uppercase">
                                Instant Buyout
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Confirm your purchase
                            </p>
                        </div>

                        {/* Player Info */}
                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-emerald-950/40 dark:to-emerald-900/20 flex items-center justify-center border border-emerald-500/20">
                                    <MiniPlayer
                                        appearance={convertAppearance(auction.player.appearance) || generateAppearance(auction.player.id)}
                                        size={40}
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="font-black text-lg text-slate-900 dark:text-white uppercase">
                                        {auction.player.name}
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                        {auction.player.isGoalkeeper ? 'GK' : 'MID'} • OVR {auction.player.overall}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Price Comparison */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                <span className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase">Current Price</span>
                                <span className="text-lg font-black text-slate-700 dark:text-slate-300">
                                    {formatCurrency(auction.currentPrice)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-lg border-2 border-emerald-500/30">
                                <span className="text-base font-black text-emerald-600 dark:text-emerald-400 uppercase">Buyout Price</span>
                                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                    {formatCurrency(auction.buyoutPrice)}
                                </span>
                            </div>
                            {auction.buyoutPrice > auction.currentPrice && (
                                <div className="flex items-center justify-between p-2 bg-amber-500/10 dark:bg-amber-500/5 rounded-lg border border-amber-500/20">
                                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">Extra Cost</span>
                                    <span className="text-sm font-black text-amber-600 dark:text-amber-400">
                                        {formatCurrency(auction.buyoutPrice - auction.currentPrice)}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Warning */}
                        <div className="p-3 bg-amber-500/10 dark:bg-amber-500/5 rounded-lg border border-amber-500/20">
                            <p className="text-xs text-amber-700 dark:text-amber-400 font-bold text-center">
                                ⚠️ This action cannot be undone. The player will be immediately transferred to your team.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowBuyoutConfirm(false)}
                                className="flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-wider bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmBuyout}
                                disabled={loading}
                                className="flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-wider bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Zap size={16} fill="currentColor" />
                                        Confirm Buyout
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

