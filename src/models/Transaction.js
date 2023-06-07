import sha256 from 'crypto-js/sha256.js'

class Transaction {
  constructor(from,to,amount) {
    this.from=from
    this.to=to
    this.amount=amount
    this._setHash()
  }

  // 更新交易 hash
  _setHash() {
    this.hash=this._calculateHash()
  }

  // 计算交易 hash 的摘要函数
  _calculateHash() {
    return sha256(this.from+this.to+this.amount).toString()
  }
}

export default Transaction
