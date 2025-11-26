import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import {
    Column,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('player')
export class PlayerEntity extends AbstractEntity {
    constructor(data?: Partial<PlayerEntity>) {
        super();
        Object.assign(this, data);
    }

    @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_player_id' })
    id!: Uuid;

    @Column()
    name!: string;

    @Column()
    position!: string;

    // Appearance properties
    @Column({ name: 'skin_tone' })
    skinTone!: string;

    @Column({ name: 'hair_color' })
    hairColor!: string;

    @Column({ name: 'hair_style' })
    hairStyle!: string;

    @Column({ name: 'body_type' })
    bodyType!: string;

    @Column({ name: 'jersey_color_primary' })
    jerseyColorPrimary!: string;

    @Column({ name: 'jersey_color_secondary' })
    jerseyColorSecondary!: string;

    @Column()
    accessory!: string;

    // Stats
    @Column({ type: 'int' })
    speed!: number;

    @Column({ type: 'int' })
    power!: number;

    @Column({ type: 'int' })
    skill!: number;

    @DeleteDateColumn({
        name: 'deleted_at',
        type: 'timestamptz',
        default: null,
    })
    deletedAt: Date;
}
