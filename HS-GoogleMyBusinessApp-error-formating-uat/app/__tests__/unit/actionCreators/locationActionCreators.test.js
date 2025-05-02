import mockAxios from 'axios';
import * as networkActions from '@/actions/networkActions';
import * as storageActions from '@/actions/storageActions';
import * as reducerTypes from '@/constants/reducerTypes';
import { getLocations, setLocations } from '@/actionCreators/locationActionCreators';

const dispatch = jest.fn();
const requestSpy = jest.spyOn(networkActions, 'request');
const successSpy = jest.spyOn(networkActions, 'success');
const depositSpy = jest.spyOn(storageActions, 'deposit');
const errorSpy = jest.spyOn(networkActions, 'error');

beforeEach(() => {
  dispatch.mockClear();
  requestSpy.mockClear();
  successSpy.mockClear();
  depositSpy.mockClear();
  errorSpy.mockClear();
});

describe('locationActionCreators', () => {

  describe('`getLocations` action creator', () => {
    const mockDeposit = {
      accounts: [ '12345', '67890' ]
    };

    const getState = jest.fn(() => ({
      [reducerTypes.REQUEST_LOCATIONS_GET]: {},
      [reducerTypes.DATA_LOCATIONS]: { data: {} },
      [reducerTypes.DATA_JWT]: { data: [{ jwt: '12345', pid: '98765' }] },
      [reducerTypes.DATA_PID]: { data: '98765' }
    }));

    mockAxios.get.mockImplementationOnce(() => 
      Promise.resolve({
        data: mockDeposit
      })
    );

    it('Request successful, dispatches `request` `success` and `deposit` actions', () => {
      return (getLocations()(dispatch, getState)).then((response = {}) => {
        expect(dispatch).toHaveBeenCalledWith(requestSpy(reducerTypes.REQUEST_LOCATIONS_GET));
        expect(dispatch).toHaveBeenCalledWith(successSpy(reducerTypes.REQUEST_LOCATIONS_GET));
        expect(dispatch).toHaveBeenCalledWith(depositSpy(reducerTypes.DATA_LOCATIONS, mockDeposit.accounts));
        expect(dispatch).toHaveBeenCalledTimes(3);
      });
    });

    it('Request failure, dispatches `request` and `error` actions', () => {
      return (getLocations()(dispatch, getState)).catch((errors) => {
        expect(dispatch).toHaveBeenCalledWith(requestSpy(reducerTypes.REQUEST_LOCATIONS_GET));
        expect(dispatch).toHaveBeenCalledWith(errorSpy(reducerTypes.REQUEST_LOCATIONS_GET, errors));
        expect(dispatch).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('`setLocations` action creator', () => {
    const mockAccounts = [ '12345', '67890' ];

    const mockReturn = {
      accounts: mockAccounts
    };

    const getState = jest.fn(() => ({
      [reducerTypes.REQUEST_LOCATIONS_SET]: {},
      [reducerTypes.DATA_LOCATIONS]: { data: {} },
      [reducerTypes.DATA_JWT]: { data: [{ jwt: '12345', pid: '98765' }] },
      [reducerTypes.DATA_PID]: { data: '98765' }
    }));

    mockAxios.put.mockImplementationOnce(() => 
      Promise.resolve({
        data: mockReturn
      })
    );

    it('Request successful, dispatches `request` `success` and `deposit` actions', () => {
      return (setLocations(mockAccounts)(dispatch, getState)).then((response = {}) => {
        expect(dispatch).toHaveBeenCalledWith(requestSpy(reducerTypes.REQUEST_LOCATIONS_SET));
        expect(dispatch).toHaveBeenCalledWith(successSpy(reducerTypes.REQUEST_LOCATIONS_SET));
        expect(dispatch).toHaveBeenCalledWith(depositSpy(reducerTypes.DATA_LOCATIONS, mockAccounts));
        expect(dispatch).toHaveBeenCalledTimes(3);
      });
    });

    it('Request failure, dispatches `request` and `error` actions', () => {
      return (setLocations(mockAccounts)(dispatch, getState)).catch((errors) => {
        expect(dispatch).toHaveBeenCalledWith(requestSpy(reducerTypes.REQUEST_LOCATIONS_SET));
        expect(dispatch).toHaveBeenCalledWith(errorSpy(reducerTypes.REQUEST_LOCATIONS_SET, errors));
        expect(dispatch).toHaveBeenCalledTimes(2);
      });
    });
  });

});
