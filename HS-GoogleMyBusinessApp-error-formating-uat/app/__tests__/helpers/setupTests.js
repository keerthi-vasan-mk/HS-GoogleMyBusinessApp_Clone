import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

global.requestAnimationFrame = (callback) => {
  setTimeout(callback, 0);
};

global.localStorage = new class {
  store = {};
  getItem = (key) => this.store[key];
  setItem = (key, value) => this.store[key] = value.toString();
  removeItem = (key) => delete this.store[key];
  clear = () => this.store = {};
}();
