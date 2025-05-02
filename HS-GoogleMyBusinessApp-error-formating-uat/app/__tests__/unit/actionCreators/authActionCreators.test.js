import mockAxios from 'axios';
import * as networkActions from '@/actions/networkActions';
import * as storageActions from '@/actions/storageActions';
import * as reducerTypes from '@/constants/reducerTypes';
import { login, getUserTokenStatus, authorizeTokens, getGoogleUsername,
         revokeAuthorization, storeGoogleName } from '@/actionCreators/authActionCreators';

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

describe('authActionCreators', () => {

  describe('`login` action creator', () => {
    const mockPayload = {
      uid: '12345',
      pid: '12345',
      ts: '123456789',
      token: '12345abcde'
    };

    const mockDeposit = [{
      jwt: mockPayload.token,
      pid: mockPayload.pid
    }];

    const getState = jest.fn(() => ({
      [reducerTypes.REQUEST_LOGIN]: {},
      [reducerTypes.DATA_JWT]: { data: [] }
    }));

    mockAxios.post.mockImplementationOnce(() => 
      Promise.resolve({
        data: { token: '12345abcde' }
      })
    );

    it('Request successful, dispatches `request` `success` and `deposit` actions', () => {
      return (login(mockPayload)(dispatch, getState)).then((response = {}) => {
        expect(dispatch).toHaveBeenCalledWith(requestSpy(reducerTypes.REQUEST_LOGIN));
        expect(dispatch).toHaveBeenCalledWith(successSpy(reducerTypes.REQUEST_LOGIN));
        expect(dispatch).toHaveBeenCalledWith(depositSpy(reducerTypes.DATA_JWT, mockDeposit));
        expect(dispatch).toHaveBeenCalledTimes(3);
      });
    });

    it('Request failure, dispatches `request` and `error` actions', () => {
      return (login(mockPayload)(dispatch, getState)).catch((errors) => {
        expect(dispatch).toHaveBeenCalledWith(requestSpy(reducerTypes.REQUEST_LOGIN));
        expect(dispatch).toHaveBeenCalledWith(errorSpy(reducerTypes.REQUEST_LOGIN, errors));
        expect(dispatch).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('`getUserTokenStatus` action creator', () => {
    const mockPayload = {
      idToken: '123456789'
    };

    const getState = jest.fn(() => ({
      [reducerTypes.REQUEST_GOOGLE_ID_TOKEN]: {},
      [reducerTypes.DATA_JWT]: { data: [{ jwt: '12345', pid: '98765' }] },
      [reducerTypes.DATA_PID]: { data: '98765' }
    }));

    mockAxios.post.mockImplementationOnce(() =>
      Promise.resolve({
        data: { tokenFound: true }
      })
    );

    it('Request successful, dispatches `request` and `success` actions', () => {
      return (getUserTokenStatus(mockPayload)(dispatch, getState)).then((response = {}) => {
        expect(dispatch).toHaveBeenCalledWith(requestSpy(reducerTypes.REQUEST_GOOGLE_ID_TOKEN));
        expect(dispatch).toHaveBeenCalledWith(successSpy(reducerTypes.REQUEST_GOOGLE_ID_TOKEN));
        expect(dispatch).toHaveBeenCalledTimes(2);
      });
    });

    it('Request failure, dispatches `request` and `error` actions', () => {
      return (getUserTokenStatus(mockPayload)(dispatch, getState)).catch((error) => {
        expect(dispatch).toHaveBeenCalledWith(requestSpy(reducerTypes.REQUEST_GOOGLE_ID_TOKEN));
        expect(dispatch).toHaveBeenCalledWith(errorSpy(reducerTypes.REQUEST_GOOGLE_ID_TOKEN, error));
        expect(dispatch).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('`authorizeTokens` action creator', () => {
    const mockCode = '123456789';
    const mockIdToken = 'abcdefg';

    const getState = jest.fn(() => ({
      [reducerTypes.REQUEST_GOOGLE_CODE]: {},
      [reducerTypes.DATA_JWT]: { data: [{ jwt: '12345', pid: '98765' }] },
      [reducerTypes.DATA_PID]: { data: '98765' }
    }));

    mockAxios.post.mockImplementationOnce(() =>
      Promise.resolve({
        data: { refresh_token: '12345' }
      })
    );

    it('Request successful, dispatches `request` and `success` actions', () => {
      return (authorizeTokens(mockCode, mockIdToken)(dispatch, getState)).then((response = {}) => {
        expect(dispatch).toHaveBeenCalledWith(requestSpy(reducerTypes.REQUEST_GOOGLE_CODE));
        expect(dispatch).toHaveBeenCalledWith(successSpy(reducerTypes.REQUEST_GOOGLE_CODE));
        expect(dispatch).toHaveBeenCalledTimes(2);
      });
    });

    it('Request failure, dispatches `request` and `error` actions', () => {
      return (authorizeTokens(mockCode, mockIdToken)(dispatch, getState)).catch((error) => {
        expect(dispatch).toHaveBeenCalledWith(requestSpy(reducerTypes.REQUEST_GOOGLE_CODE));
        expect(dispatch).toHaveBeenCalledWith(errorSpy(reducerTypes.REQUEST_GOOGLE_CODE, error));
        expect(dispatch).toHaveBeenCalledTimes(2);
      });
    }); 
  });

  describe('`getGoogleUsername` action creator', () => {
    const mockUsername = 'testing';

    const getState = jest.fn(() => ({
      [reducerTypes.REQUEST_GOOGLE_USERNAME]: {},
      [reducerTypes.DATA_USERNAME]: { data: {} },
      [reducerTypes.DATA_JWT]: { data: [{ jwt: '12345', pid: '98765' }] },
      [reducerTypes.DATA_PID]: { data: '98765' }
    }));

    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: { username: mockUsername }
      })
    );

    it('Request successful, dispatches `request` `success` and `deposit` actions', () => {
      return (getGoogleUsername()(dispatch, getState)).then((response = {}) => {
        expect(dispatch).toHaveBeenCalledWith(requestSpy(reducerTypes.REQUEST_GOOGLE_USERNAME));
        expect(dispatch).toHaveBeenCalledWith(successSpy(reducerTypes.REQUEST_GOOGLE_USERNAME));
        expect(dispatch).toHaveBeenCalledWith(depositSpy(reducerTypes.DATA_USERNAME, mockUsername));
        expect(dispatch).toHaveBeenCalledTimes(3);
      });
    });

    it('Request failure, dispatches `request` and `error` actions', () => {
      return (getGoogleUsername()(dispatch, getState)).catch((error) => {
        expect(dispatch).toHaveBeenCalledWith(requestSpy(reducerTypes.REQUEST_GOOGLE_USERNAME));
        expect(dispatch).toHaveBeenCalledWith(errorSpy(reducerTypes.REQUEST_GOOGLE_USERNAME, error));
        expect(dispatch).toHaveBeenCalledTimes(2);
      });
    }); 
  });

  describe('`revokeAuthorization` action creator', () => {
    const getState = jest.fn(() => ({
      [reducerTypes.REQUEST_GOOGLE_REVOKE]: {},
      [reducerTypes.DATA_JWT]: { data: [{ jwt: '12345', pid: '98765' }] },
      [reducerTypes.DATA_PID]: { data: '98765' }
    }));

    mockAxios.post.mockImplementationOnce(() =>
      Promise.resolve({
        data: {}
      })
    );

    it('Request successful, dispatches `request` and `success` actions', () => {
      return (revokeAuthorization()(dispatch, getState)).then((response = {}) => {
        expect(dispatch).toHaveBeenCalledWith(requestSpy(reducerTypes.REQUEST_GOOGLE_REVOKE));
        expect(dispatch).toHaveBeenCalledWith(successSpy(reducerTypes.REQUEST_GOOGLE_REVOKE));
        expect(dispatch).toHaveBeenCalledTimes(2);
      });
    });

    it('Request failure, dispatches `request` and `error` actions', () => {
      return (revokeAuthorization()(dispatch, getState)).catch((error) => {
        expect(dispatch).toHaveBeenCalledWith(requestSpy(reducerTypes.REQUEST_GOOGLE_REVOKE));
        expect(dispatch).toHaveBeenCalledWith(errorSpy(reducerTypes.REQUEST_GOOGLE_REVOKE, error));
        expect(dispatch).toHaveBeenCalledTimes(2);
      });
    }); 
  });

  describe('`storeGoogleName` action creator', () => {
    const mockUsername = 'test';

    const getState = jest.fn(() => ({
      [reducerTypes.DATA_USERNAME]: {},
      [reducerTypes.DATA_JWT]: { data: [{ jwt: '12345', pid: '98765' }] },
      [reducerTypes.DATA_PID]: { data: '98765' }
    }));

    it('Stores username in Redux', () => {
      storeGoogleName(mockUsername)(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith(depositSpy(reducerTypes.DATA_USERNAME, mockUsername));
    });
  });

});
