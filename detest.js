const readline = require('readline');
const Table = require('cli-table');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
const asciiArt = '\n  _______ __             __                              \n |   _   |__.--.--.-----|  .--.--.-----.----.-----.-----.\n |.  1   |  |_   _|  -__|  |  |  |  -__|   _|__ --|  -__|\n |.  ____|__|__.__|_____|__|\\___/|_____|__| |_____|_____|\n |:  |                                                     \n |::.|  v1.3  |  t.me : andraz404 / boterdrop x ADFMIDN                                 \n `---\'                                                   \n';
async function promptUser(_0x3eabdb) {
    const _0x3cf117 = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(_0x30a4c2 => _0x3cf117.question(_0x3eabdb, _0x5ec9e3 => {
        _0x3cf117.close();
        _0x30a4c2(_0x5ec9e3);
    }));
}
async function mainMenu() {
    console.clear();
    let _0x35f55c = true;
    while (_0x35f55c) {
        console.clear();
        console.log(asciiArt);
        console.log('Note:');
        console.log('Pastikan semua akun tersimpan di multi.txt');
        console.log('Pastikan sudah upgrade isi combo.txt');
        console.log('');
        console.log('1. Auto Claim & Fight');
        console.log('2. Auto Buy Pet');
        console.log('3. Auto Upgrade Pet');
        console.log('4. Auto Combo');
        console.log('5. Auto Clear Task');
        console.log('6. Exit');
        console.log('');
        console.log('Pilih Bot Yang Ingin dijalankan:');
        const _0x41019a = await promptUser('\xBB ');
        switch (_0x41019a) {
        case '1':
            await claimAndFight();
            break;
        case '2':
            await buyPet();
            break;
        case '3':
            await upgradePetTools();
            break;
        case '4':
            await combo();
            break;
        case '5':
            await clearTask();
            break;
        case '6':
            _0x35f55c = false;
            break;
        default:
            console.error('Pilihan tidak valid.');
            break;
        }
        if (_0x35f55c) {
            const _0x19a413 = await promptUser('Kembali ke menu utama? (y/n): ');
            if (_0x19a413.toLowerCase() !== 'y') {
                _0x35f55c = false;
            }
        }
    }
    console.log('Terima kasih telah menggunakan bot ini!');
}
function sleep(_0x344a7a) {
    return new Promise(_0x2c7c4b => setTimeout(_0x2c7c4b, _0x344a7a));
}
async function bacaFile() {
    try {
        const _0x41ff77 = await fs.promises.readFile('multi.txt', 'utf8');
        const _0x46dbf7 = _0x41ff77.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n\n').map(_0x4fda27 => {
            const _0x924ba0 = _0x4fda27.split('\n').map(_0x464e9b => _0x464e9b.trim());
            const _0xceac95 = _0x924ba0[0];
            const _0x37e2aa = _0x924ba0[1];
            const _0xa082ed = _0x924ba0[2];
            const _0x27c235 = _0x924ba0[3];
            return {
                initData: _0xceac95,
                secret: _0x37e2aa,
                tgId: _0xa082ed,
                username: _0x27c235
            };
        });
        return _0x46dbf7;
    } catch (_0x5f1e82) {
        console.error('Error reading file:', _0x5f1e82.message);
        throw _0x5f1e82;
    }
}
function tampilkanTabelAkunBuyPet(_0x7d81fd) {
    const _0x36858e = new Table({
        head: [
            'No',
            'ID',
            'Username'
        ],
        colWidths: [
            4,
            20,
            20
        ]
    });
    _0x7d81fd.forEach((_0x25916a, _0x304495) => {
        _0x36858e.push([
            _0x304495 + 1,
            _0x25916a.tgId,
            _0x25916a.username
        ]);
    });
    console.log('\nSilahkan pilih akun yang ingin diloginkan:');
    console.log(_0x36858e.toString());
}
function pilihAkun(_0x586a42, _0xdeeda0) {
    if (_0xdeeda0 >= 1 && _0xdeeda0 <= _0x586a42.length) {
        return _0x586a42[_0xdeeda0 - 1];
    } else {
        throw new Error('Nomor akun tidak valid.');
    }
}
async function checkPriceAndAvailability(_0x483a0c, _0x31aacd, _0xb2f318, _0x216490) {
    try {
        const _0x3c6c36 = await axios.get('https://api-clicker.pixelverse.xyz/api/pets', {
            headers: {
                Initdata: _0x483a0c,
                Secret: _0x31aacd,
                'Tg-Id': _0xb2f318,
                Username: _0x216490
            }
        });
        const _0x5d0db7 = _0x3c6c36.data.buyPrice;
        const _0x5a7ffd = new Date(_0x3c6c36.data.lastBuyAt);
        const _0x556da7 = new Date();
        const _0x2ffe53 = _0x556da7 - _0x5a7ffd;
        const _0x125280 = _0x2ffe53 / 3600000;
        if (_0x125280 >= 24) {
            console.log('\nHarga pet: ', _0x5d0db7);
            console.log('Pet tersedia untuk dibeli hari ini.');
            return true;
        } else {
            if (!_0x5a7ffd || _0x5a7ffd.toString() === 'Invalid Date') {
                console.log('\nPet tersedia untuk dibeli hari ini.');
                return true;
            } else {
                const _0x57af89 = new Date(_0x5a7ffd.getTime() + 86400000);
                console.log('\nTidak dapat membeli pet hari ini. Pet terakhir dibeli pada: ', _0x5a7ffd.toLocaleString());
                console.log('Anda dapat membeli kembali pada: ', _0x57af89.toLocaleString());
                return false;
            }
        }
    } catch (_0x142568) {
        console.error('\x1B[31mError checking price and availability:\x1B[0m', _0x142568);
        return false;
    }
}
async function checkBalance(_0x2f4d8f, _0x35ab44, _0x266450, _0x3450ef) {
    try {
        const _0x3d4bdd = await axios.get('https://api-clicker.pixelverse.xyz/api/users', {
            headers: {
                Initdata: _0x2f4d8f,
                Secret: _0x35ab44,
                'Tg-Id': _0x266450,
                Username: _0x3450ef
            }
        });
        return _0x3d4bdd.data.clicksCount;
    } catch (_0x11cc5a) {
        console.error('\x1B[31mError checking balance:\x1B[0m', _0x11cc5a);
        return -1;
    }
}
async function buyPetAction(_0x59d01f, _0x3368eb, _0x15292e, _0x1df3d3) {
    try {
        const _0x454ca7 = await axios.post('https://api-clicker.pixelverse.xyz/api/pets/buy', {}, {
            params: {
                'tg-id': _0x15292e,
                secret: 'adwawdasfajfklasjglrejnoierjboivrevioreboidwa'
            },
            headers: {
                Initdata: _0x59d01f,
                Secret: _0x3368eb,
                'Tg-Id': _0x15292e,
                Username: _0x1df3d3
            }
        });
        console.log('\n=== Buy Pet ===');
        console.log('Pet berhasil dibeli!');
        console.log('Detail Pet:');
        const _0x2b3b30 = _0x454ca7.data;
        const _0xd6509c = new Table({
            head: [
                'Name',
                'Level',
                'Energy',
                'Energy Per Second',
                'Max Energy'
            ],
            colWidths: [
                25,
                10,
                10,
                20,
                15
            ]
        });
        _0xd6509c.push([
            _0x2b3b30.pet.name,
            _0x2b3b30.level,
            _0x2b3b30.energy,
            _0x2b3b30.energyPerSecond,
            _0x2b3b30.maxEnergy
        ]);
        console.log(_0xd6509c.toString());
    } catch (_0x1bd5fa) {
        if (_0x1bd5fa.response && _0x1bd5fa.response.data && _0x1bd5fa.response.data.code === 'BadRequestException') {
            console.log('\nKesempatan untuk beli sudah habis. Tunggu hingga waktu lokal ', new Date().toLocaleString(), ' untuk dapat membeli kembali.');
        } else {
            console.error('\x1B[31mError buying pet:\x1B[0m', _0x1bd5fa);
        }
    }
}
async function buyPet() {
    console.log('Menjalankan Auto Buy Pet...');
    try {
        const _0x16afc3 = await bacaFile();
        tampilkanTabelAkunBuyPet(_0x16afc3);
        const _0x2dc9ea = await promptUser('\nLakukan Mass Buy kepada seluruh akun? (y/n): ');
        if (_0x2dc9ea.toLowerCase() === 'y') {
            console.clear();
            for (const _0x1b3719 of _0x16afc3) {
                const {
                    initData: _0x3fc5c7,
                    secret: _0x346870,
                    tgId: _0x3bc11a,
                    username: _0x228ace
                } = _0x1b3719;
                const _0x819be0 = await axios.get('https://api-clicker.pixelverse.xyz/api/users', {
                    headers: {
                        Initdata: _0x3fc5c7,
                        Secret: _0x346870,
                        'Tg-Id': _0x3bc11a,
                        Username: _0x228ace
                    }
                });
                console.log('');
                console.log('\x1B[2m=== Informasi Akun ===\x1B[0m');
                console.log('\x1B[0mUsername:\x1B[33m', _0x228ace);
                console.log('\x1B[0mTelegramID:\x1B[33m', _0x819be0.data.telegramUserId);
                console.log('\x1B[0mBalance:\x1B[33m', _0x819be0.data.clicksCount);
                await sleep(2000);
                const _0x28ee31 = await axios.get('https://api-clicker.pixelverse.xyz/api/pets', {
                    headers: {
                        Initdata: _0x3fc5c7,
                        Secret: _0x346870,
                        'Tg-Id': _0x3bc11a,
                        Username: _0x228ace
                    }
                });
                console.log('');
                console.log('\x1B[2m=== Daftar Pet Tersedia ===\x1B[0m');
                const _0x43a68e = new Table({
                    head: [
                        'No',
                        'Nama',
                        'Level',
                        'Damage',
                        'Energy Restoration',
                        'Max Energy'
                    ],
                    colWidths: [
                        5,
                        20,
                        10,
                        10,
                        20,
                        15
                    ]
                });
                _0x28ee31.data.data.forEach((_0x153987, _0x19f17a) => {
                    _0x43a68e.push([
                        _0x19f17a + 1,
                        _0x153987.name,
                        _0x153987.userPet.level,
                        _0x153987.userPet.stats[0].currentValue,
                        _0x153987.userPet.stats[1].currentValue,
                        _0x153987.userPet.stats[2].currentValue
                    ]);
                });
                console.log(_0x43a68e.toString());
                await sleep(2000);
                const _0x2abd69 = await checkPriceAndAvailability(_0x3fc5c7, _0x346870, _0x3bc11a, _0x228ace);
                if (_0x2abd69) {
                    const _0x3726db = await checkBalance(_0x3fc5c7, _0x346870, _0x3bc11a, _0x228ace);
                    const _0x275370 = await axios.get('https://api-clicker.pixelverse.xyz/api/pets', {
                        headers: {
                            Initdata: _0x3fc5c7,
                            Secret: _0x346870,
                            'Tg-Id': _0x3bc11a,
                            Username: _0x228ace
                        }
                    });
                    const _0x415168 = _0x275370.data.buyPrice;
                    console.log('\nMembeli pet untuk akun:', _0x228ace);
                    console.log('Uangkamu:', _0x3726db);
                    console.log('Harga pet:', _0x415168);
                    if (_0x3726db >= _0x415168) {
                        await buyPetAction(_0x3fc5c7, _0x346870, _0x3bc11a, _0x228ace);
                        await sleep(3000);
                        console.log('Pembelian berhasil.');
                    } else {
                        console.log('Maaf, saldo Anda tidak mencukupi untuk membeli pet.');
                    }
                } else {
                    console.log('Pet tidak tersedia untuk dibeli hari ini untuk akun:', _0x228ace);
                }
            }
            console.log('\nSemua akun telah diproses.');
        } else {
            if (_0x2dc9ea.toLowerCase() === 'n') {
                const _0x214c90 = await promptUser('\nPilih Akun (masukkan nomor): ');
                try {
                    const _0x5513ff = pilihAkun(_0x16afc3, parseInt(_0x214c90));
                    const {
                        initData: _0x409c01,
                        secret: _0x53e5a6,
                        tgId: _0x671144,
                        username: _0x500f57
                    } = _0x5513ff;
                    const _0x15bbf3 = await axios.get('https://api-clicker.pixelverse.xyz/api/users', {
                        headers: {
                            Initdata: _0x409c01,
                            Secret: _0x53e5a6,
                            'Tg-Id': _0x671144,
                            Username: _0x500f57
                        }
                    });
                    console.log('');
                    console.log('\x1B[2m=== Informasi Akun ===\x1B[0m');
                    console.log('\x1B[0mUsername:\x1B[33m', _0x500f57);
                    console.log('\x1B[0mTelegramID:\x1B[33m', _0x15bbf3.data.telegramUserId);
                    console.log('\x1B[0mBalance:\x1B[33m', _0x15bbf3.data.clicksCount);
                    const _0x2271c2 = await axios.get('https://api-clicker.pixelverse.xyz/api/pets', {
                        headers: {
                            Initdata: _0x409c01,
                            Secret: _0x53e5a6,
                            'Tg-Id': _0x671144,
                            Username: _0x500f57
                        }
                    });
                    console.log('');
                    console.log('\x1B[2m=== Daftar Pet Tersedia ===\x1B[0m');
                    const _0x2820dd = new Table({
                        head: [
                            'No',
                            'Nama',
                            'Level',
                            'Damage',
                            'Energy Restoration',
                            'Max Energy'
                        ],
                        colWidths: [
                            5,
                            20,
                            10,
                            10,
                            20,
                            15
                        ]
                    });
                    _0x2271c2.data.data.forEach((_0xf143f4, _0x19599a) => {
                        _0x2820dd.push([
                            _0x19599a + 1,
                            _0xf143f4.name,
                            _0xf143f4.userPet.level,
                            _0xf143f4.userPet.stats[0].currentValue,
                            _0xf143f4.userPet.stats[1].currentValue,
                            _0xf143f4.userPet.stats[2].currentValue
                        ]);
                    });
                    console.log(_0x2820dd.toString());
                    const _0x233e4e = await checkPriceAndAvailability(_0x409c01, _0x53e5a6, _0x671144, _0x500f57);
                    if (_0x233e4e) {
                        const _0x2eef2f = await checkBalance(_0x409c01, _0x53e5a6, _0x671144, _0x500f57);
                        const _0x53c449 = await axios.get('https://api-clicker.pixelverse.xyz/api/pets', {
                            headers: {
                                Initdata: _0x409c01,
                                Secret: _0x53e5a6,
                                'Tg-Id': _0x671144,
                                Username: _0x500f57
                            }
                        });
                        const _0x311640 = _0x53c449.data.buyPrice;
                        console.log('\nUangkamu:', _0x2eef2f);
                        console.log('Harga pet:', _0x311640);
                        if (_0x2eef2f >= _0x311640) {
                            await buyPetAction(_0x409c01, _0x53e5a6, _0x671144, _0x500f57);
                        } else {
                            console.log('Maaf, saldo Anda tidak mencukupi untuk membeli pet.');
                        }
                    }
                } catch (_0x4e471f) {
                    console.error('\x1B[31mError:\x1B[0m', _0x4e471f);
                }
            } else {
                console.log('Pilihan tidak valid.');
            }
        }
    } catch (_0x438486) {
        console.error('\x1B[31mError:\x1B[0m', _0x438486);
    }
}
function generateRandomNumber(_0x168a10, _0x365c67) {
    return Math.floor(Math.random() * (_0x365c67 - _0x168a10 + 1)) + _0x168a10;
}
const randomNumber = generateRandomNumber(50000, 65000);
function bacaFile() {
    return new Promise((_0x124d62, _0xd862c3) => {
        fs.readFile('multi.txt', 'utf8', (_0xa10eca, _0x4dddac) => {
            if (_0xa10eca) {
                _0xd862c3(_0xa10eca);
            } else {
                const _0x3f4eb6 = _0x4dddac.split('\n').map(_0x28f1d3 => _0x28f1d3.trim()).filter(_0x2201e8 => _0x2201e8);
                const _0x33e208 = [];
                for (let _0x101749 = 0; _0x101749 < _0x3f4eb6.length; _0x101749 += 4) {
                    _0x33e208.push({
                        initData: _0x3f4eb6[_0x101749],
                        secret: _0x3f4eb6[_0x101749 + 1],
                        tgId: _0x3f4eb6[_0x101749 + 2],
                        username: _0x3f4eb6[_0x101749 + 3]
                    });
                }
                _0x124d62(_0x33e208);
            }
        });
    });
}
async function loginClaimAndFight(_0x5dc222) {
    const {
        initData: _0x26e909,
        secret: _0x1f0092,
        tgId: _0x33a30b,
        username: _0x5c35b3
    } = _0x5dc222;
    try {
        const _0x22bc93 = await axios.get('https://api-clicker.pixelverse.xyz/api/users', {
            headers: {
                Initdata: _0x26e909,
                Secret: _0x1f0092,
                'Tg-Id': _0x33a30b,
                Username: _0x5c35b3
            }
        });
        console.log('');
        console.log('\x1B[2m=== Akun ===\x1B[0m');
        console.log('\x1B[0mUsername:\x1B[33m', _0x5c35b3);
        console.log('\x1B[0mTelegramID:\x1B[33m', _0x22bc93.data.telegramUserId);
        console.log('\x1B[0mBalance:\x1B[33m', _0x22bc93.data.clicksCount);
        return _0x22bc93.data;
    } catch (_0x59c210) {
        console.error('\x1B[31mLogin gagal:\x1B[0m', _0x59c210);
    }
}
async function claim(_0x72d3fc) {
    const {
        initData: _0x2a99ca,
        secret: _0x17c763,
        tgId: _0x57bf6c,
        username: _0x5d504d
    } = _0x72d3fc;
    try {
        const _0xe91b86 = await axios.post('https://api-clicker.pixelverse.xyz/api/mining/claim', null, {
            headers: {
                Initdata: _0x2a99ca,
                Secret: _0x17c763,
                'Tg-Id': _0x57bf6c,
                Username: _0x5d504d
            }
        });
        console.log('');
        console.log('\x1B[2m=== Feed & Claim ===\x1B[0m');
        console.log('\x1B[0mKlaim Farming: \x1B[32m' + _0xe91b86.data.claimedAmount + '\x1B[0m');
        console.log('\x1B[0mMax Available: \x1B[32m' + _0xe91b86.data.maxAvailable + '\x1B[0m');
        await checkDailyReward(_0x72d3fc);
        return _0xe91b86.data;
    } catch (_0x197fca) {
        console.error('\x1B[31mClaim gagal:\x1B[0m', _0x197fca);
    }
}
async function checkDailyReward(_0x1af6dd) {
    const {
        initData: _0x19a9c8,
        secret: _0x2c4016,
        tgId: _0x181ea4,
        username: _0x3eccc5
    } = _0x1af6dd;
    try {
        const _0x379c35 = await axios.get('https://api-clicker.pixelverse.xyz/api/daily-rewards', {
            headers: {
                Initdata: _0x19a9c8,
                Secret: _0x2c4016,
                'Tg-Id': _0x181ea4,
                Username: _0x3eccc5
            }
        });
        if (!_0x379c35.data.todaysRewardAvailable) {
            return;
        }
        await claimDailyReward(_0x1af6dd);
    } catch (_0x392981) {
        console.error('\x1B[31mError saat memeriksa daily reward:\x1B[0m', _0x392981);
    }
}
async function claimDailyReward(_0x209c4d) {
    const {
        initData: _0xa963b8,
        secret: _0x2b50ec,
        tgId: _0x4b3741,
        username: _0x559965
    } = _0x209c4d;
    try {
        const _0x2d0e67 = await axios.post('https://api-clicker.pixelverse.xyz/api/daily-rewards/claim', null, {
            headers: {
                Initdata: _0xa963b8,
                Secret: _0x2b50ec,
                'Tg-Id': _0x4b3741,
                Username: _0x559965
            }
        });
        const {
            day: _0x2a30e3,
            amount: _0x5c7300
        } = _0x2d0e67.data;
        console.log('Klaim Day ' + _0x2a30e3 + ' : \x1B[32m' + _0x5c7300 + '\x1B[0m');
    } catch (_0x5a68c2) {
        console.error('\x1B[31mError saat melakukan klaim daily reward:\x1B[0m', _0x5a68c2);
    }
}
function handleWebSocketMessage(_0x3052ad, _0x54d3ec, _0x1d1264) {
    if (_0x3052ad.includes('42["START"')) {
        const _0x32fd9a = JSON.parse(_0x3052ad.slice(2));
        const _0x569744 = _0x32fd9a[1].battleId;
        const _0x512f79 = _0x32fd9a[1].player1;
        const _0x4b942c = _0x32fd9a[1].player2;
        console.log('\x1B[0mMusuh ditemukan: \x1B[32m' + _0x512f79.username + '\x1B[0m \x1B[2mVS\x1B[0m \x1B[31m' + _0x4b942c.username + '\x1B[0m');
        const _0x4a1d4c = Math.floor(Math.random() * 51) + 100;
        _0x1d1264.current = setInterval(() => {
            _0x54d3ec.send('42["HIT",{"battleId":"' + _0x569744 + '"}]');
        }, _0x4a1d4c);
    } else {
        if (_0x3052ad.includes('42["HIT"')) {
            const _0x3f21af = JSON.parse(_0x3052ad.slice(2));
            const _0x3b2331 = _0x3f21af[1].player1;
            const _0x32fdf9 = _0x3f21af[1].player2;
            process.stdout.write('\r\x1B[K\x1B[32mPlayer 1\x1B[0m ' + _0x3b2331.energy.toFixed(1) + ' \x1B[2mVS\x1B[0m ' + _0x32fdf9.energy.toFixed(1) + ' \x1B[31mPlayer 2\x1B[0m');
        } else {
            if (_0x3052ad.includes('42["END",{"result":"WIN"')) {
                const _0x336cbb = JSON.parse(_0x3052ad.slice(2));
                console.log('\n\x1B[32mPlayer 1 Reward:\x1B[0m', '\x1B[32m' + _0x336cbb[1].reward + '\x1B[0m');
                clearInterval(_0x1d1264.current);
                _0x54d3ec.close();
            } else {
                if (_0x3052ad.includes('42["END",{"result":"LOSE"')) {
                    const _0xb29f3f = JSON.parse(_0x3052ad.slice(2));
                    console.log('\n\x1B[31mPlayer 2 Reward:\x1B[0m', '\x1B[31m' + _0xb29f3f[1].reward + '\x1B[0m');
                    clearInterval(_0x1d1264.current);
                    _0x54d3ec.close();
                } else {
                    if (_0x3052ad.includes('41')) {
                        console.log('\x1B[0mKeluar dari arena pertarungan\x1B[0m');
                        clearInterval(_0x1d1264.current);
                        _0x54d3ec.close();
                    } else {
                        if (_0x3052ad.includes('42["SET_SUPER_HIT_ATTACK_ZONE"')) {
                            const _0x260ceb = JSON.parse(_0x3052ad.slice(2));
                            const _0x951b9b = _0x260ceb[1];
                            const _0x5cafea = Math.floor(Math.random() * 4) + 1;
                            _0x54d3ec.send('42["SET_SUPER_HIT_ATTACK_ZONE",{"battleId":"' + _0x951b9b + '", "zone": ' + _0x5cafea + '}]');
                        } else {
                            if (_0x3052ad.includes('42["SET_SUPER_HIT_DEFEND_ZONE"')) {
                                const _0x1254ec = JSON.parse(_0x3052ad.slice(2));
                                const _0x391649 = _0x1254ec[1];
                                const _0x203dc7 = Math.floor(Math.random() * 4) + 1;
                                _0x54d3ec.send('42["SET_SUPER_HIT_DEFEND_ZONE",{"battleId":"' + _0x391649 + '", "zone": ' + _0x203dc7 + '}]');
                            }
                        }
                    }
                }
            }
        }
    }
}
async function battle(_0x25cdfb) {
    const {
        initData: _0x5772c2,
        secret: _0x1d99e2,
        tgId: _0x3a9303,
        username: _0x92e2b7
    } = _0x25cdfb;
    const _0x59563b = new WebSocket('wss://api-clicker.pixelverse.xyz/socket.io/?EIO=4&transport=websocket');
    const _0x50ee85 = { current: null };
    _0x59563b.on('open', () => {
        console.log('');
        console.log('\x1B[2m=== Pertarungan ===\x1B[0m');
        console.log('\x1B[0mMemasuki Arena\x1B[0m');
        _0x59563b.send('40{"tg-id":' + _0x3a9303 + ',"secret":"' + _0x1d99e2 + '","initData":"' + _0x5772c2 + '"}');
    });
    _0x59563b.on('message', _0xfb1ad1 => handleWebSocketMessage(_0xfb1ad1, _0x59563b, _0x50ee85));
    _0x59563b.on('error', _0x58dbe2 => {
        console.error('\x1B[31mWebSocket Error:\x1B[0m', _0x58dbe2);
    });
    _0x59563b.on('close', () => {
        getInfoAfterBattle(_0x25cdfb);
    });
}
async function getInfoAfterBattle(_0x17a9f2) {
    const {
        initData: _0x397211,
        secret: _0xc3fa54,
        tgId: _0x3eac11,
        username: _0x4030a5
    } = _0x17a9f2;
    try {
        const _0x3af7f2 = await axios.get('https://api-clicker.pixelverse.xyz/api/users', {
            headers: {
                Initdata: _0x397211,
                Secret: _0xc3fa54,
                'Tg-Id': _0x3eac11,
                Username: _0x4030a5
            }
        });
        await new Promise(_0xf6b68e => setTimeout(_0xf6b68e, 2000));
        console.log('');
        console.log('\x1B[2m=== Info Setelah Pertarungan ===\x1B[0m');
        console.log('\x1B[0mBalance:\x1B[33m', _0x3af7f2.data.clicksCount);
        console.log('');
        console.log('Delay Random');
        await new Promise(_0x483a95 => setTimeout(_0x483a95, 2000));
    } catch (_0x36ad84) {
        console.error('\x1B[31mError mendapatkan info setelah pertarungan:\x1B[0m', _0x36ad84);
    }
}
function promptUser(_0x293eea) {
    const _0x2c250e = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(_0x12cd0c => {
        _0x2c250e.question(_0x293eea, _0x3548bd => {
            _0x2c250e.close();
            _0x12cd0c(_0x3548bd);
        });
    });
}
async function listAndSelectPet(_0x26ab6d) {
    const {
        initData: _0xa30056,
        secret: _0x401c37,
        tgId: _0x161379,
        username: _0x3b9896
    } = _0x26ab6d;
    try {
        const _0x5f96dc = await axios.get('https://api-clicker.pixelverse.xyz/api/pets', {
            headers: {
                Initdata: _0xa30056,
                Secret: _0x401c37,
                'Tg-Id': _0x161379,
                Username: _0x3b9896
            }
        });
        console.log('');
        console.log('\x1B[2m=== Daftar Pet Tersedia ===\x1B[0m');
        const _0x5a1da9 = new Table({
            head: [
                'No',
                'Name',
                'Level',
                'Damage',
                'Energy Restoration',
                'Max Energy'
            ],
            colWidths: [
                5,
                20,
                10,
                10,
                20,
                15
            ]
        });
        _0x5f96dc.data.data.forEach((_0x448ddc, _0x57b873) => {
            _0x5a1da9.push([
                _0x57b873 + 1,
                _0x448ddc.name,
                _0x448ddc.userPet.level,
                _0x448ddc.userPet.stats[0].currentValue,
                _0x448ddc.userPet.stats[1].currentValue,
                _0x448ddc.userPet.stats[2].currentValue
            ]);
        });
        console.log(_0x5a1da9.toString());
        let _0x503fd6;
        let _0x316329 = false;
        do {
            const _0x5f5abf = await promptUser('Masukkan Nomor Pet: ');
            _0x316329 = validateInput(_0x5f5abf, _0x5f96dc);
            if (!_0x316329) {
                if (isNaN(_0x5f5abf)) {
                    console.log('Gunakan Nomor, Masukkan Nomor Pet:');
                } else {
                    console.log('Tidak Ada Pet dengan nomor tersebut, Masukkan Nomor Pet:');
                }
            } else {
                _0x503fd6 = parseInt(_0x5f5abf) - 1;
            }
        } while (!_0x316329);
        const _0x8d6a09 = _0x5f96dc.data.data[_0x503fd6].userPet.id;
        try {
            await selectPet(_0xa30056, _0x401c37, _0x161379, _0x3b9896, _0x8d6a09);
            console.log('Pet ' + _0x5f96dc.data.data[_0x503fd6].name + ' berhasil dipilih');
        } catch (_0x10e9f2) {
            if (_0x10e9f2.response && _0x10e9f2.response.data && _0x10e9f2.response.data.code === 'BadRequestException' && _0x10e9f2.response.data.message === 'You have already selected this pet') {
                console.log('Yap! Pet default mu adalah itu');
            } else {
                throw _0x10e9f2;
            }
        }
    } catch (_0x101f95) {
        console.error('\x1B[31mError saat memilih pet:\x1B[0m', _0x101f95);
    }
}
function validateInput(_0x4eb477, _0x3551bb) {
    const _0x489d97 = parseInt(_0x4eb477);
    const _0x5125b8 = !isNaN(_0x489d97) && _0x489d97 > 0 && _0x489d97 <= _0x3551bb.data.data.length && _0x4eb477.trim().length === 1;
    return _0x5125b8;
}
async function selectPet(_0x318f1c, _0x31a839, _0x2e3a8d, _0x463f1e, _0x338be2) {
    const _0x4f25e6 = await axios.post('https://api-clicker.pixelverse.xyz/api/pets/user-pets/' + _0x338be2 + '/select', null, {
        headers: {
            Initdata: _0x318f1c,
            Secret: _0x31a839,
            'Tg-Id': _0x2e3a8d,
            Username: _0x463f1e
        }
    });
    return _0x4f25e6.data;
}
async function processAccountClaimAndFight(_0xe8222b) {
    try {
        await loginClaimAndFight(_0xe8222b);
        await new Promise(_0x1a3f19 => setTimeout(_0x1a3f19, 2000));
        await listAndSelectPet(_0xe8222b);
        await new Promise(_0x436829 => setTimeout(_0x436829, 2000));
        while (continueLooping) {
            console.clear();
            await claim(_0xe8222b);
            await battle(_0xe8222b);
            await new Promise(_0x59e9bc => setTimeout(_0x59e9bc, randomNumber));
        }
    } catch (_0x2e04e0) {
        console.error('\x1B[31mError:\x1B[0m', _0x2e04e0);
    }
}
async function processAllAccountClaimAndFight(_0x9253e2) {
    try {
        for (const _0x28b975 of _0x9253e2) {
            console.log('');
            console.log('Pilih Pet Masing-Masing Akun: ');
            await loginClaimAndFight(_0x28b975);
            await listAndSelectPet(_0x28b975);
        }
        while (true) {
            for (const _0x4936c6 of _0x9253e2) {
                console.clear();
                await loginClaimAndFight(_0x4936c6);
                await new Promise(_0x5064cf => setTimeout(_0x5064cf, 2000));
                await claim(_0x4936c6);
                await battle(_0x4936c6);
                await new Promise(_0x2f4454 => setTimeout(_0x2f4454, randomNumber));
            }
            await new Promise(_0x45767a => setTimeout(_0x45767a, 5000));
        }
    } catch (_0x42e0c3) {
        console.error('\x1B[31mError:\x1B[0m', _0x42e0c3);
    }
}
function tampilkanTabelAkunClaimAndFight(_0x305256) {
    const _0x51b7e6 = new Table({
        head: [
            'No',
            'ID',
            'Username'
        ],
        colWidths: [
            4,
            20,
            20
        ]
    });
    _0x305256.forEach((_0x2c6830, _0x2b7e6b) => {
        _0x51b7e6.push([
            _0x2b7e6b + 1,
            _0x2c6830.tgId,
            _0x2c6830.username
        ]);
    });
    console.log(_0x51b7e6.toString());
}
let continueLooping = true;
async function claimAndFight() {
    console.log('Menjalankan Auto Claim & Fight...');
    try {
        const _0x566f50 = await bacaFile();
        console.clear();
        console.log('Daftar Akun:');
        await tampilkanTabelAkunClaimAndFight(_0x566f50);
        const _0x4156f6 = await promptUser('Lakukan Login, Claim & Fight untuk semua akun? (y/n): ');
        if (_0x4156f6.toLowerCase() === 'y') {
            await processAllAccountClaimAndFight(_0x566f50);
        } else {
            const _0x4fd053 = await promptUser('Pilih nomor akun: ');
            const _0x5e0797 = parseInt(_0x4fd053) - 1;
            if (_0x5e0797 >= 0 && _0x5e0797 < _0x566f50.length) {
                await processAccountClaimAndFight(_0x566f50[_0x5e0797]);
            } else {
                console.log('Nomor akun tidak valid.');
            }
        }
    } catch (_0x2b1d4f) {
        console.error('\x1B[31mError:\x1B[0m', _0x2b1d4f);
    }
}
let massUpgradeAllPets = false;
function sleep(_0x346f9b) {
    return new Promise(_0x414e12 => setTimeout(_0x414e12, _0x346f9b));
}
async function bacaFileUpgradePet() {
    try {
        const _0x23f23e = await fs.promises.readFile('multi.txt', 'utf8');
        const _0x548e0a = _0x23f23e.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n\n').map(_0x292485 => {
            const _0x4fb4a1 = _0x292485.split('\n').map(_0xe21c29 => _0xe21c29.trim());
            const _0x203c88 = _0x4fb4a1[0];
            const _0x3c5006 = _0x4fb4a1[1];
            const _0x2ffe87 = _0x4fb4a1[2];
            const _0x320acb = _0x4fb4a1[3];
            return {
                initData: _0x203c88,
                secret: _0x3c5006,
                tgId: _0x2ffe87,
                username: _0x320acb
            };
        });
        return _0x548e0a;
    } catch (_0x1ddc7f) {
        console.error('Error reading file:', _0x1ddc7f.message);
        throw _0x1ddc7f;
    }
}
function tampilkanTabelAkunUpgradePet(_0x14439e) {
    const _0x31dd70 = new Table({
        head: [
            'No',
            'ID',
            'Username'
        ],
        colWidths: [
            4,
            20,
            20
        ]
    });
    _0x14439e.forEach((_0x3d3cfb, _0x547f0f) => {
        _0x31dd70.push([
            _0x547f0f + 1,
            _0x3d3cfb.tgId,
            _0x3d3cfb.username
        ]);
    });
    console.log('\nSilahkan pilih akun yang ingin diloginkan:');
    console.log(_0x31dd70.toString());
}
function promptUser(_0x1d17d0) {
    const _0xbe548c = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(_0x2122e7 => _0xbe548c.question(_0x1d17d0, _0x40b5a9 => {
        _0xbe548c.close();
        _0x2122e7(_0x40b5a9);
    }));
}
async function loginUpgradePet(_0x516e44, _0x4f1dc1, _0x4f8fe0, _0x1d0e69) {
    try {
        const _0x1c0ea8 = await axios.get('https://api-clicker.pixelverse.xyz/api/users', {
            headers: {
                Initdata: _0x516e44,
                Secret: _0x4f1dc1,
                'Tg-Id': _0x4f8fe0,
                Username: _0x1d0e69
            }
        });
        console.log('');
        console.log('Login Sebagai:');
        console.log('\x1B[0mUsername:\x1B[33m', _0x1d0e69);
        console.log('\x1B[0mTelegramID:\x1B[33m', _0x1c0ea8.data.telegramUserId);
        console.log('\x1B[0mBalance:\x1B[33m', _0x1c0ea8.data.clicksCount);
        return _0x1c0ea8.data;
    } catch (_0x32a25d) {
        console.error('\x1B[31mLogin gagal:\x1B[0m', _0x32a25d);
    }
}
async function getUserPets(_0x4d337e) {
    try {
        const _0x477429 = await axios.get('https://api-clicker.pixelverse.xyz/api/pets', {
            headers: {
                Initdata: _0x4d337e.initData,
                Secret: _0x4d337e.secret,
                'Tg-Id': _0x4d337e.tgId,
                Username: _0x4d337e.username
            }
        });
        return _0x477429.data.data;
    } catch (_0xa8c2b5) {
        console.error('Error fetching pets:', _0xa8c2b5.message);
        throw _0xa8c2b5;
    }
}
async function upgradePet(_0x966e3f, _0x11464a) {
    try {
        const _0x46aa12 = await axios.post('https://api-clicker.pixelverse.xyz/api/pets/user-pets/' + _0x11464a + '/level-up', {}, {
            headers: {
                Initdata: _0x966e3f.initData,
                Secret: _0x966e3f.secret,
                'Tg-Id': _0x966e3f.tgId,
                Username: _0x966e3f.username
            }
        });
        return _0x46aa12.data;
    } catch (_0x4824a2) {
        throw _0x4824a2;
    }
}
async function processAccountUpgradePet(_0xc4f2da) {
    try {
        await loginUpgradePet(_0xc4f2da.initData, _0xc4f2da.secret, _0xc4f2da.tgId, _0xc4f2da.username);
        console.log('');
        const _0x3b79fd = await getUserPets(_0xc4f2da);
        if (!Array.isArray(_0x3b79fd)) {
            console.error('Unexpected response structure for pets:', _0x3b79fd);
            return;
        }
        const _0x1b7012 = new Table({
            head: [
                'No',
                'Name',
                'Level',
                'Damage',
                'Energy Restoration',
                'Max Energy',
                'Price',
                'Max Level'
            ],
            colWidths: [
                5,
                20,
                10,
                10,
                20,
                15,
                20,
                10
            ]
        });
        _0x3b79fd.forEach((_0x5c41f9, _0x2ad1ca) => {
            const _0xae615e = _0x5c41f9.userPet.stats.find(_0x2aa6fa => _0x2aa6fa.petsStat.name === 'Damage').currentValue;
            const _0x49e412 = _0x5c41f9.userPet.stats.find(_0x39601d => _0x39601d.petsStat.name === 'Energy restoration').currentValue;
            const _0x3b8394 = _0x5c41f9.userPet.stats.find(_0x5d5622 => _0x5d5622.petsStat.name === 'Max energy').currentValue;
            _0x1b7012.push([
                _0x2ad1ca + 1,
                _0x5c41f9.name,
                _0x5c41f9.userPet.level,
                _0xae615e,
                _0x49e412,
                _0x3b8394,
                _0x5c41f9.userPet.levelUpPrice,
                _0x5c41f9.userPet.isMaxLevel ? 'Yes' : 'No'
            ]);
        });
        console.log('List Petmu:');
        console.log(_0x1b7012.toString());
        if (massUpgradeAllPets) {
            const _0x10f64d = new Table({
                head: [
                    'No',
                    'Name',
                    'Level',
                    'Damage',
                    'Energy Restoration',
                    'Max Energy',
                    'Price',
                    'Status'
                ],
                colWidths: [
                    5,
                    20,
                    10,
                    10,
                    20,
                    15,
                    15,
                    10
                ]
            });
            for (let _0x451416 = 0; _0x451416 < _0x3b79fd.length; _0x451416++) {
                if (_0x3b79fd[_0x451416].userPet.isMaxLevel) {
                    console.log('Skipping ' + _0x3b79fd[_0x451416].name + ' as it is already at max level.');
                    _0x10f64d.push([
                        _0x451416 + 1,
                        _0x3b79fd[_0x451416].name,
                        _0x3b79fd[_0x451416].userPet.level,
                        '-',
                        '-',
                        '-',
                        '-',
                        'Max Level'
                    ]);
                    continue;
                }
                try {
                    const _0x37a4dc = await upgradePet(_0xc4f2da, _0x3b79fd[_0x451416].userPet.id);
                    _0x10f64d.push([
                        _0x451416 + 1,
                        _0x37a4dc.pet.name,
                        _0x37a4dc.level,
                        _0x37a4dc.stats[0].currentValue,
                        _0x37a4dc.stats[1].currentValue,
                        _0x37a4dc.maxEnergy,
                        _0x37a4dc.levelUpPrice,
                        'Success'
                    ]);
                } catch (_0x59fabd) {
                    console.error('Failed to upgrade pet ' + _0x3b79fd[_0x451416].name + ': ' + _0x59fabd.message);
                    _0x10f64d.push([
                        _0x451416 + 1,
                        _0x3b79fd[_0x451416].name,
                        _0x3b79fd[_0x451416].userPet.level,
                        '-',
                        '-',
                        '-',
                        '-',
                        'Failed'
                    ]);
                }
            }
            console.log('\nHasil Upgrade Pet:');
            console.log(_0x10f64d.toString());
        } else {
            const _0x5e5c05 = await promptUser('Mass upgrade semua pet? (y/n): ');
            if (_0x5e5c05.toLowerCase() === 'y') {
                const _0x28083b = new Table({
                    head: [
                        'No',
                        'Name',
                        'Level',
                        'Damage',
                        'Energy Restoration',
                        'Max Energy',
                        'Price',
                        'Status'
                    ],
                    colWidths: [
                        5,
                        20,
                        10,
                        10,
                        20,
                        15,
                        15,
                        10
                    ]
                });
                for (let _0x594855 = 0; _0x594855 < _0x3b79fd.length; _0x594855++) {
                    if (_0x3b79fd[_0x594855].userPet.isMaxLevel) {
                        console.log('Skipping ' + _0x3b79fd[_0x594855].name + ' as it is already at max level.');
                        _0x28083b.push([
                            _0x594855 + 1,
                            _0x3b79fd[_0x594855].name,
                            _0x3b79fd[_0x594855].userPet.level,
                            '-',
                            '-',
                            '-',
                            '-',
                            'Max Level'
                        ]);
                        continue;
                    }
                    try {
                        const _0x3ef827 = await upgradePet(_0xc4f2da, _0x3b79fd[_0x594855].userPet.id);
                        _0x28083b.push([
                            _0x594855 + 1,
                            _0x3ef827.pet.name,
                            _0x3ef827.level,
                            _0x3ef827.stats[0].currentValue,
                            _0x3ef827.stats[1].currentValue,
                            _0x3ef827.maxEnergy,
                            _0x3ef827.levelUpPrice,
                            'Success'
                        ]);
                    } catch (_0x3ddb71) {
                        console.error('Failed to upgrade pet ' + _0x3b79fd[_0x594855].name + ': ' + _0x3ddb71.message);
                        _0x28083b.push([
                            _0x594855 + 1,
                            _0x3b79fd[_0x594855].name,
                            _0x3b79fd[_0x594855].userPet.level,
                            '-',
                            '-',
                            '-',
                            '-',
                            'Failed'
                        ]);
                    }
                }
                console.log('\nHasil Upgrade Pet:');
                console.log(_0x28083b.toString());
            } else {
                if (_0x5e5c05.toLowerCase() === 'n') {
                    const _0x2b2e91 = await promptUser('Pilih nomor pet yang ingin di-upgrade: ');
                    const _0x13754b = parseInt(_0x2b2e91, 10) - 1;
                    if (_0x13754b >= 0 && _0x13754b < _0x3b79fd.length) {
                        if (_0x3b79fd[_0x13754b].userPet.isMaxLevel) {
                            console.log('Pet ' + _0x3b79fd[_0x13754b].name + 'sudah mencapai level maksimal.');
                        } else {
                            try {
                                const _0x36712e = await upgradePet(_0xc4f2da, _0x3b79fd[_0x13754b].userPet.id);
                                const _0x366937 = new Table({
                                    head: [
                                        'Name',
                                        'Level',
                                        'Damage',
                                        'Energy Restoration',
                                        'Max Energy',
                                        'Price'
                                    ],
                                    colWidths: [
                                        20,
                                        10,
                                        10,
                                        20,
                                        15,
                                        15
                                    ]
                                });
                                _0x366937.push([
                                    _0x36712e.pet.name,
                                    _0x36712e.level,
                                    _0x36712e.stats[0].currentValue,
                                    _0x36712e.stats[1].currentValue,
                                    _0x36712e.maxEnergy,
                                    _0x36712e.levelUpPrice
                                ]);
                                console.log('\nHasil Upgrade Pet:');
                                console.log(_0x366937.toString());
                            } catch (_0x51ee67) {
                                console.error('Gagal meng-upgrade pet ' + _0x3b79fd[_0x13754b].name + ': ' + _0x51ee67.message);
                            }
                        }
                    } else {
                        console.error('Nomor pet tidak valid.');
                    }
                } else {
                    console.error('Pilihan tidak valid.');
                }
            }
        }
    } catch (_0x16d92e) {
        console.error('Terjadi kesalahan:', _0x16d92e.message);
    }
}
async function upgradeAllPets(_0x1ceda0) {
    for (const _0x3b29ed of _0x1ceda0) {
        await processAccountUpgradePet(_0x3b29ed);
    }
}
async function upgradePetTools() {
    console.log('Menjalankan Auto Upgrade Pet...');
    try {
        const _0x37a57c = await bacaFileUpgradePet();
        tampilkanTabelAkunUpgradePet(_0x37a57c);
        const _0x514fcb = await promptUser('Upgrade pada semua akun dan semua pet? (y/n): ');
        if (_0x514fcb.toLowerCase() === 'y') {
            massUpgradeAllPets = true;
            await sleep(3000);
            await upgradeAllPets(_0x37a57c);
        } else {
            if (_0x514fcb.toLowerCase() === 'n') {
                const _0x1bc0f8 = await promptUser('Pilih nomor akun yang ingin di-upgrade pet-nya: ');
                const _0xd1b6cf = parseInt(_0x1bc0f8, 10);
                if (_0xd1b6cf >= 1 && _0xd1b6cf <= _0x37a57c.length) {
                    const _0xc5f272 = _0x37a57c[_0xd1b6cf - 1];
                    await sleep(3000);
                    await processAccountUpgradePet(_0xc5f272);
                } else {
                    console.error('Nomor akun tidak valid.');
                }
            } else {
                console.error('Pilihan tidak valid.');
            }
        }
    } catch (_0x598e26) {
        console.error('Terjadi kesalahan:', _0x598e26.message);
    }
}
async function readFile() {
    try {
        const _0x412f05 = await fs.promises.readFile('multi.txt', 'utf8');
        const _0x2fd0ff = _0x412f05.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n\n').map(_0x349dae => {
            const _0xc69ca7 = _0x349dae.split('\n').map(_0x593166 => _0x593166.trim());
            const _0x2ab632 = _0xc69ca7[0];
            const _0xf0f307 = _0xc69ca7[1];
            const _0x4c8e22 = _0xc69ca7[2];
            const _0x2ad2c0 = _0xc69ca7[3];
            return {
                initData: _0x2ab632,
                secret: _0xf0f307,
                tgId: _0x4c8e22,
                username: _0x2ad2c0
            };
        });
        return _0x2fd0ff;
    } catch (_0x294d97) {
        console.error('Error reading file:', _0x294d97.message);
        throw _0x294d97;
    }
}
async function makeGetRequest(_0x3f16c0, _0x1ad148) {
    try {
        const _0x573822 = await axios.get(_0x3f16c0, { headers: _0x1ad148 });
        return _0x573822.data;
    } catch (_0x426495) {
        console.error('Anda Sudah Melakakukan Combo');
        return null;
    }
}
async function makePostRequest(_0x296ccc, _0x451b34, _0x237bbc) {
    try {
        const _0x30a2c2 = await axios.post(_0x296ccc, _0x237bbc, { headers: _0x451b34 });
        return _0x30a2c2.data;
    } catch (_0x53aec0) {
        if (_0x53aec0.response) {
            return _0x53aec0.response.status;
        } else {
            return null;
        }
    }
}
function readComboData() {
    try {
        const _0x32fb5e = fs.readFileSync('combo.txt', 'utf8');
        const _0x35cd5a = JSON.parse(_0x32fb5e);
        return _0x35cd5a;
    } catch (_0x497d28) {
        console.error('Error reading combo data:', _0x497d28.message);
        return null;
    }
}
async function loginCombo(_0x3fbf7b, _0x173213, _0x1b8dc2, _0x2af7ac) {
    try {
        const _0x371934 = await axios.get('https://api-clicker.pixelverse.xyz/api/users', {
            headers: {
                Initdata: _0x3fbf7b,
                Secret: _0x173213,
                'Tg-Id': _0x1b8dc2,
                Username: _0x2af7ac
            }
        });
        console.log('');
        console.log('\x1B[2m=== Akun ===\x1B[0m');
        console.log('\x1B[0mUsername:\x1B[33m', _0x2af7ac);
        console.log('\x1B[0mTelegramID:\x1B[33m', _0x371934.data.telegramUserId);
        console.log('\x1B[0mBalance:\x1B[33m', _0x371934.data.clicksCount);
        return _0x371934.data;
    } catch (_0x37ab97) {
        console.error('\x1B[31mLogin gagal:\x1B[0m', _0x37ab97.message);
        return null;
    }
}
async function combo() {
    console.log('Menjalankan Auto Combo...');
    console.clear();
    const _0x24bb1a = await readFile();
    const _0x3df9e0 = readComboData();
    if (_0x24bb1a && _0x3df9e0) {
        const _0xd51dc7 = _0x24bb1a.length;
        let _0x57c164 = 0;
        for (let _0x5afc45 = 0; _0x5afc45 < _0xd51dc7; _0x5afc45++) {
            const _0x4db5c1 = _0x24bb1a[_0x5afc45];
            const {
                initData: _0x44d58a,
                secret: _0x4006d6,
                tgId: _0x4843e1,
                username: _0x312364
            } = _0x4db5c1;
            console.log('');
            console.log('Account ke ' + (_0x5afc45 + 1) + ' dari ' + _0xd51dc7);
            const _0x805b37 = {
                Initdata: _0x44d58a,
                Secret: _0x4006d6,
                'Tg-Id': _0x4843e1,
                Username: _0x312364,
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0'
            };
            try {
                const _0x2e7c48 = await loginCombo(_0x44d58a, _0x4006d6, _0x4843e1, _0x312364);
                if (_0x2e7c48) {
                    const _0x80afde = await makeGetRequest('https://api-clicker.pixelverse.xyz/api/cypher-games/current', _0x805b37);
                    if (_0x80afde && _0x80afde.id) {
                        console.log('ID :', _0x80afde.id);
                        console.log('Status:', JSON.stringify(_0x80afde.status));
                        console.log('Max Reward:', _0x80afde.maxReward);
                        const _0x1a7a38 = _0x3df9e0;
                        await new Promise(_0x26510b => setTimeout(_0x26510b, 3000));
                        const _0x35e0e9 = await makePostRequest('https://api-clicker.pixelverse.xyz/api/cypher-games/' + _0x80afde.id + '/answer', _0x805b37, _0x1a7a38);
                        if (_0x35e0e9) {
                            if (_0x35e0e9 === 500) {
                                console.log('Coba lagi nanti');
                            } else {
                                console.log('rewardAmount:', _0x35e0e9.rewardAmount);
                                console.log('rewardPercent:', _0x35e0e9.rewardPercent);
                                console.log('Account processed successfully:', _0x312364);
                            }
                        }
                    }
                } else {
                    console.error('Login failed for account:', _0x312364);
                }
            } catch (_0x5ad8cc) {
                console.error('Error processing account:', _0x312364, _0x5ad8cc.message);
            } finally {
                _0x57c164++;
                if (_0x57c164 === _0xd51dc7) {
                    console.log('\nSemua Akun Berhasil Di Eksekusi.');
                }
                continue;
            }
        }
    }
}
function delay(_0x2c4f1b) {
    return new Promise(_0x414246 => setTimeout(_0x414246, _0x2c4f1b));
}
function readFile() {
    return new Promise((_0x472fa7, _0x3b4948) => {
        fs.readFile('multi.txt', 'utf8', (_0x1dc45d, _0x213086) => {
            if (_0x1dc45d) {
                _0x3b4948(_0x1dc45d);
            } else {
                const _0x501bff = _0x213086.split(/\n\s*\n/).map(_0x4e891e => {
                    const _0x2d1f11 = _0x4e891e.split('\n').map(_0xd13f74 => _0xd13f74.trim());
                    const _0x4bb392 = _0x2d1f11[0];
                    const _0x185589 = _0x2d1f11[1];
                    const _0x4f4f98 = _0x2d1f11[2];
                    const _0x2b0849 = _0x2d1f11[3];
                    return {
                        initData: _0x4bb392,
                        secret: _0x185589,
                        tgId: _0x4f4f98,
                        username: _0x2b0849
                    };
                });
                _0x472fa7(_0x501bff);
            }
        });
    });
}
async function executeTasks() {
    console.clear();
    try {
        const _0xe16e82 = await readFile();
        if (_0xe16e82.length === 0) {
            console.log('No accounts to process. Exiting...');
            return;
        }
        for (let _0x594780 = 0; _0x594780 < _0xe16e82.length; _0x594780++) {
            const _0xdffdbb = _0xe16e82[_0x594780];
            console.clear();
            console.log('\nAkun ke ' + (_0x594780 + 1) + ' dari ' + _0xe16e82.length);
            await processAccountClearTask(_0xdffdbb);
        }
        await delay(3000);
        executeTasks();
    } catch (_0x3d04e9) {
        console.error('Error reading file:', _0x3d04e9);
    }
}
const baseURL = 'https://api-clicker.pixelverse.xyz/api';
async function getTasks(_0x69b5a5) {
    try {
        const _0x3d794c = await axios.get(baseURL + '/tasks/my', { headers: _0x69b5a5 });
        return _0x3d794c.data;
    } catch (_0x577356) {
        console.error('Error fetching tasks:', _0x577356.message);
    }
}
async function startTask(_0x2a3fd1, _0x260148) {
    try {
        const _0x4f1b6c = await axios.post(baseURL + '/tasks/start/' + _0x2a3fd1, null, { headers: _0x260148 });
        return _0x4f1b6c.data;
    } catch (_0x371f41) {
        if (_0x371f41.response && _0x371f41.response.data && _0x371f41.response.data.message) {
            console.error('Error starting task:', _0x371f41.response.data.message);
        } else {
            console.error('Error starting task:', _0x371f41.message);
        }
    }
}
async function checkTaskStatus(_0x427633, _0x5db886) {
    try {
        const _0x38616d = await axios.post(baseURL + '/telegram-tasks/subscribe/' + _0x427633 + '/check', null, { headers: _0x5db886 });
        return _0x38616d.data;
    } catch (_0x427d55) {
        if (_0x427d55.response && _0x427d55.response.data && _0x427d55.response.data.message) {
            console.error('Error checking task status:', _0x427d55.response.data.message);
        } else {
            console.error('Error checking task status:', _0x427d55.message);
        }
    }
}
function displayTasks(_0x123c22, _0x52e12a) {
    const _0x28983c = new Table({
        head: [
            'Type',
            'Title',
            'Reward',
            'ID'
        ]
    });
    _0x52e12a.forEach(_0x3cf576 => {
        _0x28983c.push([
            _0x3cf576.type,
            _0x3cf576.title,
            _0x3cf576.rewardPointsAmount,
            _0x3cf576.id
        ]);
    });
    console.log('\n' + _0x123c22 + '\n');
    console.log(_0x28983c.toString());
}
async function processAccountClearTask(_0x453552) {
    async function _0x56290d(_0x204091, _0x2560b5, _0x50da82, _0x98de41) {
        try {
            const _0x5e735b = await axios.get('https://api-clicker.pixelverse.xyz/api/users', {
                headers: {
                    Initdata: _0x204091,
                    Secret: _0x2560b5,
                    'Tg-Id': _0x50da82,
                    Username: _0x98de41
                }
            });
            console.log('');
            console.log('\x1B[2m=== Informasi Akun ===\x1B[0m');
            console.log('\x1B[0mUsername:\x1B[33m', _0x98de41);
            console.log('\x1B[0mTelegramID:\x1B[33m', _0x5e735b.data.telegramUserId);
            console.log('\x1B[0mBalance:\x1B[33m', _0x5e735b.data.clicksCount);
            return _0x5e735b.data;
        } catch (_0x4755b5) {
            console.error('\x1B[31mLogin gagal:\x1B[0m', _0x4755b5);
        }
    }
    const {
        initData: _0x2ba73f,
        secret: _0x23acc6,
        tgId: _0x138b1b,
        username: _0x1ce24f
    } = _0x453552;
    await _0x56290d(_0x2ba73f, _0x23acc6, _0x138b1b, _0x1ce24f);
    const _0x18a0db = {
        Initdata: _0x2ba73f,
        Secret: _0x23acc6,
        'Tg-Id': _0x138b1b,
        Username: _0x1ce24f
    };
    const _0x28ff9d = await getTasks(_0x18a0db);
    if (!_0x28ff9d) {
        console.log('No tasks data available for account:', _0x1ce24f);
        return;
    }
    const _0x4cafed = _0x28ff9d.available;
    const _0xae5329 = _0x28ff9d.inProgress;
    const _0x4839de = _0x28ff9d.done;
    displayTasks('Available Tasks:', _0x4cafed);
    displayTasks('In-Progress Tasks:', _0xae5329);
    displayTasks('Completed Tasks:', _0x4839de);
    for (const _0x5e1533 of _0x4cafed) {
        await _0x2cd42d(_0x5e1533, _0x18a0db);
    }
    for (const _0x40cdf1 of _0xae5329) {
        await _0x2cd42d(_0x40cdf1, _0x18a0db);
    }
    async function _0x2cd42d(_0x3e4bae, _0xe71f07) {
        console.log('');
        console.log('Processing task: ' + _0x3e4bae.title + ' (ID: ' + _0x3e4bae.id + ', Reward: ' + _0x3e4bae.rewardPointsAmount + ')');
        await delay(5000);
        const _0x513fcb = await startTask(_0x3e4bae.id, _0xe71f07);
        await delay(5000);
        if (_0x513fcb && _0x513fcb.userTaskId) {
            console.log('Task started: ' + _0x513fcb.title + ' (UserTask ID: ' + _0x513fcb.userTaskId + ')');
            const _0x47b7e4 = await checkTaskStatus(_0x513fcb.userTaskId, _0xe71f07);
            if (_0x47b7e4 && _0x47b7e4.status === 'DONE') {
                console.log('Task completed: ' + _0x513fcb.title + ' (Reward: ' + _0x513fcb.rewardPointsAmount + ')');
            } else {
                console.log('Task in progress: ' + _0x513fcb.title);
            }
        } else {
            console.log('Failed to start task: ' + _0x3e4bae.title);
        }
    }
}
async function clearTask() {
    console.log('Menjalankan Auto Clear Task...');
    try {
        await executeTasks();
    } catch (_0x4b948a) {
        console.error('Error:', _0x4b948a);
    } finally {
        console.log('Dah Selesai!');
        process.exit();
    }
}
mainMenu();
