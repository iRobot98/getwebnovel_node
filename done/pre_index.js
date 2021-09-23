const https = require('https')




function general_function_1() {
    const options = {
        hostname: 'example.com',
        port: 443,
        path: '/todos',
        method: 'GET'
    }

    const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)

        res.on('data', d => {
            process.stdout.write(d)
        })
    })

    req.on('error', error => {
        console.error(error)
    })

    req.end()
}

function general_function_2() {
    const target = "https://boxnovel.com/novel/the-legendary-mechanic-boxnovel/chapter-55/"

    https.get(target, res => {
        res.on('data', d => {
            process.stdout.write(d)
        })
    })
}

function my_test() {
    var data = Array();
    for (let i = 0; i < 100; i++) {
        data.push("");
        let j = i;
        const target = `https://boxnovel.com/novel/the-legendary-mechanic-boxnovel/chapter-${j}/`
        https.get(target, res => {
            res.on('data', d => {
                data[j] = d;
            })
        }).on('error', error => {
            console.error(`${j} ${error}`)
        })
    }

    data.forEach(item => console.log(item))
}

// my_test()

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

async function AsyncTest() {
    const test_func = (target) => {
        return new Promise((resolve, reject) => {
            https.get(target, res => {
                res.on('data', d => {
                    resolve(d)
                })
            }).on('error', error => {
                reject(error)
            })
        })
    }
    let data = Array();
    for (let i = 0; i < 100; i++) {
        await delay(200)
        test_func(`https://boxnovel.com/novel/the-legendary-mechanic-boxnovel/chapter-${i}/`).then((res) => data.push(String(res)), (err) => console.log(err))
    }

    return data;
}

AsyncTest().then(value => console.log(value))

async function trial_1() {
    // `https://boxnovel.com/novel/the-legendary-mechanic-boxnovel/chapter-${i}/`
    const test_func = (target) => {
        return new Promise((resolve, reject) => {
            https.get(target, res => {
                res.on('data', d => {
                    resolve(d)
                })
            }).on('error', error => {
                reject(err)
            })
        })
    }

    let result = test_func(`https://boxnovel.com/novel/the-legendary-mechanic-boxnovel/chapter-1/`)
    const res = await result
    console.log(res)
}

// trial()

function trial_2() {

    https.get('https://jsonplaceholder.typicode.com/users', res => {
        let data = [];
        const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
        console.log('Status Code:', res.statusCode);
        console.log('Date in Response header:', headerDate);

        res.on('data', chunk => {
            data.push(chunk);
        });

        res.on('end', () => {
            console.log('Response ended: ');
            const users = JSON.parse(Buffer.concat(data).toString());

            for (user of users) {
                console.log(`Got user with id: ${user.id}, name: ${user.name}`);
            }
        });
    }).on('error', err => {
        console.log('Error: ', err.message);
    });
}


async function get_novel_promise_func({ base_uri, name } = {
    base_uri: "https://boxnovel.com/novel/",
    name: "the-legendary-mechanic-boxnovel",

}, start = 1, end = 1000) {
    let data = Array();
    let the_err = []
    return new Promise(async(resolve, reject) => {
        for (let i = start; i < end; i++) {
            await delay(300)
            get_promise_func(`${base_uri}/${name}/chapter-${i}/`)
                .then((res) => data.push({
                    name: `ch_${i}`,
                    content: String(res),
                }), (err) => console.log(err)).catch((err) => {
                    the_err.push(err)
                    console.log(err)
                }).finally(() => {
                    try {
                        resolve(data)
                        if (the_err.length > 0) {
                            throw the_err
                        }
                    } catch (err) {
                        reject(err)
                    }
                })
        }
    })
}

function test_3(data = [], folderName = 'Users/Joe/Test') {

    const step_1 = folderName.split("/").unshift("Output")
    let step_2 = ""
    let cnt = 0;
    step_1.forEach(name_let => {
        console.log(name_let)
        const folderName = (++cnt === 1 ? name_let : `${step_2}/${name_let}`)
        console.log(folderName)
        try {
            if (!fs.existsSync(folderName)) {
                fs.mkdirSync(folderName)
                step_2 = folderName
            }
        } catch (err) {
            console.error(err)
        }
    })
    data.forEach(({ name, content }) => {
        fs.writeFile(`./${step_2}/${name}.txt`, content, err => {
            if (err) {
                console.error(err)
                return
            }
            //file written successfully
        })
    })

}

const test_6 = () => {
    const j = []
    get_novel_promise_func({
            base_uri: "https://boxnovel.com/novel/",
            name: "the-legendary-mechanic-boxnovel",

        }, start = 1, end = 5)
        .then(value => j.push(value))
        .finally(() => test_3(j))


}

// test_6()