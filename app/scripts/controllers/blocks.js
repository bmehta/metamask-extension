import EthQuery from 'eth-query';
import pify from 'pify';
import { ObservableStore } from '@metamask/obs-store';
import BigNumber from 'bignumber.js';

export default class BlockController {
  constructor(opts = {}) {
    const { blockTracker, provider } = opts;
    this.query = pify(new EthQuery(provider));


    const initState = { blocks: [], base: 16 };
    this.store = new ObservableStore(initState);

    blockTracker.removeListener('latest', async (blockNumber) => {
      await this.updateBlockList(blockNumber);
    });
    blockTracker.addListener('latest', async (blockNumber) => {
      await this.updateBlockList(blockNumber);
    });
  };

  updateBlockList = async (blockNumber) => {
    try {
      const { blocks }= this.store.getState();
      const block = await this.query.getBlockByNumber(blockNumber, false);

      const { base } = this.store.getState();
      if (base === 10) {
        block.number = this.convertBase(block.number, 16, base);
        block.nonce = this.convertBase(block.nonce, 16, base);
        block.gasLimit = this.convertBase(block.gasLimit, 16, base);
        block.gasUsed = this.convertBase(block.gasUsed, 16, base);
      }

      blocks.push(block);
      this.store.updateState({
        blocks,
      });
    } catch (error) {
        console.error(`Error updating blocks: ${JSON.stringify(error)}`);
    }
  };

  resetBlockList = () => {
    this.store.updateState({
      blocks: [],
    });
  };

  convertBase = (number, sourceBase, targetBase) => {
    const newNumber =  new BigNumber(number, sourceBase).toString(targetBase);
    return targetBase === 16 ? '0x' + newNumber : newNumber;
  };

  toggleBase = () => {
    try {
      const {blocks, base} = this.store.getState();
      const baseToConvert = base === 16 ? 10 : 16;

      blocks.forEach((block) => {
        block.number = this.convertBase(block.number, base, baseToConvert);
        block.nonce = this.convertBase(block.nonce, base, baseToConvert);
        block.gasLimit = this.convertBase(block.gasLimit, base, baseToConvert);
        block.gasUsed = this.convertBase(block.gasUsed, base, baseToConvert);
      });

      this.store.updateState({blocks, base: baseToConvert});
    } catch(error) {
      console.error(`Error toggling base: ${JSON.stringify(error)}`);
    }
  };

  deleteBlock = (blockNumber) => {
    try {
      let { blocks } = this.store.getState();
      blocks = blocks.filter(block => block.number !== blockNumber);
      this.store.updateState({ blocks });
    } catch (error) {
      console.error(`Error deleting block ${blockNumber}: ${JSON.stringify(error)}`);
    }
  }
}

