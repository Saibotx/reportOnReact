import path from 'path';
import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import React from 'react';
import ReactDOMServer from 'react-dom/server';

import routes from './src/routes';
import {
  setupReducers,
  renderHTMLString,
} from '@sketchpixy/rubix/lib/node/redux-router';
import RubixAssetMiddleware from '@sketchpixy/rubix/lib/node/RubixAssetMiddleware';


import reducers from './src/redux/reducers';
setupReducers(reducers);

const port = process.env.PORT || 8080;

let app = express();
app.use(compression());
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), 'public')));
app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'pug');

function renderHTML(req, res) {
  renderHTMLString(routes, req, (error, redirectLocation, html) => {
    if (error) {
      if (error.message === 'Not found') {
        res.status(404).send(error.message);
      } else {
        res.status(500).send(error.message);
      }
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else {
      res.render('index', {
        content: html
      });
    }
  });
}

/** BEGIN X-EDITABLE ROUTES */

app.get('/xeditable/groups', function(req, res) {
  res.send([
    {value: 0, text: 'Guest'},
    {value: 1, text: 'Service'},
    {value: 2, text: 'Customer'},
    {value: 3, text: 'Operator'},
    {value: 4, text: 'Support'},
    {value: 5, text: 'Admin'}
  ]);
});

app.get('/xeditable/status', function(req, res) {
  res.status(500).end();
});

app.post('/xeditable/address', function(req, res) {
  res.status(200).end();
});

app.post('/dropzone/file-upload', function(req, res) {
  res.status(200).end();
});

/** END X-EDITABLE ROUTES */

app.post('/dropzone/file-upload', function(req, res) {
  res.status(200).end();
});

app.get('/', RubixAssetMiddleware('ltr'), (req, res, next) => {
  renderHTML(req, res);
});

app.get('/ltr/*', RubixAssetMiddleware('ltr'), (req, res, next) => {
  renderHTML(req, res);
});

app.get('/rtl/*', RubixAssetMiddleware('rtl'), (req, res, next) => {
  renderHTML(req, res);
});

app.listen(port, () => {
  console.log(`Node.js app is running at http://localhost:${port}/`);
});
