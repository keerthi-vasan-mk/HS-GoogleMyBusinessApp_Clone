import React from 'react';
import { shallow } from 'enzyme';
import { Post } from '@/components/posts/Post';
import moment from 'moment';

const setupProps = () => {
  return {
    post: {
      content: 'testing',
      createTime: moment()
        .format('YYYY-YY-MM')
        .toString(),
      location: 'test',
      id: 'test',
      ctaButtonLink: 'test',
      ctaButtonType: 'LEARN_MORE',
    },
  };
};

beforeEach(() => {});

describe('Post', () => {
  const props = setupProps();
  it('Renders properly', () => {
    const wrapper = shallow(<Post {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
