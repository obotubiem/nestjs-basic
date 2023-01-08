import { PrismaService } from 'src/database/prisma.service';

export class BaseRepository {
  protected pk = 'id';
  protected TypeOfPk: string;
  protected TypeWhereUnique: object;

  protected readonly prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }

  protected getWhereOrPk(whereOrPk: object | string) {
    let where: object;
    if (typeof whereOrPk === 'string') {
      where = this.getWhereByPkOptions(whereOrPk);
    } else {
      where = whereOrPk;
    }

    return where;
  }

  protected getWhereByPkOptions(value: typeof this.TypeOfPk) {
    return {
      [this.pk]: value,
    };
  }
}
