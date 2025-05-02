import networkReducer from '@/reducers/networkReducer';
import { REQUEST, SUCCESS, ERROR } from '@/constants/actionTypes';
import { request, success, error } from '@/actions/networkActions';

describe('networkReducer', () => {

  it('receives undefined', () => {
    const expectedValue = {
      isFetching: false,
      isSuccessful: false,
      error: null,
      requestType: null,
    };
    expect(networkReducer(undefined, {})).toEqual(expectedValue);
  });

  it('receives a `REQUEST` action.type', () => {
    const reducer = 'test';
    const expectedValue = {
      isFetching: true,
      isSuccessful: false,
      error: null,
      requestType: REQUEST,
    };

    expect(networkReducer({}, request(reducer))).toEqual(expectedValue);
  });

  it('receives a `SUCCESS` action.type', () => {
    const reducer = 'test';
    const expectedValue = {
      isFetching: false,
      isSuccessful: true,
      error: null,
      requestType: SUCCESS,
    };

    expect(networkReducer({}, success(reducer))).toEqual(expectedValue);
  });

  it('receives a `ERROR` action.type', () => {
    const reducer = 'test';
    const mockError = { response: { status: 403, data: { message: [ 'Error' ] } } };
    const expectedValue = {
      isFetching: false,
      isSuccessful: false,
      error: mockError,
      requestType: ERROR,
    };

    expect(networkReducer({}, error(reducer, mockError))).toEqual(expectedValue);
  });

});
