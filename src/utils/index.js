// 获取所有 cookie 并转为对象

export const getCookies = () =>
  document.cookie
    .split(";")
    .map(item => item.split("="))
    .reduce((acc, [k, v]) => (acc[k.trim().replace('"', "")] = v) && acc, {})

// 清除所有 cookie

export const clearCookies = () =>
  document.cookie.split(";").forEach(c => (document.cookie = c.splace(/^+/, "").replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`)))

//将 URL 参数转换为对象

export const getUrlParams = query =>
  Array.from(new URLSearchParams(query)).reduce(
    (p, [k, v]) => Object.assign({}, p, { [k]: p[k] ? (Array.isArray(p[k]) ? p[k] : [p[k]]).concat(v) : v }),
    {}
  )

//将数组转为对象

export const arrayToObject = (arr, key) => arr.reduce((a, b) => ({ ...a, [b[key]]: b }), {})

//判断数组是否不为空

export const arrayIsNotEmpty = arr => Array.isArray(arr) && Object.keys(arr).length > 0

//从对象中删除值为 null 和 undefined 的属性

export const removeNullAndUndefined = obj => Object.entries(obj).reduce((a, [k, v]) => (v == null ? a : ((a[k] = v), a)), {})

//生成指定范围随机数

export const randomNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

//手机号中间四位变成*

export const telFormat = tel => {
  tel = String(tel)
  return tel.substr(0, 3) + "****" + tel.substr(7)
}

//数字转化为大写金额

export const digitUppercase = n => {
  const fraction = ["角", "分"]
  const digit = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"]
  const unit = [
    ["元", "万", "亿"],
    ["", "拾", "佰", "仟"],
  ]
  n = Math.abs(n)
  let s = ""
  for (let i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, "")
  }
  s = s || "整"
  n = Math.floor(n)
  for (let i = 0; i < unit[0].length && n > 0; i++) {
    let p = ""
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p
      n = Math.floor(n / 10)
    }
    s = p.replace(/(零.)*零$/, "").replace(/^$/, "零") + unit[0][i] + s
  }
  return s
    .replace(/(零.)*零元/, "元")
    .replace(/(零.)+/g, "零")
    .replace(/^整$/, "零元整")
}

//数字转化为中文数字

export const intToChinese = value => {
  const str = String(value)
  const len = str.length - 1
  const idxs = ["", "十", "百", "千", "万", "十", "百", "千", "亿", "十", "百", "千", "万", "十", "百", "千", "亿"]
  const num = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"]
  return str.replace(/([1-9]|0+)/g, ($, $1, idx, full) => {
    let pos = 0
    if ($1[0] !== "0") {
      pos = len - idx
      if (idx == 0 && $1[0] == 1 && idxs[len - idx] == "十") {
        return idxs[len - idx]
      }
      return num[$1[0]] + idxs[len - idx]
    } else {
      let left = len - idx
      let right = len - idx + $1.length
      if (Math.floor(right / 4) - Math.floor(left / 4) > 0) {
        pos = left - (left % 4)
      }
      if (pos) {
        return idxs[pos] + num[$1[0]]
      } else if (idx + $1.length >= len) {
        return ""
      } else {
        return num[$1[0]]
      }
    }
  })
}

//存储loalStorage

export const loalStorageSet = (key, value) => {
  if (!key) return
  if (typeof value !== "string") {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}

// 获取localStorage

export const loalStorageGet = key => {
  if (!key) return
  return window.localStorage.getItem(key)
}

//删除localStorage

export const loalStorageRemove = key => {
  if (!key) return
  window.localStorage.removeItem(key)
}

//校验身份证号码

export const checkCardNo = value => {
  let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return reg.test(value)
}

//校验是否为邮箱地址

export const isEmail = (value) {
  return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value);
}

