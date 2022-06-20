import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteBlock, resetBlockList, toggleBase } from '../../../store/actions';

import Button from '../../ui/button';

const BlockList = () => {
  const dispatch = useDispatch();
  const blocks = useSelector((state) => state.metamask.blocks);
  const base = useSelector((state) => state.metamask.base);
  const baseText = base === 10 ? 'hex' : 'decimals';

  return (
    <div className="block-list">
      <div className="block-list__buttons">
        <Button
          type="secondary"
          rounded
          onClick={() => dispatch(resetBlockList())}
        >
          Reset Block List
        </Button>
        <Button type="secondary"
        rounded
        onClick={() => dispatch(toggleBase())}
        >
          {`Display numbers as ${baseText}`}
        </Button>
      </div>
      {blocks.map((block, i) => {
        return (
          <div  key={`block-${i}`}>
            <div className="block-list__block">
              <span>{`Number: ${block.number}`}</span>
              <span>{`Hash: ${block.hash}`}</span>
              <span>{`Nonce: ${block.nonce}`}</span>
              <span>{`GasLimit: ${block.gasLimit}`}</span>
              <span>{`GasUsed: ${block.gasUsed}`}</span>
              <span>{`Transaction Count: ${block.transactions.length}`}</span>

              <Button
                type="secondary"
                rounded
                onClick={() => dispatch(deleteBlock(block.number))}
              >
                Delete Block
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BlockList;
