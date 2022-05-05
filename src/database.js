const mysql = require('mysql');
const {promisify}=require('util');
const {database} = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err,connection)=>{
    if(err){
        if(err.code ==="PROTOCOL_CONNECTION_LOST"){
            console.error("Se cerro la conexion con la base")
        }
        if(err.code==="ECONNREFUSED"){
            console.error("Conexion a la base de datos fue rechaza")
        }
    }
    if (connection) connection.release();
    console.log("Se conecto exitosamente")
    return;
});
//Para transformar los callback a promesas
pool.query = promisify(pool.query);

module.exports = pool;


