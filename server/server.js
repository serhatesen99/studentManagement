const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'serhat',
  database: 'studentmanagement'
});

connection.connect(err => {
  if (err) {
    console.error('MySQL ile bağlantı kurulurken hata oluştu:', err);
    return;
  }
  console.log('MySQL ile bağlantı kuruldu');
});



app.get('/api/students', (req, res) => {
    const selectQuery = `SELECT * FROM student`;
    connection.query(selectQuery, (err, result) => {
      if (err) {
        console.error('Öğrenci bilgileri getirilirken bir hata oluştu:', err);
        res.status(500).send('Öğrenci bilgileri getirilirken bir hata oluştu');
        return;
      }
      res.status(200).send(result);
    });
  });
  
 
app.post('/api/students', (req, res) => {
    const { Name, Id, ClassId } = req.body;
    const convertedClassId = ClassId === 'A' ? 1 : 2;
    const insertQuery = `INSERT INTO student (Name, Id, ClassId) VALUES ('${Name}', '${Id}', '${convertedClassId}')`;
    connection.query(insertQuery, (err, result) => {
      if (err) {
        console.error('Öğrenci eklenirken bir hata oluştu:', err);
        res.status(500).send('Öğrenci eklenirken bir hata oluştu');
        return;
      }
      res.status(201).send(result);
    });
});

  


app.delete('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const deleteQuery = `DELETE FROM student WHERE id = ${id}`;
  connection.query(deleteQuery, (err, result) => {
    if (err) {
      console.error('Öğrenci silinirken bir hata oluştu:', err);
      res.status(500).send('Öğrenci silinirken bir hata oluştu');
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send('Öğrenci bulunamadı');
      return;
    }
    res.status(204).send();
  });
});


app.put('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const { Name, Id, ClassId } = req.body;
  const convertedClassId = ClassId === 'A' ? 1 : 2;
  const updateQuery = `UPDATE student SET Name='${Name}', Id='${Id}', ClassId='${convertedClassId}' WHERE Id=${id}`;
  connection.query(updateQuery, (err, result) => {
    if (err) {
      console.error('Öğrenci güncellenirken bir hata oluştu:', err);
      res.status(500).send('Öğrenci güncellenirken bir hata oluştu');
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send('Öğrenci bulunamadı');
      return;
    }
    res.status(200).send(result);
  });
});


app.listen(port, () => console.log(`Sunucu ${port} portunda çalışıyor`));


