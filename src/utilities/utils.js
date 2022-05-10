const emailRegex = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/g
const notifEmailRegex = /@\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/g



const notifEmailCheck =  async (text) => {
    return await text.match(notifEmailRegex)

}

const emailCheck =  async (text) => {
    return  await text.match(emailRegex)
}

const arrEmailCheck = async (emailArr)=>{
    let valid = true;
    let i = 0;
    while(i < emailArr.length && valid ){
        if(!await emailCheck(emailArr[i])){

            valid = false;
        }else{
            i++;
        }
    }
    return valid;
}


module.exports = {
    notifEmailCheck,
    emailCheck,
    arrEmailCheck
}