import { Controller, Get, Query } from "@nestjs/common";
import { PrecosService } from "./precos.service";
import { Public } from '../auth/decorators/public.decorator';
import { IListar } from "./@types/IListar";

@Controller("precos")
export class PrecosController {
  constructor(private service: PrecosService) {}

  @Get()
  @Public()
  findAll(@Query() filtros: IListar) {
    return this.service.findAll(filtros);
  }
}
