const express = require('express');
const router = express.Router(); //servidor
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn,(req, res) => {
    //res.send('formulario');
    res.render('links/add'); //llamas a la vista, que no es un html es un hbs
});

// push data:write
router.post('/add', async (req, res) => { //async, se utiliza cuando se hace una consulta sql
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description,
        user_id:req.user.id
    };
    console.log(newLink);
    await pool.query('INSERT INTO links set ?', [newLink]); //await es para que no siga leyendo el codigo hasta procesar la consulta SQL
    //res.send('received');
    req.flash('success', 'Link Saved Successfully');
    res.redirect('/links');
});

//pull data:read | mostrar la data de tb_links
router.get('/', isLoggedIn, async (req, res) => {
    const links_w = await pool.query('SELECT * FROM links WHERE user_id = ?',[req.user.id]);

    res.render('links/list', { links:links_w }); //llamas a la vista, links es el objeto de la vista hbs y links_w es el objeto del SQL
});

//delete
router.get('/delete/:id',isLoggedIn, async (req, res) => {
     //console.log(req.params.id);
     const { id } = req.params;
     await pool.query('DELETE FROM links WHERE ID = ?', [id]);
     req.flash('success', 'Link Removed Successfully');
     res.redirect('/links');
});

//pull data:read | pull data BD del link que quieres editar
router.get('/edit/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const links_server = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    //console.log(links_server);
    res.render('links/edit', {link: links_server[0]}); // links_server[0], para tomar solo la primera fila
});

// push data:write | push data para actualizar/edit la data en DB
router.post('/edit/:id', async (req, res) => { //async, se utiliza cuando se hace una consulta sql
    const { id } = req.params;
    const { title, url, description } = req.body;
    const updatedLink = {
        title,
        url,
        description
    };
    console.log(updatedLink);
    await pool.query('UPDATE links SET ? WHERE ID = ?', [updatedLink,id]);
    req.flash('success', 'updated link Successfully');
    res.redirect('/links');
});

module.exports = router;
