import axios from "axios";
import {Readable} from 'stream'

const urlToFileConverter = async (url) =>{
    try {
        const validUrl = url.trim();
        if(!validUrl || !validUrl.startsWith('http')){
            throw new Error(`Invalid URL: ${validUrl}`);
        }
        const response = await axios.get(validUrl, { responseType: 'arraybuffer' });

        if (response.status!==200){
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        const contentType = response.headers['content-type'];
        const buffer = Buffer.from(response.data);

        const extension = contentType.split('/')[1];
        const filename = `image-${Date.now()}.${extension}`;

        return{
            filename,
            createReadStream: () =>{
                const readable = new Readable({
                    read(){
                        this.push(buffer);
                        this.push(null);
                    },
                });
                return readable;
            },
            mimetype: contentType,
        };
    } catch (error) {
        console.error('Error trying to convert url to file: ', error.message);
        throw error;
    }
};

export default urlToFileConverter