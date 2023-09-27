const vscode = require('vscode')
const mysql = require('mysql2/promise')

module.exports = function activate(context) {
     // Crea un panel webview para la ventana modal
     const panel = vscode.window.createWebviewPanel(
        'modal',
        'Editor SQL',
        vscode.ViewColumn.Active,
        {
            enableScripts: true
        }
    );

    // Obtén la ruta completa del archivo modal.html
    const modalFilePath = vscode.Uri.file(context.extensionPath + '/modal.html');
    const modalFileUrl = panel.webview.asWebviewUri(modalFilePath);

    // Carga el archivo modal.html en el panel webview
    panel.webview.html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Editor SQL2</title>
            <style>
                /* Estilos CSS para el modal */
                body {
                    background-color: #f5f5f5;
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                }
                
                .modal {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 4px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                }
                
                .sql-editor {
                    width: 100%;
                    height: 300px;
                    margin-bottom: 10px;
                }
            </style>
        </head>
        <body>
            <div class="modal">
                <h2>Editor SQL</h2>
                <textarea class="sql-editor" id="sqlEditor"></textarea>
                <button onclick="runQuery()">Ejecutar</button>
                <button onclick="closeModal()">Cerrar</button>
            </div>

            <script>
                const vscode = acquireVsCodeApi();

                // Función para cerrar el modal
                function closeModal() {
                    vscode.postMessage({ command: 'closeModal' });
                }

                // Función para ejecutar la consulta SQL
                function runQuery() {
                    const sql = document.getElementById('sqlEditor').value;
                    vscode.postMessage({ command: 'runQuery', sql });
                }

                // Escucha los mensajes del host
                window.addEventListener('message', event => {
                    const message = event.data;
                    if (message.command === 'closeModal') {
                        panel.dispose();
                    }
                });
            </script>
        </body>
        </html>
    `;

    // Escucha los mensajes del panel webview
    panel.webview.onDidReceiveMessage(async message => {
        if (message.command === 'closeModal') {
            panel.dispose();
        } else if (message.command === 'runQuery') {
            // Recupera la consulta SQL del mensaje
            const sql = message.sql;

            // Configura los datos de conexión a tu base de datos MySQL
            const config = {
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: 'opencore'
            };

            try {
                // Crea una conexión a la base de datos MySQL
                const connection = await mysql.createConnection(config);

                // Ejecuta la consulta SQL
                const [rows] = await connection.execute(sql);

                // Procesa los resultados de la consulta y haz lo que necesites con ellos
                console.log(rows);

                // Cierra la conexión a la base de datos
                connection.end();

                // Puedes enviar los resultados de vuelta al panel webview si es necesario
                panel.webview.postMessage({ command: 'queryResults', results: rows });
            } catch (error) {
                vscode.window.showErrorMessage(`Error al ejecutar la consulta: ${error.message}`);
            }
        }
    });
};