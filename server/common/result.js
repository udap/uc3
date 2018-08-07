
const success = content => {
    let ret = {
        code: 1,
        message: "success"
    };
    if (content)
        ret.content = content;
    return ret;
};

const fail = (message,content) => {
    let ret = {
        code: 0,
        message: message?message:"fail"
    };
    if (content)
        ret.content = content;
    return ret;
};

const other = (code,message,content) => {
    let ret = {
        code:code?code:0
    };
    if (message)
        ret.message = message;
    if (content)
        ret.content = content;
    return ret;
};




module.exports  = { success:success,fail:fail,other:other};