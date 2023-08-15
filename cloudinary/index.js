const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'CampScape',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
})
const url = cloudinary.url("olympic_flag", {
    width: 100,
    height: 150,
    crop: 'fill'
});


module.exports = {
    cloudinary,
    storage
}

    // < div class="d-flex flex-wrap" >
    //             <% campground.images.forEach(function (img, i) { %>
    //             <div class="card mb-3" style="width: 18rem;">
    //                 <img src="<%= img.thumbnail %>" class="img-thumbnail card-img-top mb-3" alt="">
    //                 <div class="d-flex align-items-end justify-content-center" style="height: 100%;"">
    //                     <input type=" radio" class="btn-check" name="deleteImages[]" id="image-<%= i %>"
    //                     autocomplete="off" value="<%= img.filename %>">
    //                     <label class="btn btn-outline-danger" for="image-<%= i %>">Delete Photo</label>
    //                 </div>
    //             </div>
    //             <% }) %>
    //         </div >