exports.parseSQL = function(text){
    //--@id int id
    const result = {};
    const regexp = /--@\w+\s+(int|varchar)\s+(\w+)/g;

    let match = regexp.exec(text);
    while (match != null) {
        // matched text: match[0]
        // match start: match.index
        // capturing group n: match[n]
        result[match[2]]="";
        match = regexp.exec(text);
    }

    return result;
}