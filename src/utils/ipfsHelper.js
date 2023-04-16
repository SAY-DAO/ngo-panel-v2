import axios from 'axios';

export default async function fetchIpfsMetaData(hash) {
  try {
    return await axios.get(`https://cloudflare-ipfs.com/ipfs/${hash}/metadata.json`);
  } catch (errors) {
    console.error(errors);
    return 'todoItems';
  }
}
