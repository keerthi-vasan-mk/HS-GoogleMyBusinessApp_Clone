import React from 'react';
import { shallow } from 'enzyme';
import { Posts } from '@/components/posts/Posts';

let props = {};

const setupProps = () => {
  props = {
    getStartingPosts: jest.fn(() => Promise.resolve()),
    getMorePosts: jest.fn(() =>
      Promise.resolve({
        posts: [{ id: '5' }, { id: '6' }, { id: '7' }],
        pagination: ['1111'],
      }),
    ),
    getPostsPolling: jest.fn(() => Promise.resolve()),
    posts: {
      posts: [{ id: '1' }, { id: '2' }, { id: '3' }],
    },
    postsRequest: { isFetching: false },
  };
};

beforeEach(() => {
  setupProps();
});

describe('Posts', () => {
  it('Renders properly', () => {
    const wrapper = shallow(<Posts {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  describe('Lifecycle methods', () => {
    describe('`componentDidMount` method', () => {
      it('Calls `getStartingPosts` prop', () => {
        shallow(<Posts {...props} />);
        expect(props.getStartingPosts).toHaveBeenCalled();
      });
    });
  });

  describe('Component methods', () => {
    describe('`getMorePosts` method', () => {
      it('Calls `getMorePosts` prop', () => {
        const wrapper = shallow(<Posts {...props} />);
        const instance = wrapper.instance();
        // Update the state to have pagination keys
        instance.setState({ pagination: ['1111'] });

        instance.props.getMorePosts();

        expect(props.getMorePosts).toHaveBeenCalled();
      });
    });
  });
});
