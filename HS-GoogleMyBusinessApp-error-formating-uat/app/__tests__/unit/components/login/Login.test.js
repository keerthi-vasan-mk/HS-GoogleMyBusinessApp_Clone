import React from 'react';
import { shallow } from 'enzyme';
import { Login } from '@/components/login/Login';
const jsdom = require('jsdom');

let props = {};
// const { JSDOM } = jsdom;
// const { window } = new JSDOM();
// global.window = window;
const setupProps = () => {
  props = {
    authorizeTokens: jest.fn(() => Promise.resolve()),
    // getUserTokenStatus: jest.fn(() => Promise.resolve(false)),
    history: { push: jest.fn() },
    openToast: jest.fn(),
  };
};

beforeEach(() => {
  setupProps();
});

describe('Login', () => {
  it('Renders properly', () => {
    //const wrapper = shallow(<Login {...props} />);
    //expect(wrapper).toMatchSnapshot();
  });

  // it('should call handleLogin method on componentDidMount', () => {
  //   const wrapper = shallow(<Login {...props} />);
  //   // const handleLoginMock = jest.spyOn(wrapper.instance(), 'handleLogin');
  //   wrapper.instance().componentDidMount();
  //   //expect(handleLoginMock).toHaveBeenCalled();
  // });

  // describe('Component methods', () => {
  //   it('should initialize google oauth2 client on handleLogin', () => {
  //     // const initCodeClientMock = jest.fn();
  //     // global.google.accounts = {
  //     //   oauth2: {
  //     //     initCodeClient: initCodeClientMock,
  //     //   },
  //     // };

  //     // const initCodeClientMock = jest.fn();
  //     // global.google.accounts = {
  //     //   oauth2: {
  //     //     initCodeClient: initCodeClientMock,
  //     //   },
  //     // };
  //     const wrapper = shallow(<Login {...props} />);
  //     wrapper.instance().handleLogin();
  //   });

  //   it('should log response on onGoogleLoginSuccess', async () => {
  //     const consoleSpy = jest.spyOn(console, 'log');
  //     const response = { code: 'dummy_token' };
  //     const wrapper = shallow(<Login {...props} />);
  //     await wrapper.instance().onGoogleLoginSuccess(response);
  //     expect(props.authorizeTokens).toHaveBeenCalledWith(response.code);
  //   });
  // });
});
delete global.window;
