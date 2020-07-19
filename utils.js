// 格式化路径的 pathname ！！！
export function normalizePath(_path) {
  if (typeof _path === 'string' && _path) {
    return _path.replace(/\/{2,}/g, '/');
  }
  return false;
}

// 0 不判断为false，其他为false的值都作为空处理
export function isBlank(value) {
  if (typeof value === 'string') {
    return value.trim() === '';
  }
  return value === null || value === undefined || value === false;
}

// 如果是基本数据类型
export function isPrimitive(value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'undefined' ||
    typeof value === 'boolean' ||
    value === null
  );
}

// 安全的JSON.parse
export function safeParse(value, iteratee) {
  if (isBlank(value)) {
    return null;
  }
  try {
    return iteratee ? JSON.parse(value, iteratee) : JSON.parse(value);
  } catch (e) {
    console.warn('无法parse当前参数');
    return null;
  }
}


// lifeTime值为时间戳，如果为空则永久保存,value为非String等数据类型无需专门转为String类型
// 确保与 getLocalStorage 一起使用
export const setLocalStorage = (name, value, lifeTime = (1000 * 60 * 60 * 24 * 7)) => {
  const saveDate = new Date().getTime();
  localStorage.setItem(
    name,
    JSON.stringify({
      value: value,
      lifeTime: lifeTime,
      saveDate: saveDate
    })
  );
};

// 如果存储的内容过期或者不存在，则返回一个null，若存在并且数据格式合法则放回value
// 确保与 setLocalStorage 一起使用
export const getLocalStorage = name => {
  const getDate = new Date().getTime();
  const getItem = safeParse(localStorage.getItem(name));
  let val = {};
  if (getItem) {
    // 检查储存是否过期
    if (getDate - (getItem.saveDate || 0) > (getItem.lifeTime || (1000 * 60 * 60 * 24 * 7))) {
      localStorage.removeItem(name);
    } else {
      val = getItem;
    }
  }
  return val.value;
};

// value为非String等数据类型无需专门转为String类型
export const setSessionStorage = (name, value) => {
  sessionStorage.setItem(
    name,
    JSON.stringify({
      value: value
    })
  );
};

// 数据格式合法则放回value
export const getSessionStorage = name => {
  const getItem = sessionStorage.getItem(name);
  const val = safeParse(getItem) || {};
  return val.value;
};

// 是否一个对象{}
export function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}