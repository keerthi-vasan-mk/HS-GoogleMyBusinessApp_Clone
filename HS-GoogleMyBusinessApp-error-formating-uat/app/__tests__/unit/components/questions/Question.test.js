import React from 'react';
import { shallow } from 'enzyme';
import { Question } from '@/components/questions/Question';

let props = {};

const setupProps = () => {
  props = {
    addOrEditResponse: jest.fn(() => Promise.resolve()),
    deleteResponse: jest.fn(() => Promise.resolve()),
    question: {
      name: 'test',
      author: {
        displayName: 'test',
        profilePhotoUrl: 'test',
        type: 'MERCHANT'
      },
      text: 'Test',
      createTime: '2019-04-05T16:28:22.369547Z',
      updateTime: '2019-04-05T16:28:22.369547Z'
    },
  };
};

beforeEach(() => {
  setupProps();
});

describe('Question', () => {
  
  it('Renders properly', () => {
    const wrapper = shallow(<Question {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
