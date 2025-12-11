import { LeagueStanding } from '@/lib/api';
import { clsx } from 'clsx';
import Link from 'next/link';

interface StandingsTableProps {
    standings: LeagueStanding[];
}

export default function StandingsTable({ standings }: StandingsTableProps) {
    return (
        <div className="rounded-2xl border transition-all duration-300 overflow-hidden
            bg-white border-emerald-500/40 shadow-none
            dark:bg-black/40 dark:border-emerald-900/50 dark:backdrop-blur-sm dark:shadow-[0_0_20px_rgba(2,44,34,0.3)]">
            <div className="px-6 h-[72px] border-b flex items-center
                bg-white border-emerald-500/40
                dark:bg-emerald-950/20 dark:border-emerald-900/50">
                <h3 className="text-lg font-bold tracking-wider uppercase flex items-center gap-2
                    text-emerald-900 dark:text-white">
                    <span className="text-emerald-500">📊</span> League Standings
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="uppercase text-[10px] font-bold tracking-widest
                        bg-emerald-50 text-emerald-700
                        dark:bg-emerald-950/40 dark:text-emerald-400">
                        <tr>
                            <th className="px-6 py-4 w-16 text-center">Pos</th>
                            <th className="px-6 py-4">Team</th>
                            <th className="px-4 py-4 text-center">P</th>
                            <th className="px-4 py-4 text-center">W</th>
                            <th className="px-4 py-4 text-center">D</th>
                            <th className="px-4 py-4 text-center">L</th>
                            <th className="px-4 py-4 text-center hidden md:table-cell">GF</th>
                            <th className="px-4 py-4 text-center hidden md:table-cell">GA</th>
                            <th className="px-4 py-4 text-center hidden md:table-cell">GD</th>
                            <th className="px-6 py-4 text-center font-bold text-emerald-900 dark:text-white">Pts</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-100 dark:divide-emerald-900/30">
                        {standings.map((team) => (
                            <tr key={team.teamId} className="transition-colors group
                                hover:bg-emerald-50
                                dark:hover:bg-emerald-900/20">
                                <td className="px-6 py-4 text-center font-medium">
                                    <span className={clsx(
                                        "inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold",
                                        team.position <= 4 ? "bg-emerald-100 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30" :
                                            team.position >= 18 ? "bg-red-100 text-red-600 border border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30" :
                                                "text-slate-500 dark:text-emerald-600/70"
                                    )}>
                                        {team.position}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-bold text-lg transition-colors
                                    text-emerald-900 group-hover:text-emerald-700
                                    dark:text-white dark:group-hover:text-emerald-300">
                                    <Link href={`/teams/${team.teamId}`} className="hover:underline decoration-emerald-500/50">
                                        {team.teamName}
                                    </Link>
                                </td>
                                <td className="px-4 py-4 text-center text-slate-600 dark:text-emerald-600">{team.played}</td>
                                <td className="px-4 py-4 text-center text-emerald-600 dark:text-emerald-500/80">{team.won}</td>
                                <td className="px-4 py-4 text-center text-slate-500 dark:text-emerald-500/80">{team.drawn}</td>
                                <td className="px-4 py-4 text-center text-red-500 dark:text-emerald-500/80">{team.lost}</td>
                                <td className="px-4 py-4 text-center text-slate-600 dark:text-emerald-600 hidden md:table-cell">{team.goalsFor}</td>
                                <td className="px-4 py-4 text-center text-slate-600 dark:text-emerald-600 hidden md:table-cell">{team.goalsAgainst}</td>
                                <td className="px-4 py-4 text-center font-bold hidden md:table-cell
                                    text-emerald-600 dark:text-emerald-400">
                                    {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                                </td>
                                <td className="px-6 py-4 text-center font-black text-xl shadow-none dark:shadow-emerald-500/20
                                    text-emerald-900 dark:text-white">
                                    {team.points}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
