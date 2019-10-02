import {User} from '../models';

export default (member: User) => !member.deleted;
