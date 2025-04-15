import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('GlobalConfig')
export class GlobalConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', {
    name: 'configKey',
    nullable: false,
    unique: true,
  })
  configKey: string;

  @Column('character varying', {
    name: 'configValue',
    nullable: false,
  })
  configValue: string;

  @Exclude()
  @CreateDateColumn({
    type: 'timestamptz',
    name: 'createdAt',
    default: () => `now()`,
    onUpdate: `now()`,
  })
  createdAt: Date;
}

export default GlobalConfig;