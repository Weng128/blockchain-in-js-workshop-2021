
import blockchain from "./Blockchain.js";
import sha256 from "crypto-js/sha256.js";
//import {parseBytes} from "elliptic/lib/elliptic/utils.js";
import pkg from 'elliptic/lib/elliptic/utils.js';
const {parseBytes} = pkg;
export const DIFFICULTY = 10

class Block {
  // 1. 完成构造函数及其参数
  /* 构造函数需要包含
  所属的区块链
  前一个区块的哈希值
  区块高度
  自身的哈希值

  */
  constructor(blockchain, prevHash, height, data) {
    // 设置所属的区块链
    this.blockchain = blockchain;
    // 设置前一个区块的哈希值
    this.prevHash = prevHash;
    // 设置区块高度，即在区块链中的位置
    this.height = height;
    // 设置区块数据，可以是任意类型的值
    this.data = data;
    // 根据区块内容计算哈希值，使用区块链名称、前一个区块的哈希值、区块高度和数据字符串作为输入
    this.hash = sha256(
        this.blockchain.name +
        this.prevHash +
        this.height + JSON.stringify(this.data)
    ).toString();
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
        JSON.stringify(this.data)
    ).toString();
  }



}

export default Block

