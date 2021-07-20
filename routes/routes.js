const { poolPromise } = require('../data/config')

const router = app => {
   
    app.get('/tasks', async (req, res) => {
        try {
            const pool = await poolPromise
            const result = await pool.request()
        
            .query('WEB_RETURNQUERIES_NEW')      

            res.json(result.recordset)
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })

    app.get('/taskHistory/:taskID', async (req, res) => {
        try {
            const pool = await poolPromise
            const result = await pool.request()

            .query(`SELECT Users.Username, Users.UserID, [Datetime], [Notes] FROM [CRM_HISTORY] INNER JOIN USERS ON CRM_HISTORY.UserID = Users.UserID WHERE ([Issue_No] = ${req.params.taskID}) ORDER BY Datetime`)      

            res.json(result.recordset)
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })

    app.post('/taskHistory/:taskID', async (req, res) => {
        try {
            const pool = await poolPromise
            const result = await pool.request()
        
            .query('INSERT INTO ....<TODO>....', request.body, (error, result) => {
                if (error) throw error;
                
                response.status(201).send(`User added with ID: ${result.insertId}`);
            });      
         } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    })
}

module.exports = router;



