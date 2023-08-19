import { decamelize } from 'humps';
import Server from '../communication';
import Selector from './selector';

const pressKeyMethods = ['home', 'volumeUp', 'volumeDown', 'volumeMute', 'back', 'right', 'left',
  'up', 'down', 'menu', 'search', 'center', 'enter', 'delete', 'recent', 'camera', 'power',
];
const aloneMethods = ['wakeUp', 'sleep', 'openNotification', 'openQuickSettings'];

export default class Device {
  constructor(options) {
    this._register(pressKeyMethods, 'pressKey');
    this._register(aloneMethods);
    this._server = new Server(options);
  }

  /**
   * @returns Promise
   */
  connect() {
    return this._server.start();
  }

  /**
   * @deprecated Please use disconnect() instead
   */
  stop() {
    return this.disconnect();
  }

  /**
   * @returns Promise
   */
  disconnect() {
    return this._server.stop();
  }

  /**
   * @returns Promise
   */
  isConnected() {
    return this._server.isAlive();
  }

  /**
   * @returns Promise
   */
  click(selector) {
    const preparedSelector = new Selector(selector);
    return this._server.send('click', [preparedSelector]);
  }

  /**
   * @returns Promise
   */
  exists(selector) {
    const preparedSelector = new Selector(selector);
    return this._server.send('exist', [preparedSelector]);
  }

  /**
   * @returns Promise
   */
  info() {
    return this._server.send('deviceInfo', []);
  }

  /**
   * @returns Promise
   */
  setText(selector, text) {
    const preparedSelector = new Selector(selector);
    return this._server.send('setText', [preparedSelector, text]);
  }

  /**
   * @returns Promise
   */
  swipe(sourceX, sourceY, destX, destY, steps=10) {
    return this._server.send('swipe', [sourceX, sourceY, destX, destY, steps]);
  }


  _register(methods, prefix) {
    for (let index = 0; index < methods.length; index += 1) {
      const methodName = methods[index];
      const decamelizedMethodName = decamelize(methodName);
      if (prefix) {
        this[methodName] = () => this._server.send(prefix, [decamelizedMethodName]);
      } else {
        this[methodName] = () => this._server.send(methodName, []);
      }
    }
  }
}
