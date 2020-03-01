/**
 * 将字符串从 get-element-by-id 修改成大驼峰显示 GetElementById
 *
 * @param {string} foo
 */
function toUpperCamelCase(foo?: string) {
  if (!foo) {
    return '';
  }
  var arr = foo.split('-');
  for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
  }
  return arr.join('');
}

export {
  toUpperCamelCase
};


