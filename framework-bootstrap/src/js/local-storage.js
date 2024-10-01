export function setToLocalItem(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getLocalItem(key) {
  const item = window.localStorage.getItem(key);
  return JSON.parse(item);
}

export function deleteToLocalItem(key) {
  window.localStorage.removeItem(key);
}

export function getAllItems() {
  window.localStorage.clear();
}
