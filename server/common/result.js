
const success = content => {
    let ret = {
        retcode: 1,
        msg: "success"
    };
    if (content)
        ret.content = content;
    return ret;
};

const fail = (message,content) => {
    let ret = {
        retcode: 0,
        msg: message?message:"fail"
    };
    if (content)
        ret.content = content;
    return ret;
};

const other = (code,message,content) => {
    let ret = {
        retcode:code?code:0
    };
    if (message)
        ret.msg = message;
    if (content)
        ret.content = content;
    return ret;
};




module.exports  = { success:success,fail:fail,other:other};