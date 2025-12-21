'use client';

import { X, Gavel, Clock, DollarSign, TrendingUp, AlertCircle, Info } from 'lucide-react';
import { clsx } from 'clsx';

interface TransferMarketRulesDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TransferMarketRulesDialog({ isOpen, onClose }: TransferMarketRulesDialogProps) {
    if (!isOpen) return null;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div 
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-black/95 rounded-2xl border-2 border-emerald-500/50 shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border-b border-emerald-500/30 p-6 flex items-center justify-between backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                            <Gavel size={24} className="text-emerald-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black italic text-slate-900 dark:text-white uppercase tracking-tight">
                                Transfer Market Rules
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Understanding the auction system
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <X size={24} className="text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] custom-scrollbar space-y-6">
                    {/* Bidding Rules */}
                    <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-xl p-5 border border-emerald-500/20">
                        <div className="flex items-center gap-3 mb-4">
                            <Gavel size={20} className="text-emerald-500" />
                            <h3 className="text-lg font-black italic text-slate-900 dark:text-white uppercase">
                                Bidding Rules
                            </h3>
                        </div>
                        <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">1</span>
                                </div>
                                <div>
                                    <p className="font-bold mb-1">First Bid</p>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        For players with no bids yet, you can bid the <span className="font-black text-emerald-600 dark:text-emerald-400">starting price</span>. No additional increment required.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">2</span>
                                </div>
                                <div>
                                    <p className="font-bold mb-1">Subsequent Bids</p>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        After the first bid, each new bid must be at least <span className="font-black text-emerald-600 dark:text-emerald-400">current price + increment</span>.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">3</span>
                                </div>
                                <div>
                                    <p className="font-bold mb-1">Bid Increment Calculation</p>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Minimum increment is the <span className="font-black text-emerald-600 dark:text-emerald-400">maximum of £10,000 or 2% of current price</span>.
                                    </p>
                                    <div className="mt-2 p-3 bg-slate-100 dark:bg-slate-900/50 rounded-lg text-xs font-mono">
                                        <p className="text-slate-500 dark:text-slate-400 mb-1">Examples:</p>
                                        <p>• Current: {formatCurrency(500000)} → Min increment: {formatCurrency(10000)}</p>
                                        <p>• Current: {formatCurrency(1000000)} → Min increment: {formatCurrency(20000)} (2%)</p>
                                        <p>• Current: {formatCurrency(2000000)} → Min increment: {formatCurrency(40000)} (2%)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Auction Duration */}
                    <div className="bg-gradient-to-br from-blue-500/10 to-emerald-500/10 rounded-xl p-5 border border-blue-500/20">
                        <div className="flex items-center gap-3 mb-4">
                            <Clock size={20} className="text-blue-500" />
                            <h3 className="text-lg font-black italic text-slate-900 dark:text-white uppercase">
                                Auction Duration
                            </h3>
                        </div>
                        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                            <p>When listing a player, you can choose from:</p>
                            <ul className="list-disc list-inside space-y-1 ml-4 text-slate-600 dark:text-slate-400">
                                <li><span className="font-bold">48 hours</span> - Standard auction duration</li>
                                <li><span className="font-bold">72 hours</span> - Extended auction duration</li>
                            </ul>
                            <div className="mt-3 p-3 bg-amber-500/10 dark:bg-amber-500/5 rounded-lg border border-amber-500/20">
                                <div className="flex items-start gap-2">
                                    <AlertCircle size={16} className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-amber-700 dark:text-amber-400">
                                        <span className="font-bold">Auto-extension:</span> If a bid is placed within the last 3 minutes, the auction extends by 3 minutes to prevent last-second sniping.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Buyout Option */}
                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-5 border border-purple-500/20">
                        <div className="flex items-center gap-3 mb-4">
                            <TrendingUp size={20} className="text-purple-500" />
                            <h3 className="text-lg font-black italic text-slate-900 dark:text-white uppercase">
                                Instant Buyout
                            </h3>
                        </div>
                        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                            <p>Every auction has a <span className="font-black text-purple-600 dark:text-purple-400">buyout price</span> set by the seller.</p>
                            <ul className="list-disc list-inside space-y-1 ml-4 text-slate-600 dark:text-slate-400">
                                <li>You can instantly purchase the player at the buyout price at any time</li>
                                <li>Buyout immediately ends the auction and transfers the player to your team</li>
                                <li>This action cannot be undone</li>
                            </ul>
                        </div>
                    </div>

                    {/* Payment & Funds */}
                    <div className="bg-gradient-to-br from-slate-500/10 to-slate-600/10 rounded-xl p-5 border border-slate-500/20">
                        <div className="flex items-center gap-3 mb-4">
                            <DollarSign size={20} className="text-slate-500" />
                            <h3 className="text-lg font-black italic text-slate-900 dark:text-white uppercase">
                                Payment & Funds
                            </h3>
                        </div>
                        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                            <p>Before placing a bid or buying out:</p>
                            <ul className="list-disc list-inside space-y-1 ml-4 text-slate-600 dark:text-slate-400">
                                <li>Ensure you have sufficient funds in your account</li>
                                <li>The bid amount will be reserved until the auction ends</li>
                                <li>If you're outbid, your funds are immediately returned</li>
                                <li>If you win, the payment is processed automatically</li>
                            </ul>
                        </div>
                    </div>

                    {/* Important Notes */}
                    <div className="bg-gradient-to-br from-rose-500/10 to-amber-500/10 rounded-xl p-5 border border-rose-500/20">
                        <div className="flex items-center gap-3 mb-4">
                            <Info size={20} className="text-rose-500" />
                            <h3 className="text-lg font-black italic text-slate-900 dark:text-white uppercase">
                                Important Notes
                            </h3>
                        </div>
                        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                            <ul className="list-disc list-inside space-y-1 ml-4 text-slate-600 dark:text-slate-400">
                                <li>You cannot bid on your own listings</li>
                                <li>Once an auction ends, the highest bidder wins the player</li>
                                <li>All transactions are final and cannot be reversed</li>
                                <li>Players listed on the market cannot be used in matches until the auction ends</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 p-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-xl font-black text-sm uppercase tracking-wider bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
}

