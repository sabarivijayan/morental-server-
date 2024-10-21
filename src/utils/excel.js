import * as XLSX from 'xlsx'

async function getExcelBuffer(createReadStream){
    const stream = createReadStream();


    const buffer = await new Promise((resolve, reject) =>{
        const data = [];
        stream.on('data', (chunk) => data.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(data)));
        stream.on('error', reject);
    });
    return buffer;
}

async function parseExcel(buffer){
    const workbook = XLSX.read(buffer, {type: 'buffer'});
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    return data;
}
export default {getExcelBuffer, parseExcel};