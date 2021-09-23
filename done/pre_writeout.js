const fs = require('fs')


function test_1() {
    const content = 'Some content!'

    fs.writeFile('./test.txt', content, err => {
        if (err) {
            console.error(err)
            return
        }
        //file written successfully
    })
}

/* 
The flags you'll likely use are

    r+ open the file for reading and writing
    w+ open the file for reading and writing, 
        positioning the stream at the beginning of the file. 
        The file is created if it does not exist
    a open the file for writing, 
        positioning the stream at the end of the file. 
        The file is created if it does not exist
    a+ open the file for reading and writing, 
        positioning the stream at the end of the file. 
        The file is created if it does not exist
*/
function test_2() {
    fs.writeFile('/Users/joe/test.txt', content, { flag: 'a+' }, err => {})

}

function test_3() {
    const folderName = 'Users/Joe/Test'

    const step_1 = folderName.split("/")
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

}

test_3()