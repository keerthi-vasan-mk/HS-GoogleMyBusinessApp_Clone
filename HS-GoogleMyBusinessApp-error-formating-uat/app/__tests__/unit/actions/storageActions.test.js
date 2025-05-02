import { deposit, withdraw } from '@/actions/storageActions';
import { DEPOSIT, WITHDRAW } from '@/constants/actionTypes';


describe('storageActions', () => {

  it('`deposit` action returns an object', () => {
    const mockReducer = 'test';
    const data = [{ id: 1, name: 'test' }];
    const expectedValue = {
      name: mockReducer,
      type: DEPOSIT,
      data,
    };

    expect(deposit(mockReducer, data)).toEqual(expectedValue);
  });

  it('`withdraw` action returns an object', () => {
    const mockReducer = 'test';
    const expectedValue = {
      name: mockReducer,
      type: WITHDRAW,
    };

    expect(withdraw(mockReducer)).toEqual(expectedValue);
  });

});
