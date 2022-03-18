// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const glucoseSchema = new Schema(
	{
		date: { type: Number, required: true },
        value: { type: Number, required: true },
		target: { type: Number, required: true },
		notes: { type: String, required: true },
		owner: {
			type: Schema.Types.ObjectID,
			ref: 'User',
		}
	},
	{ timestamps: true }
)

const Glucose = model('Glucose', glucoseSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Glucose
