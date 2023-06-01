const http = require('http');
const jwt = require('jsonwebtoken');

const secretKey = 'tu_clave_secreta'; // Clave secreta para firmar el JWT

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    // Mostrar el formulario de inicio de sesión
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
    <html>
    <head>
    <link rel="stylesheet" href="/css/main.css">
      <meta charset="UTF-8">
    </head>
    <body>
    <style>
    Form {
        display: flex;
        flex-direction: column;
        max-width: 300px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
      }
      
    input{
        margin-bottom: 10px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
      }
      
    button {
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
    
    </style>
      <form id="loginForm">
        <input type="text" id="username" placeholder="Usuario" required><br>
        <input type="password" id="password" placeholder="Contraseña" required><br>
        <button type="submit">Iniciar sesión</button>
      </form>
      <script>
        document.getElementById('loginForm').addEventListener('submit', function(event) {
          event.preventDefault();

          const username = document.getElementById('username').value;
          const password = document.getElementById('password').value;

          const credentials = {
            username: username,
            password: password
          };

          fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
          })
            .then(response => response.json())
            .then(data => {
              if (data.success) {
                alert('Inicio de sesión exitoso');
                console.log('JWT:', data.jwt);
              } else {
                alert('Credenciales inválidas');
              }
            })
            .catch(error => {
              console.log('Error en la petición:', error);
            });
        });
      </script>
    </body>
    </html>
    `);
  } else if (req.method === 'POST' && req.url === '/login') {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      const credentials = JSON.parse(data);

      // Realizar la validación de usuario y contraseña
      if (credentials.username === 'usuario' && credentials.password === 'contraseña') {
        const tokenPayload = {
          hiddenText: 'Welcome',
        };
        const token = jwt.sign(tokenPayload, secretKey);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, jwt: token }));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false }));
      }
    });
      }
     else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 - Not Found');
  }
});

server.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});