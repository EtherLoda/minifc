
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import {
    MatchEntity,
    MatchEventEntity,
    MatchTeamStatsEntity,
    MatchStatus,
    MatchTacticsEntity,
    PlayerEntity,
    TeamEntity,
    MatchType,
    GAME_SETTINGS,
} from '@goalxi/database';
import { MatchEngine, MatchEvent } from '../engine/match.engine';
import { Team } from '../engine/classes/Team';
import { PlayerAdapter } from '../utils/player-adapter';
import { TacticalInstruction, TacticalPlayer } from '../engine/types/simulation.types';

interface SimulationJobData {
    matchId: string;
    homeForfeit?: boolean;
    awayForfeit?: boolean;
}

@Processor('match-simulation')
@Injectable()
export class SimulationProcessor extends WorkerHost {
    private readonly logger = new Logger(SimulationProcessor.name);

    constructor(
        @InjectRepository(MatchEntity)
        private readonly matchRepository: Repository<MatchEntity>,
        @InjectRepository(MatchEventEntity)
        private readonly eventRepository: Repository<MatchEventEntity>,
        @InjectRepository(MatchTeamStatsEntity)
        private readonly statsRepository: Repository<MatchTeamStatsEntity>,
        @InjectRepository(MatchTacticsEntity)
        private readonly tacticsRepository: Repository<MatchTacticsEntity>,
        @InjectRepository(PlayerEntity)
        private readonly playerRepository: Repository<PlayerEntity>,
        @InjectRepository(TeamEntity)
        private readonly teamRepository: Repository<TeamEntity>,
        private readonly dataSource: DataSource,
    ) {
        super();
    }

    async process(job: Job<SimulationJobData>): Promise<void> {
        const { matchId, homeForfeit, awayForfeit } = job.data;

        this.logger.log(`[Simulator] Processing match ${matchId}`);

        const match = await this.matchRepository.findOne({
            where: { id: matchId },
            relations: ['homeTeam', 'awayTeam'],
        });

        if (!match) {
            this.logger.error(`Match ${matchId} not found`);
            return;
        }

        if (match.status === MatchStatus.COMPLETED) {
            this.logger.warn(`Match ${matchId} already completed.`);
            return;
        }

        if (homeForfeit || awayForfeit) {
            await this.handleForfeit(match, !!homeForfeit, !!awayForfeit);
        } else {
            await this.runSimulation(match);
        }

        this.logger.log(`[Simulator] Completed match ${matchId}`);
    }

    private findPositionInLineup(lineup: Record<string, string>, playerId: string): string | undefined {
        return Object.keys(lineup).find(key => lineup[key] === playerId);
    }

