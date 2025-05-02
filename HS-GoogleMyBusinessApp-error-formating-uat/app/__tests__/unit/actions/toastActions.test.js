import { OPEN_TOAST, CLOSE_TOAST } from '@/constants/actionTypes';
import { openToast, closeToast } from '@/actions/toastActions';


describe('toastActions', () => {

  it('`openToast` action returns an object', () => {
    const mockPayload = {
      type: "test status",
      message: "test message",
    };
    const expectedValue = {
      type: OPEN_TOAST,
      payload: mockPayload,
    };

    expect(openToast(mockPayload)).toEqual(expectedValue);
  });

  it('`closeToast` action returns an object', () => {
    const expectedValue = {
      type: CLOSE_TOAST,
    };

    expect(closeToast()).toEqual(expectedValue);
  });

});