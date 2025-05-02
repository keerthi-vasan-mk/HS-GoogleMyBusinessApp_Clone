import React from 'react';
import { shallow } from 'enzyme';
import { Questions } from '@/components/questions/Questions';

let props = {};

const setupProps = () => {
  props = {
    getStartingQuestions: jest.fn(() => Promise.resolve()),
    getMoreQuestions: jest.fn(() => Promise.resolve()),
    addOrEditResponse: jest.fn(() => Promise.resolve()),
    deleteResponse: jest.fn(() => Promise.resolve()),
    questionsRequest: { isFetching: false },
    getQuestionsPolling: jest.fn(() => Promise.resolve()),
    history: { push: jest.fn() },
    questions: [
      {
        locationName: 'Test Location 1',
        locationNameId: '1',
        questions: {
          questions: [
            {
              name: 'testing',
              author: {
                displayName: 'test',
                profilePhotoUrl: 'test',
                type: 'MERCHANT'
              },
              text: 'testing',
              createTime: '2019-04-05T16:28:22.369547Z',
              updateTime: '2019-04-05T16:28:22.369547Z'
            },
            {
              name: 'testing',
              author: {
                displayName: 'test',
                profilePhotoUrl: 'test',
                type: 'MERCHANT'
              },
              text: 'testing',
              createTime: '2019-04-05T16:28:22.369547Z',
              updateTime: '2019-04-05T16:28:22.369547Z'
            },
          ],
          totalSize: 2
        }
      },
      {
        locationName: 'Test Location 2',
        locationNameId: '2',
        questions: {
          questions: [
            {
              name: 'testing',
              author: {
                displayName: 'test',
                profilePhotoUrl: 'test',
                type: 'MERCHANT'
              },
              text: 'testing',
              createTime: '2019-04-05T16:28:22.369547Z',
              updateTime: '2019-04-05T16:28:22.369547Z'
            },
            {
              name: 'testing',
              author: {
                displayName: 'test',
                profilePhotoUrl: 'test',
                type: 'MERCHANT'
              },
              text: 'testing',
              createTime: '2019-04-05T16:28:22.369547Z',
              updateTime: '2019-04-05T16:28:22.369547Z'
            },
          ],
          totalSize: 2
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

describe('Questions', () => {
  
  it('Renders properly', () => {
    const wrapper = shallow(<Questions {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  describe('Lifecycle methods', () => {

    describe('`componentDidMount` method', () => {

      it('Calls `getStartingQuestions` prop', () => {
        shallow(<Questions {...props} />);
        expect(props.getStartingQuestions).toHaveBeenCalled();
      });
    });
  });
});
