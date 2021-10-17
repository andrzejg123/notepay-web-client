import { BaseEntity } from './base-entity';

export class User extends BaseEntity {
  username: string;
  password: string;
  name: string;
  surname: string;
  createDate:	Date;
  description:	string;
}
