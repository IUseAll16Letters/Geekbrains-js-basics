
export function parseFileInConsole(fileRoute) {
    fs = require('fs');
    fs.readFile(fileRoute, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        for (const z of data.split('\n')) {
            if (z.includes(', //')) {
                let result = z.split(',')[0];
                if (result.includes(':')) {
                    console.log(result.split(': ')[1]);
                }
            }
        };
    });
}

