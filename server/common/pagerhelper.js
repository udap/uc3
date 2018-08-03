
const calcTotalPage = ( pageSize, totalCount) => {

    let page = parseInt((totalCount / pageSize));

    let pageCount = totalCount % pageSize == 0 ? page : page + 1;

    return pageCount;
};

const calcStart = (pageNo,pageSize) => {
    return (pageNo - 1) * pageSize;//pageNo start with 1,calcStart start with 0
};

const calcEnd = (pageNo,pageSize,totalCount) => {
    let total = pageNo * pageSize;
    return total > totalCount ? totalCount : total;//pageNo start with 1,calcStart start with 0
};

const getPager = (pageNo,pageSize,totalCount) => {
    let pager = {
        pageNo :pageNo,
        pageSize : pageSize,
        totalCount : totalCount,
        totalPage:calcTotalPage(pageSize,totalCount)
    };
    return pager;
};


module.exports  = { calcTotalPage:calcTotalPage,calcStart:calcStart,calcEnd:calcEnd,getPager:getPager };