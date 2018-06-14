
const calcTotalPage = ( pageSize, totalCount) => {

    let page = parseInt((totalCount / pageSize));

    let pageCount = totalCount % pageSize == 0 ? page : page + 1;

    //总页数有可能为0
    return pageCount;
};

module.exports  = { calcTotalPage:calcTotalPage };