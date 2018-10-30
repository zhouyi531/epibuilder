exports.parseSQL = function(text){
    //--@id int id
    const result = {};
    const regexp = /--@\w+\s+(int|varchar|nvarchar|date|datetime|datetime2|smallint|uniqueidentifier)\s+(\w+)\n/gi;
    const regexp2 = /--@(\w+)\s+(int|varchar|nvarchar|date|datetime|datetime2|smallint|uniqueidentifier)/gi;

    let match = regexp.exec(text);
    while (match != null) {
        // matched text: match[0]
        // match start: match.index
        // capturing group n: match[n]
        result[match[2]]="";
        match = regexp.exec(text);
    }

    if(Object.keys(result).length===0){
        let match2 = regexp2.exec(text);
        while (match2 != null) {
            // matched text: match[0]
            // match start: match.index
            // capturing group n: match[n]
            result[match2[1]] = "";
            match2 = regexp2.exec(text);
        }
    }

    return result;
}