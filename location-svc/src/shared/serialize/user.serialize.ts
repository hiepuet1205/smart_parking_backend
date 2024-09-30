import { BaseSerialize } from './base.serialize';

export class UserSerialize extends BaseSerialize {
  DEFAULT = ['id', 'name', 'email', 'avatar', 'roles', 'status'];
}
