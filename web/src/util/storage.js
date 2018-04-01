/*global window*/
import { randomString } from './index';

function setStorage(key, value, expireTimeInSeconds) {
  if (expireTimeInSeconds === undefined || expireTimeInSeconds === null) {
    expireTimeInSeconds = (24 * 60 * 60);
  } else {
    expireTimeInSeconds = Math.abs(expireTimeInSeconds);
  }

  const now = Date.now();
  const schedule = now + expireTimeInSeconds * 1000;
  const data = {
    data: value,
    expireTimeInMilliseconds: schedule
  };
  return localStorage.setItem(key, JSON.stringify(data));
}
function getStorage(key) {
  const data = localStorage.getItem(key);
  if (!data) {
    return null;
  } else if (new Date().getTime() > JSON.parse(data).expireTimeInMilliseconds) {
    return null;
  }
  return JSON.parse(data).data;
}
function removeStorage(name) {
  try {
    localStorage.removeItem(name);
  } catch (e) {
    return false;
  }
  return true;
}
/*global window*/
const storage = {
  get(item, session = true) {
    if (session) {
      return window.sessionStorage.getItem(item);
    }
    return window.localStorage.getItem(item);
  },
  set(item, value, session = true) {
    if (session) {
      return window.sessionStorage.setItem(item, value);
    }
    return window.localStorage.setItem(item, value);
  },
  clear() {
    sessionStorage.clear();
    localStorage.clear();
  },
  removeItem(item) {
    return removeStorage(item);
  }
};

export const bwOrderStorage = {
  get(item) {
    return getStorage(`fbm_order_${item}`);
  },
  set(item, value) {
    const key = `fbm_order_${item}`;
    return setStorage(key, JSON.stringify(value), 30 * 24 * 60 * 60);
  },
  remove(item) {
    return removeStorage(`fbm_order_${item}`);
  }
};
export const getUser = () => {
  const userString = storage.get('webchat');
    let user = null;
    if (userString) {
      user = JSON.parse(userString);
    }
    else {
      user = {
        id: randomString(8),
        name : '',
        image : '/images/no-image-post.png',
        hasName: false
      };
      storage.set('webchat', JSON.stringify(user));
      // this.setState({ modalUser: true });
    }
    return user;
}
export const setUser = (user) => {
  storage.set('webchat', JSON.stringify(user));
}
export default storage;
