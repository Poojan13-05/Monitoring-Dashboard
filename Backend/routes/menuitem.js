const router = require("express").Router()
const MenuItem = require("../models/MenuItem")

router.post("/additem", async (req,res)=>{
    try{
        const newItem = new MenuItem({
            name:req.body.name,
            description:req.body.description,
            price:req.body.price,
            image:req.body.image
        })

        const item = await newItem.save();
        res.status(200).json(item);
    } catch (err) {
        // Added consistent JSON structure for error handling
        res.status(500).json(err);
        //console.log(err);
    }
    

})

router.get("/", async (req, res) => {
    try {
        const menuitems = await MenuItem.find();
        res.status(200).json(menuitems);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;