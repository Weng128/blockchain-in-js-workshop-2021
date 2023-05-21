import sha256 from "crypto-js/sha256.js";

export default class UTXO {
  constructor(pubKey,amount) {
    this.pubKey = pubKey
    this.amount = amount
  }
}
