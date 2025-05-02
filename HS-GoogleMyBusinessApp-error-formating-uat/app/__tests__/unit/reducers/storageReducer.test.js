import storageReducer from '@/reducers/storageReducer';
import { deposit, withdraw } from '@/actions/storageActions';

describe('storageReducer', () => {

  it('receives undefined', () => {
    const expectedValue = {
      data: [],
    };

    expect(storageReducer(undefined, {})).toEqual(expectedValue);
  });

  it('receives a `DEPOSIT` action.type', () => {
    const mockReducer = 'test';
    const data = { id: 1, name: 'test' };
    const expectedValue = { data };

    expect(storageReducer({}, deposit(mockReducer, data))).toEqual(expectedValue);
  });

  it('receives a `WITHDRAW` action.type', () => {
    const mockReducer = 'test';
    const expectedValue = {
      data: [],
    };

    expect(storageReducer({}, withdraw(mockReducer))).toEqual(expectedValue);
  });

});
