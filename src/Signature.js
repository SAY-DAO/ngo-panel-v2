/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
const SIGNING_DOMAIN_NAME = 'SAY-DAO';
const SIGNING_DOMAIN_VERSION = '1';

class Signature {
  constructor({ contract, signer }) {
    this.contract = contract;
    this.signer = signer;
  }

  // design your domain separator
  async designDomain() {
    if (this.domainData != null) {
      return this.domainData;
    }

    this.domainData = {
      name: SIGNING_DOMAIN_NAME,
      version: SIGNING_DOMAIN_VERSION,
      verifyingContract: this.contract.address,
      chainId: 4,
    };
    return this.domainData;
  }

  async signTransaction(signerAddress, needId, needTitle, needImage, userId, impacts) {
    const domain = await this.designDomain();
    // define your data types
    const types = {
      Voucher: [
        { name: 'needId', type: 'uint256' },
        { name: 'userId', type: 'uint256' },
        { name: 'needTitle', type: 'string' },
        { name: 'needImage', type: 'string' },
        { name: 'signerAddress', type: 'address' },
        { name: 'content', type: 'string' },
      ],
    };
    console.log('hi');
    // the data to sign / signature will be added to our solidity struct
    const voucher = {
      needId: parseInt(needId),
      userId: parseInt(userId),
      needTitle,
      needImage,
      signerAddress,
      content: `Your ${impacts} impacts will be ready for a firend to mint!`,
    };
    console.log('bye');

    const signature = await this.signer._signTypedData(domain, types, voucher);

    return {
      ...voucher,
      signature,
    };
  }
}

export default Signature;
