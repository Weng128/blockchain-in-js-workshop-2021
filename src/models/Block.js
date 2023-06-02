
import blockchain from "./Blockchain.js";
import sha256 from "crypto-js/sha256.js";
//import {parseBytes} from "elliptic/lib/elliptic/utils.js";
import pkg from 'elliptic/lib/elliptic/utils.js';
import UTXOPool from "./UTXOPool.js";
import MerkleTree from "./MerkleTree.js";
import UTXO from "./UTXO.js";
import merkleTree from "./MerkleTree.js";
const {parseBytes} = pkg;
export const DIFFICULTY = 1

class Block {
  // 1. 完成构造函数及其参数
  /* 构造函数需要包含
  所属的区块链
  前一个区块的哈希值
  区块高度
  自身的哈希值

  */

  constructor(blockchain, prevHash, height, data,miner) {
    // 设置所属的区块链
    this.blockchain = blockchain;
    // 设置前一个区块的哈希值
    this.prevHash = prevHash;
    // 设置区块高度，即在区块链中的位置
    this.height = height;
    // 设置区块存储交易的属性
    this.data=[data]
    this.merkleTree = new MerkleTree(this.data);
    // 根据区块内容计算哈希值，使用区块链名称、前一个区块的哈希值、区块高度和数据字符串作为输入
    this.hash = sha256(
        this.blockchain.name +
        this.prevHash +
        this.height +
        this.merkleTree.getRoot()
    ).toString();
    this.coinbaseBeneficiary=miner
    this.utxoPool = new UTXOPool()

  }

  isValid() {
    let num=0
    for (let i=0;i<this.hash.length;i++) {
      if (this.hash[i]==='0'){
        num++
      }else {
        break
      }
    }
    if (num<DIFFICULTY){
      return false
    }else {
      return true
    }
  }

  setNonce(nonce) {
    this.hash=sha256(nonce+this.blockchain.name +
        this.prevHash +
        this.height +
        this.merkleTree.getRoot()
    ).toString();
  }



  // 根据交易变化更新区块 hash
  _setHash() {
    this.hash=sha256(
        this.blockchain.name +
        this.prevHash +
        this.height +
        this.merkleTree.getRoot()
    ).toString()
  }
  // 汇总计算交易的 Hash 值
  /**
   * 默克尔树实现
   */
  combinedTransactionsHash() {
    this.merkleTree.buildTree(this.data)
    return this.merkleTree.getRoot()
  }

  // 添加交易到区块
  /**
   *
   * 需包含 UTXOPool 的更新与 hash 的更新
   */
  addTransaction(trx) {
    //更新UTXOPool
    this.utxoPool.handleTransaction(trx)
    //将交易打包到区块中
    this.data.push(trx.hash)
    this.combinedTransactionsHash()
    //更新区块hash
    this._setHash()
  }

}

export default Block

