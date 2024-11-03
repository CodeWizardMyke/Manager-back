const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const app = express();

// view engine setup
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/src/public')));
app.use(cors())

const product_crud_router = require('./src/routes/product_crud_router');
const product_search_router = require('./src/routes/product_search_router');
const employee_crud_router = require('./src/routes/employee_crud_router');
const employee_search_router = require('./src/routes/employee_search_router');
const employee_auth_router = require('./src/routes/employee_auth_router');
const client_crud_router = require('./src/routes/client_crud_router');
const cart_search_router = require('./src/routes/cart_search_router');
const cart_crud_router = require('./src/routes/cart_crud_router');
const cart_item_crud_router = require('./src/routes/cart_item_crud_router');
const client_search_router = require('./src/routes/client_search_router');
const client_cart_router = require('./src/routes/client_cart_router');
const category_crud_router = require('./src/routes/category_crud_router');
const brand_crud_router = require('./src/routes/brand_crud_router');

app.use('/cart', client_cart_router);
app.use('/api/auth', employee_auth_router);
app.use('/api/product/search', product_search_router);
app.use('/api/product/crud', product_crud_router);
app.use('/api/employee/crud', employee_crud_router);
app.use('/api/employee/search', employee_search_router);
app.use('/api/cart/search', cart_search_router);
app.use('/api/cart/crud', cart_crud_router);
app.use('/api/cart_item/crud', cart_item_crud_router);
app.use('/api/client/crud', client_crud_router);
app.use('/api/client/search', client_search_router);
app.use('/api/category', category_crud_router);
app.use('/api/brand', brand_crud_router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;
