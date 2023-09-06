const mongoose = require('mongoose');


const BlockStateSchema = new mongoose.Schema({
    blocked: { type: Boolean, required: true },
    definitive: { type: Boolean, required: true },
    blockingDate: Date,
    expiration: Date
});

const BlockState = mongoose.model('BlockState', BlockStateSchema);


module.exports = {
    BlockStateSchema,
    BlockState
};
