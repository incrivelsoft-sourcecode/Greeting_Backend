const consoleResponse = (type, res, location) => {
    if(res.status === 200)
    {
        console.log(type, res.data.message, location);
    }
    else{
        console.log(type, res.data.error, location);
    }
}

export default consoleResponse;