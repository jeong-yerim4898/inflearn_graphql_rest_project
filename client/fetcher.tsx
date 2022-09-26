import axios from "axios";

axios.defaults.baseURL = 'http://localhost:8000';

const fetcher = async (method,url,...rest) => {
    const res = await axios[method](url,...rest);
    return res.data;
}

// export default fetcher;

/*
...rest 쓴이유 method에 따라 1개 or 2개가 들어올수 있기 떄문
get : axios.get(url[, config])
delete : axios.delete(url[, config])
post: axios.post(url, data[, config])
put: axios.put(url, data[, config])
*/