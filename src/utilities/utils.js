const emailRegex = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/g;
const notifEmailRegex = /@\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/g;

const notifEmailCheck = (text) => {
  return text.match(notifEmailRegex);
};

const emailCheck = (text) => {
  return text.match(emailRegex);
};

const arrEmailCheck = (emailArr) => {
  let valid = true;
  let i = 0;
  while (i < emailArr.length && valid) {
    if (!emailCheck(emailArr[i])) {
      valid = false;
    } else {
      i++;
    }
  }
  return valid;
};

module.exports = {
  notifEmailCheck,
  emailCheck,
  arrEmailCheck,
};
