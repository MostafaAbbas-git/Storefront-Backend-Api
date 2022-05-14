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
};

export class UserStore {
  async index(): Promise<User[]> {
    try {
      //@ts-ignore
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users';

      const result = await conn.query(sql);
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`unable get users: ${err}`);
    }
  }

  async show(id: string): Promise<User> {
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

  async create(u: User): Promise<User | unknown> {
    try {
      // @ts-ignore
      const conn = await Client.connect();
      const sql =
        'INSERT INTO users (email, first_name, last_name, password) VALUES($1, $2, $3, $4) RETURNING *';

      const hash = bcrypt.hashSync(u.password + pepper, saltRounds);

      const result = await conn.query(sql, [
        u.email,
        u.first_name,
        u.last_name,
        hash,
      ]);
      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(`unable create user (${u.email}): ${err}`);
    }
  }
  async update(updatedObj: User, currentEmail: string): Promise<User> {
    if (updatedObj.email != currentEmail) {
      // check if the new email already assigned to another user.
      try {
        // @ts-ignore
        const conn = await Client.connect();
        const sql = 'SELECT * FROM users WHERE email=($1)';

        const result = await conn.query(sql, [updatedObj.email]);
        conn.release();

        if (result.rows.length != 0) {
          // Email already assigned to another user
          throw new Error(
            `Unable to update user data. Email: ${updatedObj.email} already assigned to another`
          );
        }
      } catch (error) {
        throw new Error(`Unable to query on new email: ${error}`);
      }
    }

    try {
      // @ts-ignore
      const conn = await Client.connect();
      // const sql = `UPDATE users SET (email, first_name, last_name, password) = ($1, $2, $3, $4) WHERE email = ${currentEmail} RETURNING *`;
      const sql =
        'UPDATE users SET first_name=($1), last_name=($2), email=($3), password=($4) WHERE email=($5) RETURNING *';
      const hash = bcrypt.hashSync(updatedObj.password + pepper, saltRounds);

      const result = await conn.query(sql, [
        updatedObj.first_name,
        updatedObj.last_name,
        updatedObj.email,
        hash,
        currentEmail,
      ]);
      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(`unable to update user (${currentEmail}): ${err}`);
    }
  }

  async delete(id: string): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql = 'DELETE FROM users WHERE id=($1)';

      const result = await conn.query(sql, [id]);

      const product = result.rows[0];

      conn.release();

      return product;
    } catch (err) {
      throw new Error(`unable delete user (${id}): ${err}`);
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
