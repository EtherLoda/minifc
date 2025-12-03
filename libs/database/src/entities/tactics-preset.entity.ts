import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { TeamEntity } from './team.entity';

@Entity('tactics_preset')
@Index(['teamId', 'isDefault'])
export class TacticsPresetEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'team_id', type: 'uuid' })
    teamId!: string;

    @ManyToOne(() => TeamEntity)
    @JoinColumn({ name: 'team_id' })
    team?: TeamEntity;

    @Column({ type: 'varchar', length: 100 })
    name!: string;

    @Column({ name: 'is_default', type: 'boolean', default: false })
    isDefault!: boolean;

    @Column({ type: 'varchar', length: 10 })
    formation!: string;

    @Column({ type: 'jsonb' })
    lineup!: Record<string, string>; // position -> playerId

    @Column({ type: 'jsonb', nullable: true })
    instructions?: Record<string, any>;

    @Column({ type: 'jsonb', nullable: true })
    substitutions?: Array<{ minute: number; out: string; in: string }>;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    constructor(partial?: Partial<TacticsPresetEntity>) {
        super();
        Object.assign(this, partial);
    }
}
