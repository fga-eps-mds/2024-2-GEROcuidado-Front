import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Ordering } from '../shared/decorators/ordenate.decorator';
import { Pagination } from '../shared/decorators/paginate.decorator';
import { getImageUri } from '../shared/helpers/buffer-to-image';
import {
  getWhereClauseIN,
  getWhereClauseNumber,
  getWhereClauseString,
} from '../shared/helpers/sql-query-helper';
import { ResponsePaginate } from '../shared/interfaces/response-paginate.interface';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { ResetarSenhaDto } from './dto/resetar-senha.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { sendResetEmail } from './email.senha';
import { Usuario } from './entities/usuario.entity';
import { IUsuarioFilter } from './interfaces/usuario-filter.interface';

@Injectable()
export class UsuarioService {
  constructor(

    @InjectRepository(Usuario) // Correção: Injeção de repositório
    private readonly _repository: Repository<Usuario>,
    private readonly _configService: ConfigService,
  ) {
    console.log('Repository injetado:', !!this._repository);
  }

  async testDbConnection() {
    const usuarios = await this._repository.find();
    console.log(usuarios);
  }

  async enviarCodigoRedefinicao(email: string) {
    // Busca o usuário no banco de dados
    const usuario = await this._repository.findOne({ where: { email } });
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Gerar código e validade do token
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const expiraEm = new Date(Date.now() + 3600000); // 1 hora de validade

    // Atualiza os dados do código no banco
    usuario.codigoReset = codigo;
    usuario.CodigoResetExpiracao = expiraEm; // Mantendo o nome original da propriedade
    await this._repository.save(usuario);

    // Envia o e-mail
    await sendResetEmail(email, codigo);
    return { message: 'Código enviado para o e-mail' };

  }

  async resetarSenha({ email, codigo, novaSenha }: ResetarSenhaDto) {
    // Busca o usuário no banco de dados
    const usuario = await this._repository.findOne({ where: { email } });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Valida o código e a validade
    if (
      usuario.codigoReset !== codigo ||
      !usuario.CodigoResetExpiracao ||
      usuario.CodigoResetExpiracao < new Date()
    ) {
      throw new NotFoundException('Código inválido ou expirado');
    }
    // Atualiza a senha e cria o hash
    const senhaHash = await bcrypt.hash(novaSenha, 10);
    usuario.senha = senhaHash;

    // Remove o código de redefinição
    usuario.codigoReset = undefined;
    usuario.CodigoResetExpiracao = undefined;

    await this._repository.save(usuario);


    return { message: 'Senha redefinida com sucesso' };
  }

  async create(body: CreateUsuarioDto): Promise<Usuario> {
    const usuario = new Usuario(body);

    await this.checkUserExists(usuario.email);
    usuario.senha = await this.hashPassword(usuario.senha);

    return this._repository.save(usuario);
  }

  async hashPassword(senha: string): Promise<string> {
    const salt = this._configService.get('HASH_SALT');
    return bcrypt.hash(senha, Number(salt));
  }

  private async checkUserExists(email: string) {
    const userFound = await this.findByEmail(email);

    if (userFound) {
      throw new BadRequestException('Este email já está cadastrado!');
    }
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this._repository
      .createQueryBuilder('usuario')
      .where('usuario.email = :email', { email })
      .addSelect('usuario.senha')
      .getOne();
  }

  async findOne(id: number, transformImage = false) {
    const user = await this._repository.findOneOrFail({ where: { id } });
    if (transformImage && user.foto) {
      user.foto = getImageUri(user.foto) as unknown as Buffer;
    }
    return user;
  }

  async update(id: number, body: UpdateUsuarioDto): Promise<Usuario> {
    const found = await this.findOne(id);
    const merged = Object.assign(found, body);

    const updated = await this._repository.save(merged);

    if (updated.foto) {
      updated.foto = getImageUri(updated.foto) as unknown as Buffer & string;
    }

    return updated;
  }

  async remove(id: number) {
    const found = await this.findOne(id);
    return this._repository.remove(found);
  }

  async findAll(
    filter: IUsuarioFilter,
    ordering: Ordering,
    paging: Pagination,
  ): Promise<ResponsePaginate<Usuario>> {
    const limit = paging.limit;
    const offset = paging.offset;
    const sort = ordering.column;
    const order = ordering.dir.toUpperCase() as 'ASC' | 'DESC';
    const where = this.buildWhereClause(filter);

    const [result, total] = await this._repository
      .createQueryBuilder('usuario')
      .where(`${where}`)
      .limit(limit)
      .offset(offset)
      .orderBy(sort, order)
      .getManyAndCount();

    return {
      data: result,
      count: +total,
      pageSize: +total,
    };
  }

  async allUpdatedUsuariosSince(targetTimestamp: Date): Promise<Usuario[]> {
    return this._repository.createQueryBuilder('usuario')
      .where('usuario.updated_at >= :targetTimestamp AND usuario.created_at < :targetTimestamp', { targetTimestamp })
      .getMany();
  }

  async allCreatedUsuariosSince(targetTimestamp: Date): Promise<Usuario[]> {
    return this._repository.createQueryBuilder('usuario')
      .where('usuario.created_at >= :targetTimestamp', { targetTimestamp })
      .getMany();
  }

  private buildWhereClause(filter: IUsuarioFilter): string {
    let whereClause = '1 = 1 ';

    whereClause += getWhereClauseString(filter.nome, 'nome');
    whereClause += getWhereClauseString(filter.email, 'email');
    whereClause += getWhereClauseNumber(filter.id, 'id');

    return whereClause;
  }

  async findAllToPublicacao(ids: number[]): Promise<Usuario[]> {
    const where = `1 = 1 ${getWhereClauseIN(ids, 'usuario.id')}`;

    const usuarios = await this._repository
      .createQueryBuilder('usuario')
      .where(`${where}`)
      .getMany();

    return usuarios.map((usuario) => {
      if (usuario.foto) {
        usuario.foto = getImageUri(usuario.foto) as unknown as Buffer;
      }

      return usuario;
    });
  }
}
