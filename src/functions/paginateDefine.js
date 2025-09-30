
const paginateDefine = (req) => {
    let { size, page } = req.headers;
    
    size = parseInt(size);
    page = parseInt(page);
    
    if (!size) size = 10;
    if (!page) page = 1;
    
    
    if (size < 1) size = 1;
    if (page < 1) page = 1;
    if (size > 100) size = 100;

    return { size, page };
}

module.exports = paginateDefine;