export const randomString = (length = 8) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ'.split('');

  if (! length) {
      length = Math.floor(Math.random() * chars.length);
  }

  let str = '';
  for (var i = 0; i < length; i++) {
      str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
}

