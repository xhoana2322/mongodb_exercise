const mongoose = require('mongoose');

const animaliSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'Il nome di un animale è obbligatorio'],
        unique: true,
        maxlength: [30, 'Il nome di un animale deve avere massimo 40 caratteri'],
        minlength: [2, 'Il nome di un animale deve avere minimo 2 caratteri']
    },
    descrizione: {
        type: String,
        required: [true, 'La descrizione di un animale è obbligatoria'],
        maxlength: [255, 'La descrizione di un animale deve avere massimo 255 caratteri'],
    },
    eta: {
        type: Number,
        required: [true, 'L\'eta di un animale è obbligatoria'],
        min: [1, 'L\'eta dell\' animale deve essere maggiore di 0'],
        max: [200, 'L\'eta dell\' animale deve essere minore di 200']
    },
    specie: {
        type: String,
        required: [true, 'La specie di un animale è obbligatoria'],
        enum: {
            values: ['terrestre', 'acquatico', 'mammifero', 'reptili', 'anfibi'],
            message: ['La specie inserita non è valida']
        }
    }
},
{
    toJson: {virtuals: true},
    toObject: {virtuals: true}
});

const Animali = mongoose.model('Animali', animaliSchema);

module.exports = Animali;