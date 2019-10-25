import { AccountMetadataTransaction, Deadline,
   PublicAccount, KeyGenerator, NetworkType, InnerTransaction } from 'nem2-sdk';

export class MetadataTransaction {

  private networkType: NetworkType;
  constructor(private key: string,
              private value: string,
              private ownerAccount: PublicAccount,
              private apostilleAccount: PublicAccount,
              networkType?: NetworkType) {
    if (!networkType) {
      this.networkType = NetworkType.MIJIN_TEST;
    } else {
      this.networkType = networkType;
    }
  }

  public toCreateMetadataTransaction() {
    const metadataTransaction = AccountMetadataTransaction.create(
      Deadline.create(),
      this.apostilleAccount.publicKey,
      KeyGenerator.generateUInt64Key(this.key),
      this.value.length,
      this.value,
      this.networkType,
    );

    const innerTransaction = metadataTransaction.toAggregate(this.ownerAccount);

    return innerTransaction;
  }

  public static objectToMetadataTransactions(obj: Object,
                                             ownerAccount: PublicAccount,
                                             apostilleAccount: PublicAccount,
                                             networkType?: NetworkType) {
    const metadataTransactions: InnerTransaction[] = [];
    Object.entries(obj).forEach(([key, value]) => {
      const metadataTxObj = new MetadataTransaction(key, value, ownerAccount,
                                                    apostilleAccount, networkType);
      metadataTransactions.push(metadataTxObj.toCreateMetadataTransaction());
    });

    return metadataTransactions;
  }
}