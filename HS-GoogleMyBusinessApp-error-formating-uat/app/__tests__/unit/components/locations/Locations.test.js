import React from 'react';
import { shallow } from 'enzyme';
import { Locations } from '@/components/locations/Locations';

let props = {};

const setupProps = () => {
  props = {
    getLocations: jest.fn(() => Promise.resolve([
      {
        locations: [
          {
            locationNameId: 'test',
            isVerified: true,
            isActive: true,
            name: 'test',
            address: 'test'
          }
        ]
      }
    ])),
    setLocations: jest.fn(() => Promise.resolve()),
    history: { push: jest.fn() },
    locationsRequest: { isFetching: false },
    accountLocations: [
      {
        accountNameId: 'test',
        accountName: 'test',
        locations: [
          {
            locationNameId: 'test',
            isVerified: true,
            isActive: true,
            name: 'test',
            address: 'test'
          }
        ]
      }
    ],
    stream: 'reviews'
  };
};

beforeEach(() => {
  setupProps();
});

describe('Locations', () => {
  
  it('Renders properly', () => {
    const wrapper = shallow(<Locations {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  describe('Lifecycle methods', () => {

    describe('`componentDidMount`', () => {

      it('Calls `getLocations` prop', () => {
        shallow(<Locations {...props} />);
        expect(props.getLocations).toHaveBeenCalled();
      });
    });
  });

  describe('Component methods', () => {
    
    describe('`submit` method', () => {
      
      it('Calls `setLocations` and `history.push` props', async () => {
        const mockSubmitEvent = {
          preventDefault: jest.fn(),
          target: {
            elements: [
              { value: '12345', checked: true},
              { value: '98765', checked: false}
            ]
          }
        };
        const wrapper = shallow(<Locations {...props} />);
        const instance = wrapper.instance();

        await instance.submit(mockSubmitEvent);

        expect(props.setLocations).toHaveBeenCalledWith([ '12345' ]);
        expect(props.history.push).toHaveBeenCalled();
      });
    });
  });
});
