"use strict";

exports.ok = function (values, res) {
  const data = {
    status: 200,
    values,
  };

  res.json(data);
  res.end();
};

// response untuk nested matakuliah
exports.oknested = function (values, res) {
  // lakukan akumulasi
  const hasil = values.reduce((akumulasikan, item) => {
    // tentukan key group nya
    if (akumulasikan[item.nama]) {
      // buat variabel group nama mahasiswa
      const group = akumulasikan[item.nama];
      // cek jika isi array adalah matakuliah
      if (Array.isArray(group.matakuliah)) {
        // tambahkan value ke dalam group matakuliah
        group.matakuliah.push(item.matakuliah);
      } else {
        group.matakuliah = [group.matakuliah, item.matakuliah];
      }
    } else {
      akumulasikan[item.nama] = item;
    }
    return akumulasikan;
  }, {});

  const data = {
    status: 200,
    values: hasil,
  };

  res.json(data);
  res.end();
};
