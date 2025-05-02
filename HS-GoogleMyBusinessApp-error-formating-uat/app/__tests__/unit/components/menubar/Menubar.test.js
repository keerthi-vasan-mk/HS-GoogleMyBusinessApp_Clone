import React from 'react';
import { shallow } from 'enzyme';
import { MenuBar } from '@/components/menubar/MenuBar';

let props = {};

const setupProps = () => {
  props = {
    isMenuDropDownOpen: false,
    toggleMenuDropdown: jest.fn(),
    revokeAuthorization: jest.fn(() => Promise.resolve()),
    googleUserName: '',
    getGoogleUsername: jest.fn(() => Promise.resolve()),
    history: { push: jest.fn() },
    location: {},
    jwtToken: 'test',
    stream: 'test'
  };
};

beforeEach(() => {
  setupProps();
});

describe('Menubar', () => {
  
  it('Renders properly', () => {
    const wrapper = shallow(<MenuBar {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  describe('Lifecycle methods', () => {
    
    describe('`componentDidMount` method', () => {
      
      it('Calls `getGoogleUsername` prop', () => {
        shallow(<MenuBar {...props} />);
        expect(props.getGoogleUsername).toHaveBeenCalled();
      });
    });
  });

  describe('Component methods', () => {
    
    describe('`disconnectAccount` method', () => {
      
      it('Calls `revokeAuthorization` prop', async () => {
        const wrapper = shallow(<MenuBar {...props} />);
        const instance = wrapper.instance();

        await instance.disconnectAccount();

        expect(props.revokeAuthorization).toHaveBeenCalled();      
      });
    });
  });
});
