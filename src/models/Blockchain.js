import UTXOPool from './UTXOPool.js'
import UTXO from "./UTXO.js";
import Block from "./Block.js";
class Blockchain {
  // 1. 完成构造函数及其参数
  /* 构造函数需要包含
      - 名字
      - 创世区块
      - 存储区块的映射
  */
  constructor(name) {
    this.name=name
  }
  genesis=null
  blocks={}

  // 2. 定义 longestChain 函数
  /*
    返回当前链中最长的区块信息列表
  */
  longestChain() {

    let high=null
    // 找出高度最高的区块
    for (let hash in this.blocks) {
      if(!high){
        high=this.blocks[hash]
      }
      if(high.height<this.blocks[hash].height){
        high=this.blocks[hash]
      }
    }
    let longest=[]
    //由最高的区块反推到创世区块
    longest.push(high)
    //找到创世区块就停止循环
    while (high.prevHash!==this.genesis.hash) {
      //循环blocks找到前一个区块
      for (let hash in this.blocks) {
        let block = this.blocks[hash]
        if (high.prevHash === block.hash) {
          //找到的区块放入最长链表中
          longest.push(block)
          high = block
        }
      }
    }
    //逆转数组元素
    return longest.reverse()

  }

  // 判断当前区块链是否包含
  containsBlock(block) {
    // 添加判断方法
    for (let hash in this.blocks) {
      if (block.hash===hash){
        return true
      }
    }
    return false
  }

  // 获得区块高度最高的区块
  maxHeightBlock() {
    let high=null
    // 找出高度最高的区块
    for (let hash in this.blocks) {
      if(!high){
        high=this.blocks[hash]
      }
      if(high.height<this.blocks[hash].height){
        high=this.blocks[hash]
      }
    }
    return high
  }

  // 添加区块
  /*

  */
  _addBlock(block) {
    if (!block.isValid()) return
    if (this.containsBlock(block)) return
    // 添加 UTXO 快照与更新的相关逻辑
    this.blocks[block.hash]=block
    //获取父区块的UTXO结果
    if (block.prevHash!==this.genesis.hash) {
      block.utxoPool.utxos[block.coinbaseBeneficiary] = this.blocks[block.prevHash].utxoPool.clone()
    }
    block.utxoPool.miner=block.coinbaseBeneficiary
    let utxo = new UTXO(block.coinbaseBeneficiary, 12.5)
    block.utxoPool.addUTXO(utxo)
  }
}

export default Blockchain
