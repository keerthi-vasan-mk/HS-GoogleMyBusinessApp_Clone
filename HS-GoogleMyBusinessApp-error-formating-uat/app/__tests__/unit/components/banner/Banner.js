import React from 'react';
import { shallow } from 'enzyme';
import Banner from '@/components/banner/banner';


let props = {};

const setupProps = () => {
  props = {
    message: 'testing',
    refresh: jest.fn(() => Promise.resolve())
  };
};

beforeEach(() => {
  setupProps();
});

describe('Banner', () => {
  
  it('Renders properly', () => {
    const wrapper = shallow(<Banner {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
  
});
