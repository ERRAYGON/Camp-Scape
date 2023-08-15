const mongoose = require('mongoose');
const Review = require('./reviews');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    _id: { type: Schema.Types.ObjectId },
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
});


CampgroundSchema.post('findOneAndDelete', async (doc) => {
    console.log(doc);
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
});
// const CampgroundSchema = new Schema({
//     title: String,
//     image: String,
//     price: String,
//     description: String,
//     location: String
// });
module.exports = mongoose.model('Campground', CampgroundSchema);
// _id: {
//     type: Schema.Types.ObjectId,
//     immutable: true, // Prevent updates to the _id field
//     default: () => new mongoose.Types.ObjectId() // Generate a new ObjectId for new documents
// },
// retailerID: {
//     type: mongoose.SchemaTypes.ObjectId,

//         required: true,
//             index: true
// },

// module.exports = mongoose.model('Campground', CampgroundSchema);
/*

1. mongoose.model: This is a method provided by Mongoose, a popular Object - Document Mapping(ODM) library for 
    MongoDB.It is used to define a new model or retrieve an existing model from the Mongoose registry.

2. 'Campground': This is the name of the model. In this case, it is named "Campground".The model name is 
    typically singular and represents a collection in MongoDB. Mongoose will automatically pluralize it 
    and use it to interact with the corresponding MongoDB collection named "campgrounds".

3. CampgroundSchema: This is the schema or structure defined using Mongoose's Schema class. The schema specifies 
    the fields, types, and validation rules for the documents that will be stored in the "campgrounds" collection. 
    The CampgroundSchema variable is passed as the second argument to mongoose.model().

4. module.exports: This is a Node.js feature that allows you to export a value from a module.In this case, it 
    exports the result of calling mongoose.model(), making the "Campground" model available for other parts of 
    your application to use.

*/


