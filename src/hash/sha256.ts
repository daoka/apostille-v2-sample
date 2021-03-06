import { HashFunction } from './HashFunction';
import { createHash } from 'crypto';
import { HashingType } from './HashingType';

export class SHA256 extends HashFunction {

  constructor() {
    super(HashingType.sha256);
  }

  public hashing(data: string) {
    const hash = createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
  }
}
