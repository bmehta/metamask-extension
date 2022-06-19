import EthQuery from 'eth-query';
import pify from 'pify';
import { ObservableStore } from '@metamask/obs-store';

export default class BlockController {
  constructor(opts = {}) {
    const { blockTracker, provider } = opts;
    this.query = pify(new EthQuery(provider));


    const initState = { blocks: [] };
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

    blocks.push(block);
    this.store.updateState({
      blocks,
    });
    } catch (e) {
      console.error(`Error updating blocks: ${JSON.stringify(e)}`);
    }
  };

  resetBlockList = () => {
    this.store.updateState({
      blocks: [],
    });
  };
}
