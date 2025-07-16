import { IsEmail, IsNotEmpty, IsString } from "class-validator"


export class LoginDto {
    @IsEmail({}, {message: 'O email precisa ser válido'})
    @IsNotEmpty()
    email: string

    @IsString({message: 'A senha precisa ser textual'})
    @IsNotEmpty()
    password: string
}