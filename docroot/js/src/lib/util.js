import * as D3 from 'd3';

export function readCSV(csvPath) {
    return new Promise(
        (resolve, reject) => {
            D3.csv(
                csvPath,
                (error, data) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(data);
                    }
                }
            );
        }
    )
}