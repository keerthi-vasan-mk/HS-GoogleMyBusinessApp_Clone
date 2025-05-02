import { request, success, error } from '@/actions/networkActions';
import { REQUEST, SUCCESS, ERROR } from '@/constants/actionTypes';


describe('networkActions', () => {

  it('`request` action returns an object', () => {
    const reducer = 'test';
    const expectedValue = {
      name: reducer,
      type: REQUEST,
    };

    expect(request(reducer)).toEqual(expectedValue);
  });

  it('`success` action returns an object', () => {
    const reducer = 'test';
    const expectedValue = {
      name: reducer,
      type: SUCCESS,
    };

    expect(success(reducer)).toEqual(expectedValue);
  });

  it('`error` action returns an object', () => {
    const reducer = 'test';
    const mockError = { response: { status: 403, data: { message: 'Error' } } };
    const expectedValue = {
      name: reducer,
      type: ERROR,
      payload: mockError,
      error: true,
    };

    expect(error(reducer, mockError)).toEqual(expectedValue);
  });

});
