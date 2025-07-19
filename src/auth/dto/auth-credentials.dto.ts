import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;
    @IsString()
    @MinLength(8)
    @MaxLength(50)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
         { message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long.' })
    password: string;
}