"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const ollama_1 = __importDefault(require("ollama"));
function activate(context) {
    console.log('Congratulations, your extension "deepseek-ai-ext" is now active!');
    const disposable = vscode.commands.registerCommand("deepseek-ai-ext.start", () => {
        const panel = vscode.window.createWebviewPanel("deepSeekChat", "DeepSeek Chat", vscode.ViewColumn.One, { enableScripts: true });
        panel.webview.html = getWebViewContent();
        panel.webview.onDidReceiveMessage(async (message) => {
            if (message.command === "chat") {
                const userPrompt = message.text;
                let responseText = "";
                try {
                    const streamResponse = await ollama_1.default.chat({
                        model: "deepseek-r1:latest",
                        messages: [{ role: "user", content: userPrompt }],
                        stream: true,
                    });
                    for await (const part of streamResponse) {
                        responseText += part.message.content;
                        panel.webview.postMessage({
                            command: "chatResponse",
                            text: responseText,
                        });
                    }
                }
                catch (error) {
                    panel.webview.postMessage({
                        command: "chatResponse",
                        text: `Error: ${String(error)}`,
                    });
                }
            }
        });
    });
    context.subscriptions.push(disposable);
}
function deactivate() { }
const getWebViewContent = () => {
    return /*html*/ `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
            <style>
              body {
                margin: 1rem;
                font-family: 'Poppins', sans-serif;
              }

              h2 {
                text-align: center;
              }

              #prompt {
                font-family: inherit;
                padding: .5rem;
                font-size: 1rem;
                resize: none;
                border: none;
                overflow: hidden;
                background-color: #313a52;
                color: white;
                outline: none;
                field-sizing: content;
                line-height: 1.5rem;
                margin: auto;
                width: 100%;
                box-sizing: border-box;
                font-weight: 600;
              }

              #askButton {
                height: 50px;
                width: 50px;
                border-radius: .5rem;
                border: none;
                cursor: pointer;
                background: #455172;
                color: white;
              }

              #askButton:hover {
                background-color: #60719f;
                transition: .1s ease-in-out;
              }

              #response {
                padding: 1rem;
                font-size: 1rem;
                line-height: 1.5rem;
                min-height: 100px;
                border-radius: 1rem;
                margin: 1rem 0 1rem 0;
                color: white;
                background-color: #313a52;
                font-weight: 600;
                max-width: 800px;
                min-height: 200px;
                margin: 0 auto 1.5rem;
              }

              #user-prompt {
                padding: 1rem;
                font-size: 1rem;
                line-height: 1.5rem;
                border-radius: 1rem;
                margin: 1rem 0 1rem 0;
                color: white;
                background-color: #313a52;
                font-weight: 600;
                max-width: 800px;
                margin: 0 auto 1.5rem;
              }

              .user-input {
                display: flex;
                max-width: 820px;
                padding: 0.5rem;
                border-radius: 1rem;
                background-color: #313a52;
                align-items: end;
                margin: auto;
              }
            </style>
          </head>
          <body>
            <h2>Chat with DeepSeek AI</h2>
            <div id="user-prompt"></div>
            <div id="response"></div>
            <div class="user-input">
              <textarea id="prompt" role="textbox" spellcheck="true" enterkeyhint="enter" rows="3" placeholder="Message DeepSeek"></textarea>
              <button id="askButton">
                <i class="fa-solid fa-paper-plane"></i>
              </button>
            </div>

            <script>
              const vscode = acquireVsCodeApi();

              document.getElementById('user-prompt').style.display = 'none';
              document.getElementById('response').style.display = 'none';

              document.getElementById('askButton').addEventListener('click', () => {
                const text = document.getElementById('prompt').value;

                if (text.trim() === '') {
                  return;
                }

                document.getElementById('user-prompt').innerText = "You: " + text;
                document.getElementById('user-prompt').style.display = 'block';

                document.getElementById('response').style.display = 'block';
                document.getElementById('prompt').value = '';

                vscode.postMessage({ command: 'chat', text });
              });

              window.addEventListener('message', event => {
                const { command, text } = event.data;
                if (command === 'chatResponse') {
                  document.getElementById('response').innerText = text;
                }
              });
            </script>
          </body>
          </html>`;
};
//# sourceMappingURL=extension.js.map