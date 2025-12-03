import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { MatchEntity } from './match.entity';
import { TeamEntity } from './team.entity';
import { PlayerEntity } from './player.entity';

// Event types are now stored as integers with corresponding names
// This allows for unlimited event types without schema changes

@Entity('match_event')
@Index(['matchId', 'minute', 'second'])
export class MatchEventEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'match_id', type: 'uuid' })
    matchId!: string;

    @ManyToOne(() => MatchEntity)
    @JoinColumn({ name: 'match_id' })
    match?: MatchEntity;

    @Column({ type: 'int' })
    minute!: number;

    @Column({ type: 'int', default: 0 })
    second!: number;

    @Column({ type: 'int' })
    type!: number;

    @Column({ type: 'varchar', length: 100, name: 'type_name' })
    typeName!: string;

    @Column({ name: 'team_id', type: 'uuid', nullable: true })
    teamId?: string;

    @ManyToOne(() => TeamEntity)
    @JoinColumn({ name: 'team_id' })
    team?: TeamEntity;

    @Column({ name: 'player_id', type: 'uuid', nullable: true })
    playerId?: string;

    @ManyToOne(() => PlayerEntity)
    @JoinColumn({ name: 'player_id' })
    player?: PlayerEntity;

    @Column({ name: 'related_player_id', type: 'uuid', nullable: true })
    relatedPlayerId?: string;

    @ManyToOne(() => PlayerEntity)
    @JoinColumn({ name: 'related_player_id' })
    relatedPlayer?: PlayerEntity;

    @Column({ type: 'jsonb', nullable: true })
    data?: Record<string, any>;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    constructor(partial?: Partial<MatchEventEntity>) {
        super();
        Object.assign(this, partial);
    }
}
