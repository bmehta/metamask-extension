import React from 'react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  renderWithProvider,
  createSwapsMockStore,
  setBackgroundConnection,
} from '../../../../test/jest';
import SmartTransactionStatus from '.';

const middleware = [thunk];
setBackgroundConnection({
  stopPollingForQuotes: jest.fn(),
});

describe('SmartTransactionStatus', () => {
  it('renders the component with initial props', () => {
    const store = configureMockStore(middleware)(createSwapsMockStore());
    const { getByText } = renderWithProvider(<SmartTransactionStatus />, store);
    expect(getByText('Transaction is pending')).toBeInTheDocument();
    expect(
      getByText('Your transaction is being processed.'),
    ).toBeInTheDocument();
    expect(getByText('Cancel')).toBeInTheDocument();
  });
});
