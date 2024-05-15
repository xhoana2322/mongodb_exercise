const Animali = require('../model/animaliModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

class APIAnimali {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    };

    filter() {
        const queryBody = {...this.queryString};
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach(el => delete queryBody[el]);

        let queryStr = JSON.stringify(queryBody);
        // replace per passare query leggibili con il $ a mongoose
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`);
        
        this.query.find(JSON.parse(queryStr));

        return this;
    };

    sort() {
        if(this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        };

        return this;
    };

    limitFields() {
        if(this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        };

        return this;
    };

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        // sottriamo di uno la pagina corrente e la moltiplichiamo per il numero 
        // degli elementi (limit) per sapere quanti elementi skippare per la pagina successiva
            const skip = (page - 1) * limit;  

        this.query = this.query.skip(skip).limit(limit);

        if(this.queryString.page) {
            const numAnimali = Animali.countDocuments();
            if(skip >= numAnimali) throw new Error('Questa pagina non esiste');
        };

        return this;
    };

};


exports.getAllAnimali = catchAsync(async (req, res) => {

    console.log(req.query);

    const istanza = new APIAnimali(Animali.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    
    const animali = await istanza.query;

    res.status(200).json({
        status: 'success',
        data: {
            animali: animali
        }
    });  
});



exports.createAnimale = catchAsync(async (req, res) => {

    const newAnimali = await Animali.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            animali: newAnimali
        }
    });  
});

// exports.createAnimale = async (req, res) => {

//     // console.log('ciao');
//     try {

//         // const newAnimal = {
//         //     "nome": "Orso polare",
//         //     "descrizione": "Orsone felicione",
//         //     "eta": 64,
//         //     "specie": "Cazzo ne so"
//         // }

//       const newAnimali = await Animali.create(req.body);

//         res.status(201).json({
//             status: 'success',
//             data: {
//                 animali: newAnimali
//             }
//         });  

//     } catch(err) {
//         res.status(400).json({
//             status: 'fail',
//             message: err
//         });
//     }
// };


exports.getSingleAnimale = catchAsync(async (req, res) => {

    const animale = await Animali.findById(req.params.id);

    // if(!animale) {
    //     res.status(404).json ({
    //         status: 'fail',
    //         message: 'animale non trovato'
    //     })
    // }

    if(!animale) {
        return next(new AppError('No animal found with that ID', 404));
    }

    res.status(200).json ({
        status: 'success',
        data: animale
    })

});


exports.updateAnimali = catchAsync(async (req, res) => {


    const updateAnimali = await Animali.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if(!updateAnimali) {
        return next(new AppError('No animal found with that ID', 404));
    }

    res.status(200).json ({
        status: 'success',
        data: {
            animali: updateAnimali
        }
    })

});

exports.deleteAnimale = catchAsync(async (req, res) => {

    let animale = await Animali.findByIdAndDelete(req.params.id);

    if(!animale) {
        return next(new AppError('No animal found with that ID', 404));
    };

    res.status(204).json ({
        status: 'success',
        data: null
    })

});