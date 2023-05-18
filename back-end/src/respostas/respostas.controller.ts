import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RespostasService } from './respostas.service';
import { CreateRespostaDto } from './dto/create-resposta.dto';
import { Resposta } from './entities/resposta.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SkipAuth } from '../auth/public-key.decorator';

@Controller('respostas')
export class RespostasController {
  constructor(private readonly service: RespostasService) {}

  @Post()
  async create(@Body() data: CreateRespostaDto) {
    return this.service.create(data);
  }

  @Get(':id')
  async findRespostaById(@Param('id') id: number) {
    return this.service.findRespostaById(id);
  }

  @Get()
  async findAll(): Promise<Resposta[]> {
    return this.service.findAll();
  }

  @Get('/pergunta/:id_pergunta')
  async findAllByPergunta(@Param('id_pergunta') id_pergunta: number): Promise<Resposta[]> {
    return this.service.findAllByPergunta(id_pergunta);
  }
  
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(+id);
  } 

  @SkipAuth()
  @Patch(':id')
  updateMaisVotosResposta(@Param('id') id: string) {
    return this.service.updateMaisVotosResposta(+id);
  } 

  @SkipAuth()
  @Patch('/menos/:id')
  updateMenosVotosResposta(@Param('id') id: string) {
    return this.service.updateMenosVotosResposta(+id);
  }
}
