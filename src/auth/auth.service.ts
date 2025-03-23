import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const usuario = await this.usuariosService.findByEmail(email);

    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, usuario.password);  

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const { password: _, ...result } = usuario;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    console.log(user);

    const payload = {
      id: user.id,
      email: user.email,
      academiaId: user.academiaId,
      clienteId: user.clienteId,
      isAdmin: !!(await this.usuariosService.isAdmin(user.id)),
    };

    return {
      id: user.id,
      email: user.email,
      nome: user.nome,
      sobrenome: user.sobrenome,
      academiaId: user.academiaId,
      clienteId: user.clienteId,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
