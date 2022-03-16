// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const exampleSchema = new Schema(
	{
		name: { type: String, required: true },
        dose: { type: Number, required: true },
		taken: { type: Boolean, required: true },
		notes: { type: String, required: true },
		owner: {
			type: Schema.Types.ObjectID,
			ref: 'User',
		}
	},
	{ timestamps: true }
)

const Example = model('Example', exampleSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Example
