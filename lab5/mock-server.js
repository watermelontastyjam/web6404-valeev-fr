const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const DB_FILE = path.join(__dirname, 'db.json');

let db = {};
try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    db = JSON.parse(data);
} catch (err) {
    console.log('Создаем новую базу данных...');
    db = {
        bookings: [],
        games: [],
        hardware: [],
        news: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;
    
    // CORS заголовки
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Раздача статических файлов (HTML, CSS, JS, картинки)
    if (pathname === '/' || pathname.endsWith('.html')) {
        serveStaticFile(req, res);
    } else if (pathname.startsWith('/images/')) {
        serveImage(req, res, pathname);
    } else if (pathname === '/styles.css') {
        serveStaticFile(req, res);
    } else if (pathname === '/script.js') {
        serveStaticFile(req, res);
    }
    // API маршруты
    // API маршруты
    else if (pathname === '/api/games' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(db.games));
    } 
    else if (pathname === '/api/bookings' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(db.bookings));
    } 
    else if (pathname === '/api/bookings' && method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const booking = JSON.parse(body);
                booking.id = Date.now();
                booking.createdAt = new Date().toISOString();
                db.bookings.push(booking);
                
                fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
                
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(booking));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Route not found' }));
    }
    });

function serveStaticFile(req, res) {
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }
    
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
    }
    // В функции serveStaticFile добавьте:
switch (extname) {
    case '.js':
        contentType = 'text/javascript';
        break;
    case '.css':
        contentType = 'text/css';
        break;
    case '.json':
        contentType = 'application/json';
        break;
    case '.png':
        contentType = 'image/png';
        break;
    case '.jpg':
    case '.jpeg':
        contentType = 'image/jpeg';
        break;
    case '.webp':  // Добавьте эту строку
        contentType = 'image/webp';
        break;
}

// В функции serveImage также добавьте:
switch (extname) {
    case '.png':
        contentType = 'image/png';
        break;
    case '.jpg':
    case '.jpeg':
        contentType = 'image/jpeg';
        break;
    case '.gif':
        contentType = 'image/gif';
        break;
    case '.webp':  // Добавьте эту строку
        contentType = 'image/webp';
        break;
}
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
}

function serveImage(req, res, pathname) {
    const filePath = '.' + pathname;
    const extname = path.extname(filePath);
    let contentType = 'image/jpeg';
    
    switch (extname) {
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
        case '.gif':
            contentType = 'image/gif';
            break;
        case '.webp':
            contentType = 'image/webp';
            break;
    }
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(404);
            res.end('Image not found');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
}

server.listen(PORT, () => {
    console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
    console.log('📁 Доступные файлы:');
    console.log('  - index.html');
    console.log('  - games.html');
    console.log('  - hardware.html');
    console.log('  - about.html');
    console.log('  - styles.css');
    console.log('  - script.js');
    console.log('📁 Изображения в /images/');
    console.log('📡 API:');
    console.log('  GET  /api/games     - получить игры');
    console.log('  POST /api/bookings  - создать бронирование');
});