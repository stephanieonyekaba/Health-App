// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const medSchema = new Schema(
	{
		name: { type: String, required: true },
        dose: { type: Number,  required: true },
		taken: { type: Boolean, required: true },
		notes: { type: String, required: false },
		date: { type: Number, required: true },
		owner: {
			type: Schema.Types.ObjectID,
			ref: 'User',
		}
	},
	{ timestamps: true }
)

const Med = model('Med', medSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Med
