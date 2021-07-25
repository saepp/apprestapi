const express = require("express");
const auth = require("./auth");
const router = express.Router();
const verifikasi = require("./verifikasi");

// daftarkan menu registrasi
router.post("/api/v1/register", auth.registrasi);
router.post("/api/v1/login", auth.login);

// alamat yang perlu otorisasi
router.get("/api/v1/halamanrahasia", verifikasi(2), auth.halamanrahasia);

module.exports = router;
