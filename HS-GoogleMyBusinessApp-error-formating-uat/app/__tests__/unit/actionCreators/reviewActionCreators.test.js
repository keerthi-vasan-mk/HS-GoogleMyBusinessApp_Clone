import mockAxios from 'axios';
import * as networkActions from '@/actions/networkActions';
import * as storageActions from '@/actions/storageActions';
import * as reducerTypes from '@/constants/reducerTypes';
import { getStartingReviews, getReviewsPolling, getMoreReviews,
         addReviewReply, deleteReviewReply } from '@/actionCreators/reviewActionCreators';

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

describe('reviewActionCreators', () => {

  describe('`getStartingReviews` action creator', () => {
    const mockData = 'test';

    const getState = jest.fn(() => ({
      [reducerTypes.REQUEST_REVIEWS_GET]: {},
      [reducerTypes.DATA_REVIEWS]: { data: {} },
      [reducerTypes.DATA_JWT]: { data: [{ jwt: '12345', pid: '98765' }] },
      [reducerTypes.DATA_PID]: { data: '98765' }
    }));

    mockAxios.get.mockImplementationOnce(() => 
      Promise.resolve({
        data: mockData
      })
    );

    it('Request successful, dispatches `request` `success` and `deposit` actions', () => {
      return (getStartingReviews()(dispatch, getState)).then((response = {}) => {
        expect(dispatch).toHaveBeenCalledWith(requestSpy(reducerTypes.REQUEST_REVIEWS_GET));
        expect(dispatch).toHaveBeenCalledWith(successSpy(reducerTypes.REQUEST_REVIEWS_GET));
        expect(dispatch).toHaveBeenCalledWith(depositSpy(reducerTypes.DATA_REVIEWS, mockData));
        expect(dispatch).toHaveBeenCalledTimes(3);
      });
    });

    it('Request failure, dispatches `request` and `error` actions', () => {
      return (getStartingReviews()(dispatch, getState)).catch((errors) => {
        expect(dispatch).toHaveBeenCalledWith(requestSpy(reducerTypes.REQUEST_REVIEWS_GET));
        expect(dispatch).toHaveBeenCalledWith(errorSpy(reducerTypes.REQUEST_REVIEWS_GET, errors));
        expect(dispatch).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('`getReviewsPolling` action creator', () => {
    const mockData = 'test';

    const getState = jest.fn(() => ({
      [reducerTypes.REQUEST_REVIEWS_POLL]: {},
      [reducerTypes.DATA_JWT]: { data: [{ jwt: '12345', pid: '98765' }] },
      [reducerTypes.DATA_PID]: { data: '98765' }
    }));

    mockAxios.get.mockImplementationOnce(() => 
      Promise.resolve({
        data: mockData
      })
    );

    it('Request successful, dispatches `request` `success` and `deposit` actions', () => {
      return (getReviewsPolling()(dispatch, getState)).then((response = {}) => {
        expect(dispatch).toHaveBeenCalledWith(requestSpy(reducerTypes.REQUEST_REVIEWS_POLL));
        expect(dispatch).toHaveBeenCalledWith(successSpy(reducerTypes.REQUEST_REVIEWS_POLL));
        expect(dispatch).toHaveBeenCalledTimes(2);
      });
    });

    it('Request failure, dispatches `request` and `error` actions', () => {
      return (getReviewsPolling()(dispatch, getState)).catch((errors) => {
        expect(dispatch).toHaveBeenCalledWith(requestSpy(reducerTypes.REQUEST_REVIEWS_POLL));
        expect(dispatch).toHaveBeenCalledWith(errorSpy(reducerTypes.REQUEST_REVIEWS_POLL, errors));
        expect(dispatch).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('`getMoreReviews` action creator', () => {
    const mockNameId = '123456789';
    const mockPageToken = '987654321';
    const mockReviews = [{
      locationNameId: '123456',
      reviews: {
        reviews: [],
        nextPageToken: ''
      }
    }];
  
    const getState = jest.fn(() => ({
      [reducerTypes.REQUEST_LOCATIONS_REVIEWS_GET]: {},
      [reducerTypes.DATA_REVIEWS]: { data: mockReviews },
      [reducerTypes.DATA_JWT]: { data: [{ jwt: '12345', pid: '98765' }] },
      [reducerTypes.DATA_PID]: { data: '98765' }
    }));

    mockAxios.get.mockImplementationOnce(() => 
      Promise.resolve({
        data: mockReviews
      })
    );

    it('Request successful, dispatches `request` `success` and `deposit` actions', () => {
      return (getMoreReviews(mockNameId, mockPageToken)(dispatch, getState)).then((response = {}) => {
        expect(dispatch).toHaveBeenCalledWith(requestSpy(reducerTypes.REQUEST_LOCATIONS_REVIEWS_GET));
        expect(dispatch).toHaveBeenCalledWith(successSpy(reducerTypes.REQUEST_LOCATIONS_REVIEWS_GET));
        expect(dispatch).toHaveBeenCalledWith(depositSpy(reducerTypes.DATA_REVIEWS, mockReviews));
        expect(dispatch).toHaveBeenCalledTimes(3);
      });
    });

    it('Request failure, dispatches `request` and `error` actions', () => {
      return (getMoreReviews(mockNameId, mockPageToken)(dispatch, getState)).catch((errors) => {
        expect(dispatch).toHaveBeenCalledWith(requestSpy(reducerTypes.REQUEST_LOCATIONS_REVIEWS_GET));
        expect(dispatch).toHaveBeenCalledWith(errorSpy(reducerTypes.REQUEST_LOCATIONS_REVIEWS_GET, errors));
        expect(dispatch).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('`addReviewReply` action creator', () => {
    const mockNameId = '123456789';
    const mockText = 'test';
    const mockReviews = [{
      locationNameId: '123456',
      reviews: {
        reviews: [
          { name: '123456789' }
        ],
        nextPageToken: ''
      }
    }];
  
    const getState = jest.fn(() => ({
      [reducerTypes.REQUEST_REVIEWS_REPLY]: {},
      [reducerTypes.DATA_REVIEWS]: { data: mockReviews },
      [reducerTypes.DATA_JWT]: { data: [{ jwt: '12345', pid: '98765' }] },
      [reducerTypes.DATA_PID]: { data: '98765' }
    }));

    mockAxios.put.mockImplementationOnce(() => 
      Promise.resolve({
        data: { review: { name: '123456789' } }
      })
    );

    it('Request successful, dispatches `request` `success` and `deposit` actions', () => {
      return (addReviewReply(mockNameId, mockText)(dispatch, getState)).then((response = {}) => {
        expect(dispatch).toHaveBeenCalledWith(requestSpy(reducerTypes.REQUEST_REVIEWS_REPLY));
        expect(dispatch).toHaveBeenCalledWith(successSpy(reducerTypes.REQUEST_REVIEWS_REPLY));
        expect(dispatch).toHaveBeenCalledTimes(3);
        expect(depositSpy).toHaveBeenCalledTimes(1);
      });
    });

    it('Request failure, dispatches `request` `error` and `deposit` actions', () => {
      return (addReviewReply(mockNameId, mockText)(dispatch, getState)).catch((errors) => {
        expect(dispatch).toHaveBeenCalledWith(requestSpy(reducerTypes.REQUEST_REVIEWS_REPLY));
        expect(errorSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('`deleteReviewReply` action creator', () => {
    const mockNameId = '123456789';
    const mockReviews = [{
      locationNameId: '123456',
      reviews: {
        reviews: [
          { 
            name: '123456789',
            reviewReply: 'test'
          }
        ],
        nextPageToken: ''
      }
    }];
    const expectedDeposit = [{
      locationNameId: '123456',
      reviews: {
        reviews: [{ name: '123456789' }],
        nextPageToken: ''
      }
    }];
    const getState = jest.fn(() => ({
      [reducerTypes.REQUEST_REVIEWS_REPLY]: {},
      [reducerTypes.DATA_REVIEWS]: { data: mockReviews },
      [reducerTypes.DATA_JWT]: { data: [{ jwt: '12345', pid: '98765' }] },
      [reducerTypes.DATA_PID]: { data: '98765' }
    }));

    mockAxios.delete.mockImplementationOnce(() => 
      Promise.resolve({
        data: { success: true }
      })
    );

    it('Request successful, dispatches `request` `success` and `deposit` actions', () => {
      return (deleteReviewReply(mockNameId)(dispatch, getState)).then((response = {}) => {
        expect(dispatch).toHaveBeenCalledWith(requestSpy(reducerTypes.REQUEST_REVIEWS_REPLY));
        expect(dispatch).toHaveBeenCalledWith(successSpy(reducerTypes.REQUEST_REVIEWS_REPLY));
        expect(dispatch).toHaveBeenCalledWith(depositSpy(reducerTypes.DATA_REVIEWS, expectedDeposit));
        expect(dispatch).toHaveBeenCalledTimes(3);
      });
    });

    it('Request failure, dispatches `request` `error` and `deposit` actions', () => {
      return (deleteReviewReply(mockNameId)(dispatch, getState)).catch((errors) => {
        expect(dispatch).toHaveBeenCalledWith(requestSpy(reducerTypes.REQUEST_REVIEWS_REPLY));
        expect(dispatch).toHaveBeenCalledWith(depositSpy(reducerTypes.REQUEST_REVIEWS_REPLY, expectedDeposit));
        expect(dispatch).toHaveBeenCalledWith(errorSpy(reducerTypes.DATA_REVIEWS, errors));
      });
    });
  });

});
