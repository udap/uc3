
const calcTotalPage = ( pageSize, totalCount) => {

    let page = parseInt((totalCount / pageSize));

    let pageCount = totalCount % pageSize == 0 ? page : page + 1;

    //calc TotalPage
    return pageCount;
};

const calcStart = (pageNo,pageSize) => {
    return (pageNo - 1) * pageSize;//calc start no
};

module.exports  = { calcTotalPage:calcTotalPage,calcStart:calcStart };