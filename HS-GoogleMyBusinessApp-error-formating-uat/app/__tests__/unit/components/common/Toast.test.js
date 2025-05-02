import React from 'react';
import { shallow } from 'enzyme';
import { ToastType } from '@/constants/enums';
import { ToastMessage } from '@/components/common/Toast';


let props = {};

const setupProps = () => {
  props = {
    toastInfo: { type: ToastType.INFO, message: 'test message', isOpen: false },
  };
};

beforeEach(() => {
  setupProps();
});

describe('Toast', () => {

  it('Renders properly', () => {
    const wrapper = shallow(<ToastMessage {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

});
