
  
// Import Dependencies
const express = require('express')
//setting our model to a variable so we can use it in other parts of
const Glucose = require('../models/glucose')

// Create router
const router = express.Router()

// Router Middleware
// Authorization middleware
// If you have some resources that should be accessible to everyone regardless of loggedIn status, this middleware can be moved, commented out, or deleted. 
router.use((req, res, next) => {
	// checking the loggedIn boolean of our session
	if (req.session.loggedIn) {
		// if they're logged in, go to the next thing(thats the controller)
		next()
	} else {
		// if they're not logged in, send them to the login page
		res.redirect('/auth/login')
	}
})

// Routes

// index ALL
router.get('/', (req, res) => {
	Glucose.find({})
		.then(glucoses => {
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			
			res.render('glucoses/index', { glucoses, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// index that shows only the user's Glucoses
router.get('/my-glucoses', (req, res) => {
	console.log("GET INDEX PAGE FOR MY GLUCOSES")
    // destructure user info from req.session
    const { username, userId, loggedIn } = req.session
	console.log("THIS IS TYPE OF USER ID", typeof userId)
	Glucose.find({ owner: userId })

		.then(glucoses => {
		
			res.render('glucoses/index', { glucoses, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// new route -> GET route that renders our page with the form
router.get('/new', (req, res) => {
	const { username, userId, loggedIn } = req.session
	res.render('glucoses/new', { username, loggedIn })
})

// create -> POST route that actually calls the db and makes a new document
router.post('/', (req, res) => {
	req.body.taken = req.body.taken === 'on' ? true : false

	req.body.owner = req.session.userId
	Glucose.create(req.body)
		.then(glucose => {
			console.log('this was returned from create', glucose)
			res.redirect('glucose/my-glucoses')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
	// we need to get the id
	const { username, userId, loggedIn } = req.session
	const glucoseId = req.params.id
	Glucose.findById(glucoseId)
		.then(glucose => {
			res.render('glucoses/edit', { glucose, username, loggedIn })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})


// update route
router.put('/:id', (req, res) => {
	const glucoseId = req.params.id
	req.body.taken = req.body.taken === 'on' ? true : false

	Glucose.findByIdAndUpdate(glucoseId, req.body, { new: true })
		.then(glucose => {
			res.redirect(`/glucose/my-glucoses`)
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// show route
router.get('/:id', (req, res) => {
	const glucoseId = req.params.id
	Glucose.findById(glucoseId)
		.then(glucose => {
            const {username, loggedIn, userId} = req.session
			res.render('glucoses/show', { glucose, username, loggedIn, userId })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// delete route
router.delete('/:id', (req, res) => {
	const glucoseId = req.params.id
	Glucose.findByIdAndRemove(glucoseId)
		.then(glucose => {
		res.redirect('/glucose/my-glucoses')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// Export the Router
module.exports = router