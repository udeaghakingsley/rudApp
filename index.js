const express = require('express');
const app = express ();
const port = 5000;



const mongoose = require ('mongoose');
const connectionString = 'mongodb://localhost:27017';


app.use(express.json());

mongoose.connect(connectionString, {
    useUnifiedTopology:true,
    useNewUrlParser: true
}, (err) => {
    if (err){
        console.log({err})
    } else {
        console.log("DataBase Connected!")
    }
});

//create scheme
const CrudGengSchema = new mongoose.Schema({
    name: String,
    mail: String,
    netWorth: Number,
    countryOfOrigin: String
});


const CrudGeng = mongoose.model('CrudGeng', CrudGengSchema);

//POST request to /geng to create a new crud geng member
app.post('/crudGengs', function(req, res){
    //get new geng member details from req body
    CrudGeng.create ({
        name: req.body.name,
        mail: req.body.mail,
        netWorth: req.body.netWorth,
        countryOfOrigin: req.body.countryOfOrigin
    }, (err, newCrudGeng)=>{
        if (err) {
            return res.status(500).json({message: err})
        } else {
            return res.status(200).json({message: "new geng member created", newCrudGeng})
        }
    })
})

//GET request to find by ID
app.get('/crudGengs/:id', (req, res) => {
    CrudGeng.findById(req.params.id, (err, crudGeng) =>{
        if (err) {
            return res.status(500).json({message: err})
        }
        else if (!crudGeng) {
            return res.status(404).json({message: "memeber not found"})
        }
        else {
            return res.status(200).json({crudGeng})
        }
    })
})

//UPDATE request using findByIdAndUpdate 
app.put('/crudGengs/:id', (req, res) => {
    CrudGeng.findByIdAndUpdate(req.params.id, {
     name: req.body.name,
     mail: req.body.mail
    }, (err, crudGeng) =>{
        if (err) {
            return res.status(500).json({message: err})
        }
        else if (!crudGeng) {
            return res.status(404).json({message: "memeber not found"})
        }
        else {
            crudGeng.save((err, savedCrudGeng) =>{
                if (err){
                    return res.status(400).json({message: err})
                }else{
                    return res.status (200).json({message: 'geng details updated'})
                }
            })
        }
    })
})

//Delete request using findByIdAndDelete
app.delete('/crudGengs/:id', (req, res) =>{
    CrudGeng.findByIdAndDelete(req.params.id, (err, crudGeng) =>{
        if (err){
            return res.status(500).json({message: err})
        }
        else if (!crudGeng) {
            return res.status(404).json({message: 'Record not found'})
        }
        else {
            return res.status(200).json({message: 'Details Deleted Succesfully'})
        }
    })
})
app.listen(port, function(){
    console.log(`App listening on port ${port}`)
});