    private async runSimulation(match: MatchEntity): Promise<void> {
        // 1. Fetch Tactics
        const homeTactics = await this.tacticsRepository.findOne({ where: { matchId: match.id, teamId: match.homeTeamId } });
        const awayTactics = await this.tacticsRepository.findOne({ where: { matchId: match.id, teamId: match.awayTeamId } });

        if (!homeTactics || !awayTactics) {
            throw new Error(`Tactics missing for match ${match.id}`);
        }

        // 2. Fetch Players
        const homeStarterIds = Object.values(homeTactics.lineup).filter(id => typeof id === 'string');
        const awayStarterIds = Object.values(awayTactics.lineup).filter(id => typeof id === 'string');
        const homeSubIds = (homeTactics.substitutions || []).map(s => s.in);
        const awaySubIds = (awayTactics.substitutions || []).map(s => s.in);

        const allPlayerIds = [...homeStarterIds, ...awayStarterIds, ...homeSubIds, ...awaySubIds];
        const allPlayers = await this.playerRepository.find({
            where: { id: In(allPlayerIds) }
        });

        // 3. Map Instructions
        const mapInstructions = (tactics: MatchTacticsEntity): TacticalInstruction[] => {
            const results: TacticalInstruction[] = [];
            if (tactics.substitutions) {
                for (const s of tactics.substitutions) {
                    results.push({
                        minute: s.minute,
                        type: 'swap',
                        playerId: s.out,
                        newPlayerId: s.in,
                        newPosition: this.findPositionInLineup(tactics.lineup, s.out) || 'CF'
                    });
                }
            }
            return results;
        };

        const homeInstructions = mapInstructions(homeTactics);
        const awayInstructions = mapInstructions(awayTactics);

        // 4. Setup Engine Teams
        const homeTacticalPlayers: TacticalPlayer[] = homeStarterIds.map(pid => ({
            player: PlayerAdapter.toSimulationPlayer(allPlayers.find(p => p.id === pid)!),
            positionKey: this.findPositionInLineup(homeTactics.lineup, pid)!
        }));

        const awayTacticalPlayers: TacticalPlayer[] = awayStarterIds.map(pid => ({
            player: PlayerAdapter.toSimulationPlayer(allPlayers.find(p => p.id === pid)!),
            positionKey: this.findPositionInLineup(awayTactics.lineup, pid)!
        }));

        const subMap = new Map<string, TacticalPlayer>();
        for (const pid of [...homeSubIds, ...awaySubIds]) {
            const entity = allPlayers.find(p => p.id === pid);
            if (entity) {
                subMap.set(pid, {
                    player: PlayerAdapter.toSimulationPlayer(entity),
                    positionKey: 'SUB'
                });
            }
        }

        const tA = new Team(match.homeTeam!.name, homeTacticalPlayers);
        const tB = new Team(match.awayTeam!.name, awayTacticalPlayers);

        const engine = new MatchEngine(tA, tB, homeInstructions, awayInstructions, subMap);

        // 5. Run Match
        this.logger.log(`[Simulator] Starting engine for ${match.id}`);
        let events = engine.simulateMatch();

        // Generate injury time (1-5 minutes for each half)
        const firstHalfInjuryTime = Math.floor(Math.random() * (GAME_SETTINGS.MATCH_INJURY_TIME_MAX - GAME_SETTINGS.MATCH_INJURY_TIME_MIN + 1)) + GAME_SETTINGS.MATCH_INJURY_TIME_MIN;
        const secondHalfInjuryTime = Math.floor(Math.random() * (GAME_SETTINGS.MATCH_INJURY_TIME_MAX - GAME_SETTINGS.MATCH_INJURY_TIME_MIN + 1)) + GAME_SETTINGS.MATCH_INJURY_TIME_MIN;
        
        match.firstHalfInjuryTime = firstHalfInjuryTime;
        match.secondHalfInjuryTime = secondHalfInjuryTime;

        // Check if extra time is needed (match requires winner and is tied)
        if (match.requiresWinner && engine.homeScore === engine.awayScore) {
            this.logger.log(`[Simulator] Match ${match.id} is tied and requires winner - playing extra time`);
            events = engine.simulateExtraTime();
            match.hasExtraTime = true;
            
            // Generate ET injury time
            const etFirstHalfInjury = Math.floor(Math.random() * 3) + 1; // 1-3 minutes for ET
            const etSecondHalfInjury = Math.floor(Math.random() * 3) + 1;
            match.extraTimeFirstHalfInjury = etFirstHalfInjury;
            match.extraTimeSecondHalfInjury = etSecondHalfInjury;
            
            // If still tied after extra time, penalty shootout
            if (engine.homeScore === engine.awayScore) {
                this.logger.log(`[Simulator] Still tied after extra time - penalty shootout`);
                events = engine.simulatePenaltyShootout();
                match.hasPenaltyShootout = true;
            }
        }

        // 6. Calculate Event Scheduled Times
        const matchStartTime = new Date(match.scheduledAt);
        this.logger.log(
            `[Simulator] Calculating event scheduled times (match starts: ${matchStartTime.toISOString()})\n` +
            `  1st half injury time: ${firstHalfInjuryTime}min, 2nd half injury time: ${secondHalfInjuryTime}min`
        );
        
        for (const event of events) {
            const eventMinute = event.minute;
            let realWorldOffset = 0; // Will calculate based on event minute
            
            /**
             * Timeline breakdown:
             * Minutes 0-45: First half (0 to 45 real-world minutes)
             * Minute 45+: Halftime break starts (15 minutes real-world break)
             * Minutes 46-90: Second half starts at T+60 (T+45 + 15min break)
             * Minute 90+: Match ends when last event scheduled
             * 
             * Note: Game minutes don't include halftime break
             * Event at minute 46 happens at real-world T+60 (45min play + 15min break)
             */
            
            if (eventMinute <= 45) {
                // First half: direct mapping
                realWorldOffset = eventMinute * 60 * 1000;
            }
            else if (eventMinute <= 90) {
                // Second half: add 15-minute halftime break
                realWorldOffset = eventMinute * 60 * 1000 + (GAME_SETTINGS.MATCH_HALF_TIME_MINUTES * 60 * 1000);
            }
            else if (match.hasExtraTime) {
                // Extra time: add main halftime + regular time + ET break
                if (eventMinute <= 105) {
                    // ET first half (91-105)
                    // Real time = 90min play + 15min HT + (eventMinute - 90) ET minutes
                    realWorldOffset = (90 * 60 * 1000) + (GAME_SETTINGS.MATCH_HALF_TIME_MINUTES * 60 * 1000) + ((eventMinute - 90) * 60 * 1000);
                } else {
                    // ET second half (106-120)
                    // Real time = 90min play + 15min HT + 15min ET1st + 5min ET break + (eventMinute - 105) ET2nd minutes
                    realWorldOffset = (90 * 60 * 1000) + 
                                    (GAME_SETTINGS.MATCH_HALF_TIME_MINUTES * 60 * 1000) + 
                                    (15 * 60 * 1000) + // ET first half
                                    (GAME_SETTINGS.MATCH_EXTRA_TIME_BREAK_MINUTES * 60 * 1000) + 
                                    ((eventMinute - 105) * 60 * 1000);
                }
            }
            
            event.eventScheduledTime = new Date(matchStartTime.getTime() + realWorldOffset);
        }
        
        const lastEvent = events[events.length - 1];
        const totalDuration = lastEvent?.eventScheduledTime 
            ? (lastEvent.eventScheduledTime.getTime() - matchStartTime.getTime()) / (60 * 1000)
            : 0;
        
        this.logger.log(
            `[Simulator] Events will be revealed from ${matchStartTime.toISOString()} ` +
            `to ${lastEvent?.eventScheduledTime?.toISOString() || 'unknown'}\n` +
            `  Total events: ${events.length}, Real-world duration: ~${Math.ceil(totalDuration)} minutes`
        );

        // 7. Persist Results
        await this.dataSource.transaction(async (manager) => {
            // Update Match
            match.homeScore = engine.homeScore;
            match.awayScore = engine.awayScore;
            match.status = MatchStatus.IN_PROGRESS; // Keep as IN_PROGRESS, scheduler will complete it
            match.simulationCompletedAt = new Date(); // Internal timestamp
            match.actualEndTime = lastEvent?.eventScheduledTime || new Date(); // When match will actually end
            await manager.save(match);

            // Save Events with scheduled times
            const eventEntities = events.map(e => manager.create(MatchEventEntity, {
                matchId: match.id,
                minute: e.minute,
                second: 0,
                type: this.mapEventType(e.type),
                typeName: e.type,
                teamId: e.teamName === match.homeTeam!.name ? match.homeTeamId : (e.teamName === match.awayTeam!.name ? match.awayTeamId : null),
                playerId: e.playerId || null,
                data: e.data || null,
                eventScheduledTime: e.eventScheduledTime, // Real-world time when event should be revealed
                isRevealed: false, // Will be revealed when current time reaches eventScheduledTime
            }));
            await manager.save(eventEntities);

            // Save Stats (Simplified)
            const calculateStats = (teamName: string, teamId: string) => {
                const goals = events.filter(e => e.type === 'goal' && e.teamName === teamName).length;
                const misses = events.filter(e => e.type === 'miss' && e.teamName === teamName).length;
                const savesByOpponent = events.filter(e => e.type === 'save' && e.teamName !== teamName).length;

                return manager.create(MatchTeamStatsEntity, {
                    matchId: match.id,
                    teamId,
                    possessionPercentage: 50,
                    shots: goals + misses + savesByOpponent,
                    shotsOnTarget: goals + savesByOpponent,
                    corners: events.filter(e => e.type === 'corner' && e.teamName === teamName).length,
                    fouls: events.filter(e => e.type === 'foul' && e.teamName === teamName).length,
                    yellowCards: events.filter(e => e.type === 'yellow_card' && e.teamName === teamName).length,
                    redCards: events.filter(e => e.type === 'red_card' && e.teamName === teamName).length,
                });
            };

            await manager.save([
                calculateStats(match.homeTeam!.name, match.homeTeamId),
                calculateStats(match.awayTeam!.name, match.awayTeamId)
            ]);
        });
    }

    private mapEventType(type: string): number {
        const mapping: Record<string, number> = {
            'kickoff': 0, 'goal': 1, 'shot': 3, 'miss': 3, 'save': 4,
            'yellow_card': 5, 'red_card': 6, 'substitution': 7, 'foul': 9,
            'offside': 10, 'corner': 11, 'penalty_goal': 12, 'penalty_miss': 13,
            'full_time': 14, 'turnover': 20, 'snapshot': 21
        };
        return mapping[type] || 99;
    }

    private async handleForfeit(match: MatchEntity, homeForfeit: boolean, awayForfeit: boolean) {
        match.homeScore = homeForfeit ? 0 : 3;
        match.awayScore = awayForfeit ? 0 : 3;
        match.status = MatchStatus.COMPLETED;
        match.simulationCompletedAt = new Date();
        await this.matchRepository.save(match);
    }

    @OnWorkerEvent('completed')
    onCompleted(job: Job) {
        this.logger.log(`Job ${job.id} completed successfully`);
    }

    @OnWorkerEvent('failed')
    onFailed(job: Job, error: Error) {
        this.logger.error(`Job ${job.id} failed: ${error.message}`);
    }
}
