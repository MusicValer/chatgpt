const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));

// In-memory data store
let courseId = 1;
let itemId = 1;
const courses = [];

// Home page listing courses
app.get('/', (req, res) => {
  res.render('index', { courses });
});

// New course form
app.get('/courses/new', (req, res) => {
  res.render('new_course');
});

// Create course
app.post('/courses', (req, res) => {
  const course = { id: courseId++, name: req.body.name, tasks: [], tests: [], solutions: [] };
  courses.push(course);
  res.redirect('/');
});

// Show course details
app.get('/courses/:id', (req, res) => {
  const course = courses.find(c => c.id == req.params.id);
  if (!course) return res.status(404).send('Course not found');
  res.render('course', { course });
});

// Delete course
app.post('/courses/:id/delete', (req, res) => {
  const index = courses.findIndex(c => c.id == req.params.id);
  if (index !== -1) courses.splice(index, 1);
  res.redirect('/');
});

function newItem(type) {
  return (req, res) => {
    const course = courses.find(c => c.id == req.params.id);
    if (!course) return res.status(404).send('Course not found');
    res.render('new_item', { course, type, typeLower: type.toLowerCase() });
  };
}

function createItem(type) {
  return (req, res) => {
    const course = courses.find(c => c.id == req.params.id);
    if (!course) return res.status(404).send('Course not found');
    course[type.toLowerCase() + 's'].push({ id: itemId++, title: req.body.title });
    res.redirect('/courses/' + course.id);
  };
}

function editItem(type) {
  return (req, res) => {
    const course = courses.find(c => c.id == req.params.id);
    if (!course) return res.status(404).send('Course not found');
    const item = course[type.toLowerCase() + 's'].find(i => i.id == req.params.itemId);
    if (!item) return res.status(404).send('Not found');
    res.render('edit_item', { course, item, type, typeLower: type.toLowerCase() });
  };
}

function updateItem(type) {
  return (req, res) => {
    const course = courses.find(c => c.id == req.params.id);
    if (!course) return res.status(404).send('Course not found');
    const item = course[type.toLowerCase() + 's'].find(i => i.id == req.params.itemId);
    if (!item) return res.status(404).send('Not found');
    item.title = req.body.title;
    res.redirect('/courses/' + course.id);
  };
}

function deleteItem(type) {
  return (req, res) => {
    const course = courses.find(c => c.id == req.params.id);
    if (!course) return res.status(404).send('Course not found');
    const index = course[type.toLowerCase() + 's'].findIndex(i => i.id == req.params.itemId);
    if (index !== -1) course[type.toLowerCase() + 's'].splice(index, 1);
    res.redirect('/courses/' + course.id);
  };
}

['task', 'test', 'solution'].forEach(type => {
  app.get(`/courses/:id/${type}s/new`, newItem(type.charAt(0).toUpperCase() + type.slice(1)));
  app.post(`/courses/:id/${type}s`, createItem(type.charAt(0).toUpperCase() + type.slice(1)));
  app.get(`/courses/:id/${type}s/:itemId/edit`, editItem(type.charAt(0).toUpperCase() + type.slice(1)));
  app.post(`/courses/:id/${type}s/:itemId`, updateItem(type.charAt(0).toUpperCase() + type.slice(1)));
  app.post(`/courses/:id/${type}s/:itemId/delete`, deleteItem(type.charAt(0).toUpperCase() + type.slice(1)));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Schoolfinity app listening on port ${PORT}`));
