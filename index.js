const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const moment = require('moment');

const AppError = require('./src/util/AppError');
const app = express();

//setup the views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

//setup the parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//setup the override
app.use(methodOverride('_method'));

//routes
app.use('/blog/categories', require('./src/routes/categories.route'));
app.use('/blog', require('./src/routes/posts.route'));

//redirect to blog list
app.get('/', (req, res) => {
  res.redirect('/blog');
});

const handleValidationErr = err => {
  // console.dir(err);
  //In a real app, we would do a lot more here...
  return new AppError(`Validation Failed... ${err.message}`, 400);
}

//single out the particular Mongoose Error type
app.use((err, req, res, next) => {
  if(err.name === 'ValidationError') err = handleValidationErr(err)
  next(err);
});

//add moment to ejs
app.locals.moment = moment;

//catch all error middleware
app.use((err, req, res, next) => {
  const { status = 500, message = 'Something went wrong'} = err;
  res.status(status).send(message);
});

//connect to db and express
mongoose
  .connect("mongodb://127.0.0.1:27017/blog", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("Connected to Database!");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))
  })
  .catch((err) => {
    console.log(err);
  });
