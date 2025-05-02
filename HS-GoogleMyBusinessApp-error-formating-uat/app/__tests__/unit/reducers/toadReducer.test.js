import toastReducer from '@/reducers/toastReducer';
import { openToast, closeToast } from '@/actions/toastActions';

describe('toastReducer', () => {

  it('receives undefined', () => {
    const expectedValue = {
      isOpen: false,
      type: "",
      message: "",
    };

    expect(toastReducer(undefined, {})).toEqual(expectedValue);
  });

  it('receives an `OPEN_TOAST` action.type', () => {
    const mockPayload = {
      type: "test status",
      message: "test message",
    };
    const expectedValue = {
      isOpen: true,
      ...mockPayload,
    };

    expect(toastReducer({}, openToast(mockPayload))).toEqual(expectedValue);
  });

  it('receives a `CLOSE_TOAST` action.type', () => {
    const expectedValue = {
      isOpen: false,
    };

    expect(toastReducer({}, closeToast())).toEqual(expectedValue);
  });

});
