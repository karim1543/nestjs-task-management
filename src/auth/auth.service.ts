import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayLoad } from './jwt-payload.interface';
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository:UsersRepository,
        private jwtService:JwtService
    ){}
    async createUser(authCredentialsDto:AuthCredentialsDto):Promise<void>{
        const {username,password}=authCredentialsDto;

        const salt=await bcrypt.genSalt();
        const hashedPassword= await bcrypt.hash(password,salt)

        const user=this.usersRepository.create({
            username,
            password:hashedPassword,
        })
        try{

            await this.usersRepository.save(user);
        }
        catch(error){
            if(error.code === '23505') { // Unique constraint violation
                throw new Error('Username already exists');
            } else {
                throw new Error('Error creating user');
        }
    }
}

async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const {username, password} = authCredentialsDto;
    const user = await this.usersRepository.findOne({ where: { username } });
    if(user &&(await bcrypt.compare(password,user.password))){
        const payload:JwtPayLoad={username};
        const accessToken:string= await this.jwtService.sign(payload);


        return {accessToken};
    }else{
        throw new UnauthorizedException('Invalid credentials');
    }
}
}
