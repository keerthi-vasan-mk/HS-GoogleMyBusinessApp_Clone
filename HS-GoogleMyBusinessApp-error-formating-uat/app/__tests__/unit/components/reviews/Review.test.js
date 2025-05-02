import React from 'react';
import { shallow } from 'enzyme';
import { Review } from '@/components/reviews/Review';

let props = {};

const setupProps = () => {
  props = {
    addOrEditReply: jest.fn(() => Promise.resolve()),
    deleteReply: jest.fn(() => Promise.resolve()),
    review: {
      reviewId: 'test',
      reviewer: {
        profilePhotoUrl: 'test',
        displayName: 'test'
      },
      starRating: 'FIVE',
      createTime: '2018-02-25T05:06:25.132Z',
      updateTime: '2018-02-25T05:06:25.132Z',
      name: 'test'
    }
  };
};

beforeEach(() => {
  setupProps();
});

describe('Review', () => {

  it('Renders properly', () => {
    const wrapper = shallow(<Review {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
