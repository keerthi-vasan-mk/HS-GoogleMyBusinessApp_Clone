import * as storageActions from '@/actions/storageActions';
import * as reducerTypes from '@/constants/reducerTypes';
import { saveStreamType, saveStreamPid } from '@/actionCreators/streamActionCreators';

const dispatch = jest.fn();
const depositSpy = jest.spyOn(storageActions, 'deposit');

beforeEach(() => {
  dispatch.mockClear();
  depositSpy.mockClear();
});

describe('streamActionCreators', () => {

  describe('`saveStreamType` action creator', () => {
    const mockStreamType = 'reviews';

    it('dispatches `deposit` action', () => {
      saveStreamType(mockStreamType)(dispatch);
      expect(dispatch).toHaveBeenCalledWith(depositSpy(reducerTypes.DATA_STREAM, mockStreamType));
    });
  });

  describe('`saveStreamPid` action creator', () => {
    const mockPid = '12345';

    it('dispatches `deposit` action', () => {
      saveStreamPid(mockPid)(dispatch);
      expect(dispatch).toHaveBeenCalledWith(depositSpy(reducerTypes.DATA_PID, mockPid));
    });
  });

});
