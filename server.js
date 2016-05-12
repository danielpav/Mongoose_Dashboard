var express  = require('express');
var app = express();
var session = require('express-session');
app.use(session({secret: 'coding'}));
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/basic_mongoose');
var UserSchema = new mongoose.Schema({
	name: String,
	family: String,
	habitat: String,
	created_at: Date,
});
mongoose.model('Animal', UserSchema);
var Animal = mongoose.model('Animal');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());
var path = require('path');

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res){
	Animal.find({}, function(err, animals){
		if(err) {
			console.log('something went wrong');
		}
		else {
			res.render('index.ejs', {animals: animals, error: req.session.error});
		}
	})
})
app.get('/mongooses/:id', function(req, res){
	var id = req.params.id;
	Animal.find({_id: id}, function(err, animal){
		if(err){
			console.log('something went wrong')
		}
		else {
			console.log(animal);
			res.render('mongoose.ejs', {animal: animal});
		}
	})
})
app.get('/new', function(req, res){
	res.render('new.ejs');
})
app.post('/mongooses', function(req, res){
	if ((req.body.name.length < 1 ) || (req.body.habitat.length < 1)) {
		req.session.error = 'error: blank field';
		res.redirect('/', {error: req.session.error});
	}
	else {
		req.session.error = null;
		var animal = new Animal({ name: req.body.name, family: req.body.family, habitat: req.body.habitat, created_at: Date.now() });
		animal.save(function(err){
			if (err) {
				console.log('something went wrong');
			}
			else {
				console.log('successfully added an animal');
			}
		})
		res.redirect('/'), {error: req.session.error};
	}
})
app.post('/mongooses/:id/edit', function(req, res){
	var id = req.params.id;
	Animal.find({_id: id}, function(err, animal){
		if(err) {
			console.log('something went wrong');
		}
		else {
			res.render('edit', {animal: animal});
		}
	})
})
app.post('/mongooses/:id', function(req, res){
	var id = req.params.id;
	var name = req.body.name;
	var habitat = req.body.habitat;
	var family = req.body.family;
	if (req.body.name.length > 0) {
		Animal.update({_id: id}, {name: name}, function(err){
			console.log('update error');
		})
	}
	if (req.body.habitat.length > 0) {
		Animal.update({_id: id}, {habitat: habitat}, function(err){
			console.log('update error');
		})
	}
	if (req.body.family.length > 0) {
		Animal.update({_id: id}, {family: family}, function(err){
			console.log('update error');
		})
	}
	res.redirect('/');
})
app.post('/mongooses/:id/destroy', function(req, res){
	var id = req.params.id;
	Animal.remove({_id: id,}, function(err){
		console.log('destroy failed');
	})
	res.redirect('/');
})

app.listen(8000, function(){
	console.log('listening on port 8000');
})