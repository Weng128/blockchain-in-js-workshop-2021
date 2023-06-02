import UTXO from './UTXO.js'
import block from "./Block.js";

class UTXOPool {
  constructor(utxos = {}) {
    this.utxos=utxos
  }

  // 添加交易函数
  /**
   * 将交易的信息更新至 UTXOPool 中
   */
  addUTXO(utxo) {
    if (Object.keys(this.utxos).length === 0){
      this.utxos[utxo.pubKey]=utxo
    }else {
      for (let utxosKey in this.utxos) {
        if (utxo.pubKey === utxosKey){
          this.utxos[utxo.pubKey].amount += utxo.amount
        }
      }
    }
  }

  // 将当前 UXTO 的副本克隆
  clone() {
    return this.utxos['04fc5783257a53bcfcc6e1ea3c5059393df15ef4a286f7ac4c771ab8caa67dd1391822f9f8c3ce74d7f7d2cb2055232c6382ccef5c324c957ef5c052fd57679e86']
  }

  // 处理交易函数
  handleTransaction(trx) {
    if(this.isValidTransaction(trx.from,trx.amount)) {//验证交易是否有效
      //查看交易池中是否存在收款人哈希，不存在则创建
      if (!this.utxos.hasOwnProperty(trx.to)) {
        this.utxos[trx.to] = new UTXO(trx.to, 0)
      }
      //对utxos进行更新
      this.utxos[trx.from].amount -= trx.amount
      //汇总有相同收款人哈希的utxo
      for (let utxosKey in this.utxos) {
        if (trx.to === utxosKey) {
          this.utxos[trx.to].amount += trx.amount
        }
      }
    }
  }

  // 验证交易合法性
  /**
   * 验证余额
   * 返回 bool
   */
  isValidTransaction(from,amount) {
    if(this.utxos[from].amount-amount>0)
      return true
    return false
  }
}

export default UTXOPool
