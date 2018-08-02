
const success = content => {
    let ret = {
        code: 1,
        message: "success",
        content:content
    };
    return ret;
};

const fail = (message,content) => {
    let ret = {
        code: 0,
        message: message?message:"fail",
        content:content?content:""
    };
    return ret;
};




module.exports  = { success:success,fail:fail};