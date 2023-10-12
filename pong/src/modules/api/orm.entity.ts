// user.entity.ts

import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';


/*  
    - Users -
    id_token: string;
    nick : string;
    using_2fa : boolean
    avatar : wtf?? que campo puede ser??
*/

@Entity({name : 'Users'})
export class User {
  @PrimaryColumn({ type: 'integer'})
  Id_Token: number;

  @Column({ type: 'varchar', length : 20, nullable : false})
  Nick: string;

  @Column({ type: 'text', nullable : false})
  Avatar: string;

  @Column({ type: 'boolean', nullable : false})
  Using_F2A: boolean;
}

/*
    Column	Type
    id_sub	integer Auto Increment [nextval('"Subscriptions_id_sub_seq"')]	
    id_channel	integer	
    id_user	integer	
    status	integer	
    timeout	integer	

*/

@Entity({name : 'Subscriptions'})
export class Subscription {
  @PrimaryColumn({ type: 'integer'})
  id_sub: number;

  @Column({ type: 'integer'})
  id_channel: number;

  @Column({ type: 'integer'})
  id_user: number;

  @Column({ type: 'integer'})
  status: number;

  @Column({ type: 'integer'})
  timeout: number;
}


/*
    - Messages -
    Column	Type
    id_mes	integer Auto Increment [nextval('"Messages_id_mes_seq"')]	
    Sender	integer	
    Target	integer	
    text	text	
    date	date

*/

@Entity({name : 'Messages'})
export class Message {
  @PrimaryGeneratedColumn({ type: 'integer'})
  id_mes: number;

  @Column({ type: 'integer'})
  Sender: number;

  @Column({ type: 'integer'})
  Target: number;

  @Column({ type: 'integer'})
  text: number;

  @Column({ type: 'integer'})
  date: Date;
}


/*
  Column	Type
  id_match	integer Auto Increment [nextval('"Match_id_match_seq"')]	
  user1	integer	
  user2	integer	
  result	character(5)	
  mode	integer	
  date	date
*/


@Entity({name :'Match'})
export class Match {
  @PrimaryGeneratedColumn({ type: 'integer'})
  id_match: number;

  @Column({ type: 'varchar', nullable : false})
  user1: string;

  @Column({ type: 'varchar'})
  user2: string;

  @Column({ type: 'varchar', length : 20 })
  result: string;

  @Column({ type: 'integer'})
  mode: number;

  @Column({ type: 'date'})
  date: string;
}

/*
  - Friends -
  Column	Type
  User1	integer	
  User2	integer	
  Accepted	boolean [false]
*/

@Entity({name :'Friends'})
export class Friend {
  @PrimaryColumn({ type: 'integer', nullable : false})
  User1: number;

  @Column({ type: 'integer', nullable : false})
  User2: number;

  @Column({ type: 'boolean', nullable : false})
  Accepted: boolean;
}

/*
  - Channel -
  Column	Type
  id_channel	integer Auto Increment [nextval('channel_id_channel_seq')]	
  name	character(20)	
  password	character(20)	
  owner	integer	
  type	integer
*/

@Entity({name : 'Channel'})
export class Channels {
  @PrimaryGeneratedColumn({ type: 'integer'})
  id_channel: number;

  @Column({ type: 'varchar', length : 20, nullable: false })
  name: string;

  @Column({ type: 'varchar', length : 20, nullable: false })
  password: string;
  
  @Column({ type: 'integer', nullable : false})
  owner: number;
  
  @Column({ type: 'integer', nullable : false})
  type: number;
}