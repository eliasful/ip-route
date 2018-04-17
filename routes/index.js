const express = require('express');
const router = express.Router();
const dns = require('dns');
const fs = require('fs');

router.get('/', function(req, res, next) {
  res.render('index', {title: 'Hostnames TalentRH'});
});

router.get('/hosts', async function(req, res, next) {
  let hostnames = fs.readFileSync('public/hostnames.json', 'utf8');

  return send(JSON.parse(hostnames), res);
});

router.post('/update', async function(req, res, next) {
  let hostname = req.body.hostname;
  let file = JSON.parse(fs.readFileSync('public/hostnames.json', 'utf8'));

  if (!file.includes(hostname)) {
    file.push(hostname);
    fs.writeFileSync('public/hostnames.json', JSON.stringify(file), 'utf8');
  } else {
    res.send('Esse hostname já existe!');
  }

  return send(file, res);
});

router.delete('/delete', async function(req, res, next) {
  let hostname = req.body.hostname;
  let file = JSON.parse(fs.readFileSync('public/hostnames.json', 'utf8'));

  if (file.includes(hostname)) {
    const index = file.indexOf(hostname);
    file.splice(index, 1);
    fs.writeFileSync('public/hostnames.json', JSON.stringify(file), 'utf8');
  } else {
    res.send('Esse hostname não existe!');
  }

  return send(file, res);
});

module.exports = router;

async function send(file, res) {
  let promises = file.map(hostname => lookup(hostname));
  let hosts = await Promise.all(promises);
  return res.send(hosts);
}

function lookup(hostname) {
  return new Promise((resolve, reject) =>
    dns.lookup(hostname, (err, address) => {
      return resolve({name: hostname, ip: address});
    })
  );
}
