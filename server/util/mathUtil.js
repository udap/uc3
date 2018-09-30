const BD = require("bigdecimal");

let down = BD.RoundingMode.DOWN();

/**
 *
 * @param p1
 * @param p2
 * @returns {number} p1/p2
 */
function div(p1,p2,decimals,roundingMode) {
    let a = new BD.BigDecimal(p1.toString());
    let b = new BD.BigDecimal(p2.toString());
    if(decimals){
        if(!roundingMode) roundingMode=down;
        return Number(a.divide(b,decimals,roundingMode).toString());
    }else {
        return Number(a.divide(b).toString());
    }
}

module.exports  = { div:div};