import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository , UpdateResult, DeleteResult} from 'typeorm';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

    public async create(login:string): Promise<User> {
        const newUser:User = await this.userRepository.create({nickname:login});
        this.userRepository.save(newUser);
        return newUser;
    }

    public async findOne(login:string): Promise<User|null> {
        return this.userRepository.findOneBy({ nickname:login });
    }
}