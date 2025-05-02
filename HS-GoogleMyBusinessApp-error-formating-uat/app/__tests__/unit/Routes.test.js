import React from 'react';
import { shallow } from 'enzyme';
import Routes from '@/Routes';

describe('Routes', () => {

  it('Renders properly', () => {
    const wrapper = shallow(<Routes />);
    expect(wrapper).toMatchSnapshot();
  });

});