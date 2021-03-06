import { CreateApostilleService }  from '../src/service/CreateApostilleService';
import { SHA256 } from '../src/hash/hash';
import { NetworkType, Listener } from 'symbol-sdk';
import * as fs from 'fs';
import { filter } from 'rxjs/operators';

console.log(__dirname);
const file = fs.readFileSync(`${__dirname}/file/90681.jpeg`);
const fileData = file.toString('hex');
const filename = `${Math.random().toString(32).substring(2)}.png`;
const ownerPrivateKey = '42955088A7D670F512A020AEEC6C42DDE2B2CE3969C154DD4CD8EA573A2BEA56';
const sha256 = new SHA256();
const url = 'https://sym-test.opening-line.jp:3001';
const networkGenerationHash = 'ACECD90E7B248E012803228ADB4424F0D966D24149B72E58987D2BF2F2AF03C4';
const metadata = { filename: '90681.jpeg', description: 'daoka icon' };

const apostilleService = CreateApostilleService.create(fileData, filename,
                                                       sha256, ownerPrivateKey,
                                                       url, NetworkType.TEST_NET,
                                                       networkGenerationHash, 1000);

apostilleService.addAnnouncePublicSinkTransaction();
apostilleService.addAssignOwnershipTransaction();
apostilleService.addMetadataTransactions(metadata);

const listener = new Listener(url);
listener.open().then(() => {
  listener.status(apostilleService.getOwnerAddress())
  .pipe(filter(error => error.hash === apostilleService.getTxHash()))
  .subscribe((err) => {
    console.error(err);
    listener.close();
  });
  listener.confirmed(apostilleService.getOwnerAddress())
  .pipe(
    filter(transaction => (transaction.transactionInfo !== undefined &&
    transaction.transactionInfo.hash === apostilleService.getTxHash())),
  ).subscribe((_) => {
    console.log('transaction confirmed');
    listener.close();
  });
  apostilleService.announceAsync().then(
    (x) => { console.log(x); },
    (err) => { console.error(err); },
  );
});
