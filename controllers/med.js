
  
// Import Dependencies
const express = require('express')
//setting our model to a variable so we can use it in other parts of
const Med = require('../models/med')

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

// index pharmacy
router.get('/pharmacy', (req, res) => {
	const { username, userId, loggedIn } = req.session
	res.render('API/index', { username, loggedIn })
})

// index that shows only the user's Meds
router.get('/my-meds', (req, res) => {
    // destructure user info from req.session
    const { username, userId, loggedIn } = req.session
	Med.find({ owner: userId })
		.then(meds => {
			res.render('meds/index', { meds, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// new route -> GET route that renders our page with the form
router.get('/new', (req, res) => {
	const { username, userId, loggedIn } = req.session
	res.render('meds/new', { username, loggedIn })
})

// create -> POST route that actually calls the db and makes a new document
router.post('/', (req, res) => {
	req.body.taken = req.body.taken === 'on' ? true : false

	req.body.owner = req.session.userId
	Med.create(req.body)
		.then(med => {
			console.log('this was returned from create', med)
			res.redirect('med/my-meds')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
	// we need to get the id
	const { username, userId, loggedIn } = req.session
	const medId = req.params.id
	Med.findById(medId)
		.then(med => {
			res.render('meds/edit', { med, username, loggedIn })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})



// update route
router.put('/:id', (req, res) => {
	const medId = req.params.id
	req.body.taken = req.body.taken === 'on' ? true : false

	Med.findByIdAndUpdate(medId, req.body, { new: true })
		.then(med => {
			res.redirect(`/med/my-meds`)
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// show route
router.get('/:id', (req, res) => {
	const medId = req.params.id
	Med.findById(medId)
		.then(med => {
            const {username, loggedIn, userId} = req.session
			res.render('meds/show', { med, username, loggedIn, userId })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// delete route
router.delete('/:id', (req, res) => {
	const medId = req.params.id
	Med.findByIdAndRemove(medId)
		.then(med => {
			res.redirect('/med/my-meds')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// Export the Router
module.exports = router