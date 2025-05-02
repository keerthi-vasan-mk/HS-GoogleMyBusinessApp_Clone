import React from 'react';
import { shallow } from 'enzyme';
import { Reviews } from '@/components/reviews/Reviews';

let props = {};

const setupProps = () => {
  props = {
    getStartingReviews: jest.fn(() => Promise.resolve()),
    getMoreReviews: jest.fn(() => Promise.resolve()),
    addReviewReply: jest.fn(() => Promise.resolve()),
    deleteReviewReply: jest.fn(() => Promise.resolve()),
    reviewsRequest: { isFetching: false },
    getReviewsPolling: jest.fn(() => Promise.resolve()),
    history: { push: jest.fn() },
    reviews: [
      {
        location_name: 'Location 1',
        name_id: '1',
        reviews: {
          reviews: [
            {
              reviewId: '1',
              reviewer: {
                profilePhotoUrl: 'test',
                displayName: 'test'
              },
              starRating: 'FOUR',
              comment: 'test',
              createTime: '2019-02-25T17:51:40.280903Z',
              updateTime: '2019-02-25T17:51:40.280903Z',
              reviewReply: {
                comment: 'test',
                updateTime: '2019-02-25T18:10:30.144141Z'
              },
              name: 'test'
            }
          ],
          averageRating: 4.300000190734863,
          totalReviewCount: 3,
          nextPageToken: 'test'
        }
      }
    ]
  };
};

beforeAll(() => {
  // Mock the globally available Hoosuite method
  global.hsp = {
    bind: jest.fn()
  };
});

beforeEach(() => {
  setupProps();
});

describe('Reviews', () => {
  
  it('Renders properly', () => {
    const wrapper = shallow(<Reviews {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  describe('Lifecycle methods', () => {

    describe('`componentDidMount` method', () => {

      it('Calls `getStartingReviews` prop', () => {
        shallow(<Reviews {...props} />);
        expect(props.getStartingReviews).toHaveBeenCalled();
      });
    });
  });
});
