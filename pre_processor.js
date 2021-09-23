const fs = require('fs');
const utf8 = require('utf8');


const tests = (() => {
    const addr = './Output/Novel/Joe/Test/'
    var tmp = fs.readdirSync(addr).filter(file => file.endsWith('.html'))
    let result = []
    for (let afile of tmp) {
        try {
            const data = fs.readFileSync(`${addr}${afile}`, 'utf8')

            result.push({ name: afile, content: data })
        } catch (err) {
            console.error(err)
        }
    }
    let k = result.length - 1
    console.log(result[k])
    return result;
})()

const char_codes = (() => {
    const addr = './htmlcodes.txt'
    let result_1 = []
    let result = []
    try {
        const data = fs.readFileSync(`${addr}`, 'utf8')

        result_1 = data.split("\r\n").filter(val => val.trim().length > 0)
        result_1.forEach(item => {
            let tmp_var = item.split("\t").map(item => item.trim()).filter(val => val.length > 0)
            let tmp_var_1 = {
                code: tmp_var.filter(item => (item.startsWith("&") && item.endsWith(";"))),
                symbol: (tmp_var.filter(item => (item.length === 1))),
            }
            tmp_var_1.code.forEach(code => {
                    switch (code) {
                        case "&#160;":
                            tmp_var_1.symbol = String.fromCharCode('U+202F')[0];
                            break;
                        case "&#32;":
                            tmp_var_1.symbol = ' ';
                            break;
                        case "&#09;":
                            tmp_var_1.symbol = '\t';
                            break;
                        case "&#8199;":
                            tmp_var_1.symbol = String.fromCharCode('U+2007')[0];
                            break;
                        case "&#8288;":
                            tmp_var_1.symbol = String.fromCharCode('U+2060')[0];
                            break;
                        case "&#10;":
                            tmp_var_1.symbol = '\n'
                            break;
                        case "&#13;":
                            tmp_var_1.symbol = '\r'
                            break;
                    }
                })
                // console.log(tmp_var_1)
            result.push(tmp_var_1)
        })
    } catch (err) {
        console.error(err)
    }

    console.log(result)

    return result;
})()

const CharCodes = (() => {
    let result = [];
    for (let it of char_codes) {
        console.log(it.code)
        it.code.forEach(an_it => {
            result.push({
                code: an_it,
                symbol: it.symbol[0],
            })
        })
    }
    result.push({
        code: '&#8220;',
        symbol: '“' //&#8221;
    }, {
        code: '&#8221;',
        symbol: '”' //
    }, {
        code: '&#8230;',
        symbol: '…' //
    }, {
        code: '&#8217;',
        symbol: '’' //
    }, {
        code: '&#8216;',
        symbol: '‘' //
    })
    return result
})()

// console.log(CharCodes)

const test_1 = (target = { name: "", content: [""] }) => {
    const tmp = target.content.split('\n')
    let ch_start = false;
    const tmp_1 = tmp.filter(item => {

        return item.includes("<p>") || item.includes("<h3>")
    })

    return tmp_1
}

console.log(test_1(tests[0]).join("\n"))

fs.writeFile(`./Output/Novel/Michael/Test_1.txt`, test_1(tests[0]).join("\n"), { flag: 'w' }, err => {
    if (err) {
        console.error(err)
        return
    }
    //file written successfully
})

function CharCodesToFile() {
    let tmp = ""
    CharCodes.forEach(an => {
                tmp = tmp + `\n{code: \'${an.code}\' symbol:\'${(an.symbol=='\n'?`\\n`:(an.symbol=='\r'?'\\r':an.symbol))}\'}`
    })
    fs.writeFile(`./Output/Novel/Michael/CharCodes_1.txt`, tmp, { flag: 'w' }, err => {
        if (err) {
            console.error(err)
            return
        }
        //file written successfully
    })
}

CharCodesToFile()