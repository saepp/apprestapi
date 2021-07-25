const connection = require("../koneksi");
const mysql = require("mysql");
const md5 = require("md5");
const response = require("../res");
const jwt = require("jsonwebtoken");
const config = require("../config/secret");
const ip = require("ip");

// controller untuk register
exports.registrasi = function (req, res) {
  const post = {
    username: req.body.username,
    email: req.body.email,
    password: md5(req.body.password),
    role: req.body.role,
    tanggal_daftar: new Date(),
  };

  let query = "SELECT email FROM ?? WHERE ??=?";
  const table = ["user", "email", post.email];

  query = mysql.format(query, table);

  connection.query(query, function (error, rows) {
    if (error) {
      console.log(error);
    } else {
      if (rows.length === 0) {
        let query = "INSERT INTO ?? SET ?";
        const table = ["user"];
        query = mysql.format(query, table);
        connection.query(query, post, function (error, rows) {
          if (error) {
            console.log(error);
          } else {
            response.ok("Berhasil menambahkan data user baru", res);
          }
        });
      } else {
        response.ok("Email sudah terdaftar", res);
      }
    }
  });
};

// controller untuk login
exports.login = function (req, res) {
  const post = {
    password: req.body.password,
    email: req.body.email,
  };

  let query = "SELECT * FROM ?? WHERE ??=? AND ??=?";
  const table = ["user", "password", md5(post.password), "email", post.email];

  query = mysql.format(query, table);
  connection.query(query, function (error, rows) {
    if (error) {
      console.log(error);
    } else {
      if (rows.length == 1) {
        let token = jwt.sign({ rows }, config.secret, {
          expiresIn: 1440,
        });
        id_user = rows[0].id;

        const data = {
          id_user,
          access_token: token,
          ip_address: ip.address(),
        };

        let query = "INSERT INTO ?? SET ?";
        const table = ["akses_token"];

        query = mysql.format(query, table);
        connection.query(query, data, function (error, rows) {
          if (error) {
            console.log(error);
          } else {
            res.json({
              success: true,
              message: "Token JWT ter generate",
              token,
              currUser: data.id_user,
            });
          }
        });
      } else {
        res.json({
          error: true,
          message: "Email / Password salah!",
        });
      }
    }
  });
};

exports.halamanrahasia = function (req, res) {
  response.ok("Halaman ini hanya untuk user dengan role = 2!", res);
};
