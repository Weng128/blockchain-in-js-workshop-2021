import UTXO from './UTXO.js'
import block from "./Block.js";

class UTXOPool {
  constructor() {
    this.miner=''
    this.utxos={}
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
    return this.utxos[this.miner]
  }

  // 处理交易函数
  handleTransaction(trx) {
    if(this.isValidTransaction(trx)) {//验证交易是否有效
      //查看交易池中是否存在收款人哈希，不存在则创建
      if (!this.utxos.hasOwnProperty(trx.to)) {
        this.utxos[trx.to] = new UTXO(trx.to, 0)
      }
      //对utxos进行更新
      this.utxos[trx.from].amount -= (trx.amount+trx.fee)
      //汇总有相同收款人哈希的utxo
      for (let utxosKey in this.utxos) {
        if (trx.to === utxosKey) {
          this.utxos[trx.to].amount += trx.amount
        }
      }
      this.utxos[this.miner].amount+=trx.fee
    }
  }

  // 验证交易合法性
  /**
   * 验证余额
   * 返回 bool
   */
  isValidTransaction(trx) {
    if(this.utxos[trx.from].amount-trx.amount-trx.fee>0)
      return true
    return false
  }
}

export default UTXOPool
