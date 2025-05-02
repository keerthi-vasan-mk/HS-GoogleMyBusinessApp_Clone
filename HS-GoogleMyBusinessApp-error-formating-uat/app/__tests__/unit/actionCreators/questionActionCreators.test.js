import mockAxios from 'axios';
import * as networkActions from '@/actions/networkActions';
import * as storageActions from '@/actions/storageActions';
import * as reducerTypes from '@/constants/reducerTypes';
import { getStartingQuestions, getQuestionPolling, getMoreQuestions,
         addOrEditResponse, deleteResponse } from '@/actionCreators/questionActionCreators';

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

describe('questionActionCreators', () => {

  describe('`getStartingQuestions` action creator', () => {
    const mockData = 'test';

    const getState = jest.fn(() => ({
      [reducerTypes.REQUEST_QUESTIONS_GET]: {},
      [reducerTypes.DATA_QUESTIONS]: { data: {} },
      [reducerTypes.DATA_JWT]: { data: [{ jwt: '12345', pid: '98765' }] },
      [reducerTypes.DATA_PID]: { data: '98765' }
    }));

    mockAxios.get.mockImplementationOnce(() => 
      Promise.resolve({
        data: mockData
      })
    );

    it('Request successful, dispatches `request` `success` and `deposit` actions', () => {
      return (getStartingQuestions()(dispatch, getState)).then((response = {}) => {
        expect(dispatch).toHaveBeenCalledWith(requestSpy(reducerTypes.REQUEST_QUESTIONS_GET));
        expect(dispatch).toHaveBeenCalledWith(successSpy(reducerTypes.REQUEST_QUESTIONS_GET));
        expect(dispatch).toHaveBeenCalledWith(depositSpy(reducerTypes.DATA_QUESTIONS, mockData));
        expect(dispatch).toHaveBeenCalledTimes(3);
      });
    });

    it('Request failure, dispatches `request` and `error` actions', () => {
      return (getStartingQuestions()(dispatch, getState)).catch((errors) => {
        expect(dispatch).toHaveBeenCalledWith(requestSpy(reducerTypes.REQUEST_QUESTIONS_GET));
        expect(dispatch).toHaveBeenCalledWith(errorSpy(reducerTypes.REQUEST_QUESTIONS_GET, errors));
        expect(dispatch).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('`getQuestionPolling` action creator', () => {
    const mockData = 'test';

    const getState = jest.fn(() => ({
      [reducerTypes.REQUEST_QUESTIONS_POLL]: {},
      [reducerTypes.DATA_JWT]: { data: [{ jwt: '12345', pid: '98765' }] },
      [reducerTypes.DATA_PID]: { data: '98765' }
    }));

    mockAxios.get.mockImplementationOnce(() => 
      Promise.resolve({
        data: mockData
      })
    );

    it('Request successful, dispatches `request` `success` and `deposit` actions', () => {
      return (getQuestionPolling()(dispatch, getState)).then((response = {}) => {
        expect(dispatch).toHaveBeenCalledWith(requestSpy(reducerTypes.REQUEST_QUESTIONS_POLL));
        expect(dispatch).toHaveBeenCalledWith(successSpy(reducerTypes.REQUEST_QUESTIONS_POLL));
        expect(dispatch).toHaveBeenCalledTimes(2);
      });
    });

    it('Request failure, dispatches `request` and `error` actions', () => {
      return (getQuestionPolling()(dispatch, getState)).catch((errors) => {
        expect(dispatch).toHaveBeenCalledWith(requestSpy(reducerTypes.REQUEST_QUESTIONS_POLL));
        expect(dispatch).toHaveBeenCalledWith(errorSpy(reducerTypes.REQUEST_QUESTIONS_POLL, errors));
        expect(dispatch).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('`getMoreQuestions` action creator', () => {
    const mockNameId = '123456789';
    const mockPageToken = '987654321';
    const mockQuestions = [{
      locationNameId: '123456',
      questions: {
        questions: [],
        nextPageToken: ''
      }
    }];
  
    const getState = jest.fn(() => ({
      [reducerTypes.REQUEST_LOCATIONS_QUESTIONS_GET]: {},
      [reducerTypes.DATA_QUESTIONS]: { data: mockQuestions },
      [reducerTypes.DATA_JWT]: { data: [{ jwt: '12345', pid: '98765' }] },
      [reducerTypes.DATA_PID]: { data: '98765' }
    }));

    mockAxios.get.mockImplementationOnce(() => 
      Promise.resolve({
        data: mockQuestions
      })
    );

    it('Request successful, dispatches `request` `success` and `deposit` actions', () => {
      return (getMoreQuestions(mockNameId, mockPageToken)(dispatch, getState)).then((response = {}) => {
        expect(dispatch).toHaveBeenCalledWith(requestSpy(reducerTypes.REQUEST_LOCATIONS_QUESTIONS_GET));
        expect(dispatch).toHaveBeenCalledWith(successSpy(reducerTypes.REQUEST_LOCATIONS_QUESTIONS_GET));
        expect(dispatch).toHaveBeenCalledWith(depositSpy(reducerTypes.DATA_QUESTIONS, mockQuestions));
        expect(dispatch).toHaveBeenCalledTimes(3);
      });
    });

    it('Request failure, dispatches `request` and `error` actions', () => {
      return (getMoreQuestions(mockNameId, mockPageToken)(dispatch, getState)).catch((errors) => {
        expect(dispatch).toHaveBeenCalledWith(requestSpy(reducerTypes.REQUEST_QUESTIONS_POLL));
        expect(dispatch).toHaveBeenCalledWith(errorSpy(reducerTypes.REQUEST_QUESTIONS_POLL, errors));
        expect(dispatch).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('`addOrEditResponse` action creator', () => {
    const mockNameId = '123456789';
    const mockText = 'test';
    const mockAnswerId = '';
    const mockQuestions = [{
      locationNameId: '123456',
      questions: {
        questions: [
          { name: '123456789' }
        ],
        nextPageToken: ''
      }
    }];
  
    const getState = jest.fn(() => ({
      [reducerTypes.REQUEST_QUESTIONS_REPLY]: {},
      [reducerTypes.DATA_QUESTIONS]: { data: mockQuestions },
      [reducerTypes.DATA_JWT]: { data: [{ jwt: '12345', pid: '98765' }] },
      [reducerTypes.DATA_PID]: { data: '98765' }
    }));

    mockAxios.post.mockImplementationOnce(() => 
      Promise.resolve({
        data: { question: { name: '123456789' } }
      })
    );

    it('Request successful, dispatches `request` `success` and `deposit` actions', () => {
      return (addOrEditResponse(mockNameId, mockText, mockAnswerId)(dispatch, getState)).then((response = {}) => {
        expect(dispatch).toHaveBeenCalledWith(requestSpy(reducerTypes.REQUEST_QUESTIONS_REPLY));
        expect(dispatch).toHaveBeenCalledWith(successSpy(reducerTypes.REQUEST_QUESTIONS_REPLY));
        expect(dispatch).toHaveBeenCalledTimes(4);
        expect(depositSpy).toHaveBeenCalledTimes(2);
      });
    });

    it('Request failure, dispatches `request` `error` and `deposit` actions', () => {
      return (addOrEditResponse(mockNameId, mockText, mockAnswerId)(dispatch, getState)).catch((errors) => {
        expect(dispatch).toHaveBeenCalledWith(requestSpy(reducerTypes.REQUEST_QUESTIONS_REPLY));
        expect(errorSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('`deleteResponse` action creator', () => {
    const mockNameId = '123456789';
    const mockAnswerId = '987654321';
    const mockQuestions = [{
      locationNameId: '123456',
      questions: {
        questions: [
          { 
            name: '123456789',
            topAnswers: [
              { name: '987654321' },
              { name: '5555555' }
            ]
          }
        ],
        nextPageToken: ''
      }
    }];
    const expectedDeposit = [{
      locationNameId: '123456',
      questions: {
        questions: [
          { 
            name: '123456789',
            topAnswers: [{ name: '5555555' }]
          }
        ],
        nextPageToken: ''
      }
    }];
    const getState = jest.fn(() => ({
      [reducerTypes.REQUEST_QUESTIONS_REPLY]: {},
      [reducerTypes.DATA_QUESTIONS]: { data: mockQuestions },
      [reducerTypes.DATA_JWT]: { data: [{ jwt: '12345', pid: '98765' }] },
      [reducerTypes.DATA_PID]: { data: '98765' }
    }));

    mockAxios.delete.mockImplementationOnce(() => 
      Promise.resolve({
        data: { success: true }
      })
    );

    it('Request successful, dispatches `request` `success` and `deposit` actions', () => {
      return (deleteResponse(mockNameId, mockAnswerId)(dispatch, getState)).then((response = {}) => {
        expect(dispatch).toHaveBeenCalledWith(requestSpy(reducerTypes.REQUEST_QUESTIONS_REPLY));
        expect(dispatch).toHaveBeenCalledWith(successSpy(reducerTypes.REQUEST_QUESTIONS_REPLY));
        expect(dispatch).toHaveBeenCalledWith(depositSpy(reducerTypes.DATA_QUESTIONS, expectedDeposit));
        expect(dispatch).toHaveBeenCalledTimes(3);
      });
    });

    mockAxios.delete.mockImplementationOnce(() => 
      Promise.reject({
        data: { error: 'test' }
      })
    );

    it('Request failure, dispatches `request` `error` and `deposit` actions', () => {
      return (deleteResponse(mockNameId, mockAnswerId)(dispatch, getState)).catch((errors) => {
        expect(dispatch).toHaveBeenCalledWith(requestSpy(reducerTypes.REQUEST_QUESTIONS_REPLY));
        expect(dispatch).toHaveBeenCalledWith(depositSpy(reducerTypes.DATA_QUESTIONS, mockQuestions));
        expect(errorSpy).toHaveBeenCalled();
      });
    });
  });

});
