import express from 'express'
const port = process.env.PORT || 3000;

const app = express();


app.get('/', (req, res)=>{
    
    res.send('Cliente corriendo');
})


app.listen(port, () => {
    console.log('Cliente corriendo en el puerto', port);
})


