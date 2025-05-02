import React from 'react';
import { shallow } from 'enzyme';
import { Home } from '@/components/home/Home';

let props = {};

const setupProps = () => {
  props = {
    login: jest.fn(() => Promise.resolve()),
    saveStreamType: jest.fn(() => Promise.resolve()),
    saveStreamPid: jest.fn(() => Promise.resolve()),
    history: { push: jest.fn() }
  };
};

const setupGlobalVariables = () => {
  // Set the initial global window variables
  global.stream = 'stream-reviews';
  global.pid = '12345';
  global.uid = '12345';
  global.ts = '12345';
  global.token = '12345';
};

beforeEach(() => {
  setupProps();
  setupGlobalVariables();
});

describe('Home', () => {
  
  it('Renders properly', () => {
    const wrapper = shallow(<Home {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  describe('Lifecycle methods', () => {

    describe('`componentWillMount`', () => {

      it('Calls `login` `saveStreamType` and `saveStreamPid` props', () => {
        shallow(<Home {...props} />);

        const expectedStreamType = 'reviews';

        expect(props.saveStreamType).toHaveBeenCalledWith(expectedStreamType);
        expect(props.saveStreamPid).toHaveBeenCalled();
        expect(props.login).toHaveBeenCalled();
      });

    });

  });

});
