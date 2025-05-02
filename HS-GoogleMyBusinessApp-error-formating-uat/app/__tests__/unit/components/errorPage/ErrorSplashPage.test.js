import React from 'react';
import { shallow } from 'enzyme';
import ErrorSplashPage from '@/components/errorPage/ErrorSplashPage';

describe('ErrorSplashPage', () => {
  
  it('Renders properly', () => {
    const wrapper = shallow(<ErrorSplashPage />);
    expect(wrapper).toMatchSnapshot();
  });
  
});
