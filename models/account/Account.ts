import { sha256 } from 'js-sha256';
import { nanoid } from 'nanoid';
import User, { newUser } from '../user/User';

export class Account {
  user: User;
  private secret: string;

  constructor(userName: string) {
    this.user = newUser(nanoid(), userName);
    this.secret = nanoid().concat(nanoid());
  }

  getHash() {
    return sha256.hmac(this.secret, this.user.id);
  }

  toMagicToken() {
    const json = JSON.stringify({
      user: this.user,
      secret: this.secret,
    });

    return Buffer.from(json).toString('base64');
  }

  toCensorMagicToken() {
    const token = this.toMagicToken();

    return `${token.slice(0, 8)}...${token.slice(token.length - 4)}`;
  }

  static fromMagicToken(token: string): Account | undefined {
    try {
      const buff = Buffer.from(token, 'base64');
      const json = buff.toString('utf-8');

      const data = JSON.parse(json);

      const account = new Account(data.user.name);

      account.user.id = data.user.id;
      account.secret = data.secret;

      return account;
    } catch (err) {
      console.log('Account.ts: fromMagicToken: error:', (err as Error).message);

      return undefined;
    }
  }
}
