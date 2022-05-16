import Client from '../database';
import bcrypt from 'bcrypt';

const saltRounds = Number(process.env.SALT_ROUNDS);
const pepper = process.env.BCRYPT_PASSWORD;

export type User = {
  id?: number;
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
  user_role?: number;
};

export class UserModel {
  async index(): Promise<User[] | Error> {
    try {
      //@ts-ignore
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users';

      const result = await conn.query(sql);
      conn.release();

      return result.rows;
    } catch (err) {
      return new Error(`unable get users: ${err}`);
    }
  }

  async show(id: number): Promise<User> {
    try {
      const sql = 'SELECT * FROM users WHERE id=($1)';
      //@ts-ignoreX$
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`unable show user ${id}: ${err}`);
    }
  }

  async checkUserByEmail(email: string): Promise<User> {
    try {
      const sql = 'SELECT * FROM users WHERE email=($1)';
      //@ts-ignoreX$
      const conn = await Client.connect();

      const result = await conn.query(sql, [email]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      console.error(err);
      throw new Error(`unable show user ${email}: ${err}`);
    }
  }

  async create(u: User): Promise<User | string> {
    try {
      // @ts-ignore
      const conn = await Client.connect();
      const sql =
        'INSERT INTO users (email, first_name, last_name, password, user_role) VALUES($1, $2, $3, $4, $5) RETURNING *';

      const hash = bcrypt.hashSync(u.password + pepper, saltRounds);

      const result = await conn.query(sql, [
        u.email,
        u.first_name,
        u.last_name,
        hash,
        u.user_role,
      ]);
      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      return `unable to create user (${u.email}): ${err}`;
    }
  }

  async update(u: User): Promise<User> {
    try {
      // @ts-ignore
      const conn = await Client.connect();
      const sql =
        'UPDATE users SET first_name=($1), last_name=($2), email=($3), password=($4) WHERE id=($5) RETURNING *';
      const hash = bcrypt.hashSync(u.password + pepper, saltRounds);

      const result = await conn.query(sql, [
        u.first_name,
        u.last_name,
        u.email,
        hash,
        u.id,
      ]);
      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(`unable to update user with id: (${u.id}): ${err}`);
    }
  }

  async patchUserRoleByEmail(
    user_email: string,
    user_role: number
  ): Promise<User> {
    try {
      // @ts-ignore
      const conn = await Client.connect();
      const sql =
        'UPDATE users SET user_role=($1) WHERE email=($2) RETURNING *';

      const result = await conn.query(sql, [user_role, user_email]);
      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(
        `unable to patch user role with email: (${user_email}): ${err}`
      );
    }
  }

  async delete(id: number): Promise<User | string> {
    try {
      const conn = await Client.connect();
      const sql = 'DELETE FROM users WHERE id=($1) RETURNING *';

      const result = await conn.query(sql, [id]);
      if (result.rows.length == 0) {
        return `Could not delete user with id: ${id}. Does not exist.`;
      }
      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      console.error(err);
      throw new Error(`unable to delete user with id: (${id}): ${err}`);
    }
  }

  async authenticate(email: string, password: string): Promise<User> {
    const conn = await Client.connect();
    const sql = 'SELECT * FROM users WHERE email=($1)';

    const result = await conn.query(sql, [email]);

    if (result.rows.length != 0) {
      const user = result.rows[0];

      if (bcrypt.compareSync(password + pepper, user.password)) {
        return user;
      }
    }

    const emptyReturnUser: User = {
      email: '',
      password: '',
    };

    return emptyReturnUser;
  }
}
