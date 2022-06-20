import { strict as assert } from 'assert';
import sinon from 'sinon';
import BlocksController from './blocks';

function getMockBlockTracker() {
  return {
    addListener: sinon.stub().callsArgWithAsync(1, '0xa'),
    removeListener: sinon.spy(),
    testProperty: 'fakeBlockTracker',
    getCurrentBlock: () => '0xa',
  };
}

describe('BlocksController', function () {
  describe('constructor', function () {
    let blockTracker;
    it('should properly initialize', function () {
      blockTracker = getMockBlockTracker();
      const blocksController = new BlocksController({
        blockTracker,
      });
      assert.deepEqual(blocksController.store.getState().blocks, []);
    });
  });

  describe('updateBlockList',  function () {
    let blockTracker;
    it('should update the block list',  async function () {
      blockTracker = getMockBlockTracker();

      const blocksController = new BlocksController({
        blockTracker,
      });

      blocksController.query = {
        getBlockByNumber: function() {
          return { number: '0xA' }
        }
      };

      await blocksController.updateBlockList('0xA');

      const {blocks} = blocksController.store.getState();
      assert.deepEqual(blocks.length, 2);
    })
  });

  describe('toggleBase', function() {
    let blockTracker;
    it('should toggle block number from hex to decimal', function() {
      blockTracker = getMockBlockTracker();
      const blocksData = [ { number: '0xA', nonce: '0xB', gasLimit: '0xC', gasUsed: '0xD' } ]

      const blocksController = new BlocksController({
        blockTracker,
      });

      blocksController.store.updateState({ blocks: blocksData });
      blocksController.toggleBase();

      const {blocks} = blocksController.store.getState();
      assert.deepEqual(blocks[0].number, '10');
    })
  });

  describe('deleteBlock', function() {
    let blockTracker;
    it('should delete the block', function() {
      blockTracker = getMockBlockTracker();
      const blocksData = [ { number: '0xA', nonce: '0xB', gasLimit: '0xC', gasUsed: '0xD' } ]

      const blocksController = new BlocksController({
        blockTracker,
      });

      blocksController.store.updateState({ blocks: blocksData });
      blocksController.deleteBlock('0xA');

      const {blocks} = blocksController.store.getState();
      assert.deepEqual(blocksController.store.getState().blocks, []);
    })
  });

  describe('convertBase', function() {
    let blockTracker;
    it('should convert the base', function() {
      blockTracker = getMockBlockTracker();
      const blocksData = [ { number: '0xA', nonce: '0xB', gasLimit: '0xC', gasUsed: '0xD' } ]

      const blocksController = new BlocksController({
        blockTracker,
      });

      const converted = blocksController.convertBase('0xA', 16, 10);

      assert.deepEqual(converted, '10');
    })
  });

  afterEach(function () {
    sinon.restore();
  });
});
