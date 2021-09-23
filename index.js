const https = require('https');
const fs = require('fs');
const utf8 = require('utf8');

const getBinary = (graphPath, asBuffer = false, cb) => {
    let readStream = fs.createReadStream(graphPath)
    let data = ''

    // set stream encoding to binary so chunks are kept in binary
    readStream.setEncoding('binary')
    readStream.once('error', err => {
        return cb(err)
    })
    readStream.on('data', chunk => (data += utf8.encode(chunk)))
    readStream.on('end', () => {
        // If you need the binary data as a Buffer
        // create one from data chunks       
        return cb(null, asBuffer ? Buffer.from(data, 'binary') : data)
    })
}

function get_promise_func(target_url) {
    return new Promise((resolve, reject) => {
        console.log("hi")
        https.get(target_url, res => {
            // create buffer
            let data = ''

            // read from response buffer
            res.on('data', chunk => (data += chunk))

            // resolve when response end reached
            res.on('end', () => {
                resolve(String(data))
            })

        }).on('error', error => {
            reject(error)
            console.log("rejected")
        })
    })
}

function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }


// takes 3 params: end (last chapter to read), start (first chapter to read), { base_uri, name }( uri information)
async function get_novel_promise_func(end = 15, start = 1, { base_uri, name } = {
    base_uri: "https://boxnovel.com/novel",
    name: "the-legendary-mechanic-boxnovel",

}) {
    //create the success array (for successfull reads)
    let data = Array();
    // create the error array (for errors during read, these will occur asynchronously)
    let the_err = Array();


    for (let i = start; i < (end + 1); i++) {
        await delay(1000) // to avoid indirect DDoS

        get_promise_func(`${base_uri}/${name}/chapter-${i}/`) // will return a promise that'll resolve to the data
            .then((res) => {
                let response = {
                    name: `ch_${i}`, // create a unique identifier name
                    content: Buffer.from(res, 'utf-8').toString(), // change bufferStream to string
                }
                console.log(response.name, "downloaded \n", i) // console.log the success
                data.push(response)
            }, (err) => console.log(err))
            .catch((err) => {
                the_err.push(err)
                console.log("error: ", err) // console.log the error
            })
    }
    console.log((await data[1]), "\nhi")
    return { //compact them into one data
        success: data,
        errors: the_err,
    }
}

// get_novel_promise_func(100)

function isIterable(value) {
    return Symbol.iterator in Object(value);
}

function CreateFolder(folderName = 'Output/Novel/Joe/Test') {
    let step_1 = folderName.split("/")
    let step_2 = ""
    let cnt = 0;
    step_1.forEach(name_let => {
        console.log(name_let)
        const folderName = (++cnt === 1 ? name_let : `${step_2}/${name_let}`)
        console.log(folderName)
        try {
            if (!fs.existsSync(folderName)) {
                fs.mkdirSync(folderName)

            }
            step_2 = folderName
        } catch (err) {
            console.error(err)
        }
    })

    return step_2
}



async function Write_To_File(data = { success: [], errors: [] }, folderName = 'Joe/Test') {
    const TargetFolderName = `Output/Novel/${folderName}`
    folderName = CreateFolder(TargetFolderName)
    let { success, errors } = await data
    success.forEach(async(prom) => {
        let { name, content } = await prom
        console.log(name, "in test_3")
        fs.writeFile(`./${folderName}/${name}.html`, content, { flag: 'w' }, err => {
            if (err) {
                console.error(err)
                return
            }
            //file written successfully
        })
    })
    errors.forEach(async(prom, err_in) => {
        let content = await prom

        fs.writeFile(`./${folderName}/errors.txt`, (err_in + ":\n" + content + "\n\n"), { flag: 'a+' }, err => {
            if (err) {
                console.error(err)
                return
            }
            //file written successfully
        })
    })
    return "success"

}
console.log(Write_To_File(get_novel_promise_func(1500), "Legendary_Mechanic"))