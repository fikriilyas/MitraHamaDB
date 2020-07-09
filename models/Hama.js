const mongoose = require('mongoose')

const HamaSchema = new mongoose.Schema({
    hama: {
        type: String,
        required: true,
        trim: true
    },
    tanaman: {
        type: String,
        required: true,
    },
    obat: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    gambar: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Hama', HamaSchema)