import * as dotenv from 'dotenv';
import { enivroment } from '../../config/server/enviroment';

dotenv.config({ path: enivroment });

export const jwtConstants = {
  secret: process.env.JWT_SECRET,
};
