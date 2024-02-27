module.exports = new class HomeController{
    index(req,res){
        res.status(404).json('Not Fund')
    }
}