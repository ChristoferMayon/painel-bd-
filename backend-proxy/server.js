const express = require('express');
require('dotenv').config(); // Loads variables from .env file
const cors = require('cors');

const app = express();
// The port for the server. Uses the hosting environment port (Render) or 3001 locally.
const port = process.env.PORT || 3000; 

// YOUR Z-API CREDENTIALS. Read from process.env (FROM THE .env FILE)
const ZAPI_INSTANCE_ID = process.env.ZAPI_INSTANCE_ID; 
const ZAPI_ACCOUNT_SECURITY_TOKEN = process.env.ZAPI_ACCOUNT_SECURITY_TOKEN; 
const ZAPI_INSTANCE_PATH_TOKEN = process.env.ZAPI_INSTANCE_PATH_TOKEN;

// Checks if credentials were loaded
if (!ZAPI_INSTANCE_ID || !ZAPI_ACCOUNT_SECURITY_TOKEN || !ZAPI_INSTANCE_PATH_TOKEN) {
    console.error("ERROR: Z-API environment variables were not loaded. Check your .env file or environment settings.");
    // In production, you might want to terminate the process: process.exit(1);
}

console.log("Environment Variables Loaded:");
console.log("- ZAPI_INSTANCE_ID:", ZAPI_INSTANCE_ID ? "Loaded" : "NOT LOADED"); 
console.log("- ZAPI_ACCOUNT_SECURITY_TOKEN (in header):", ZAPI_ACCOUNT_SECURITY_TOKEN ? "Loaded" : "NOT LOADED"); 
console.log("- ZAPI_INSTANCE_PATH_TOKEN (in URL):", ZAPI_INSTANCE_PATH_TOKEN ? "Loaded" : "NOT LOADED");
console.log("-----------------------------------------");

// CORS Configuration: Allows requests from the specific origin of your friend's frontend on GitHub Pages
app.use(cors({
    origin: 'https://victorhugo711-te.github.io' // BASE URL of your friend's GitHub Pages
}));

// Middleware to parse JSON request bodies
app.use(express.json());

// ==============================================================================
// ROUTE 1: To SEND MESSAGES WITH BUTTONS (Used by index.html)
// ==============================================================================
app.post('/send-whatsapp-message', async (req, res) => {
    try {
        const { numero, mensagem, tituloBotao, linkBotao } = req.body;

        if (!numero || !mensagem || !tituloBotao || !linkBotao) {
            return res.status(400).json({ error: 'All fields are required to send the message with button.' });
        }

        const payloadParaZapi = {
            phone: numero,
            message: mensagem,
            footer: "Unlock Apple",
            buttonActions: [
                {
                    id: "1",
                    type: "URL",
                    url: linkBotao,
                    label: tituloBotao
                }
            ]
        };

        // Z-API URL to send messages with buttons
        const zapiApiUrl = `https://api.z-api.io/instances/${ZAPI_INSTANCE_ID}/token/${ZAPI_INSTANCE_PATH_TOKEN}/send-button-actions`;

        const zapiResponse = await fetch(zapiApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Client-Token": ZAPI_ACCOUNT_SECURITY_TOKEN // ACCOUNT SECURITY Token in the header
            },
            body: JSON.stringify(payloadParaZapi)
        });

        const dataFromZapi = await zapiResponse.json();

        if (zapiResponse.ok) {
            res.status(zapiResponse.status).json(dataFromZapi);
        } else {
            console.error('Error returned by Z-API (send-button-actions):', dataFromZapi);
            res.status(zapiResponse.status).json({
                error: 'Z-API Error',
                message: dataFromZapi.message || 'Check details in Z-API response.',
                details: dataFromZapi
            });
        }

    } catch (error) {
        console.error('Internal server error in proxy when processing send-button-actions:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});

// ==============================================================================
// ROUTE 2: To SEND CAROUSEL MESSAGES (Used by carousel_panel_stylish.html)
// ==============================================================================
app.post('/send-carousel-message', async (req, res) => {
    try {
        const { phone, message, carousel, delayMessage } = req.body;

        if (!phone || !message || !carousel || !Array.isArray(carousel) || carousel.length === 0) {
            return res.status(400).json({ error: 'Fields "phone", "message" and "carousel" (non-empty array) are required to send carousel.' });
        }

        // Basic validation of carousel cards
        for (const card of carousel) {
            if (!card.text || !card.image) {
                return res.status(400).json({ error: 'Each carousel card must have "text" and "image".' });
            }
            if (card.buttons && !Array.isArray(card.buttons)) {
                return res.status(400).json({ error: 'Card buttons must be an array.' });
            }
        }

        const payloadParaZapi = {
            phone: phone,
            message: message,
            carousel: carousel,
            ...(delayMessage && { delayMessage: delayMessage }) // Adds delayMessage if it exists
        };

        // Z-API URL to send carousel messages
        const zapiApiUrl = `https://api.z-api.io/instances/${ZAPI_INSTANCE_ID}/token/${ZAPI_INSTANCE_PATH_TOKEN}/send-carousel`;

        const zapiResponse = await fetch(zapiApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Client-Token": ZAPI_ACCOUNT_SECURITY_TOKEN // ACCOUNT SECURITY Token in the header
            },
            body: JSON.stringify(payloadParaZapi)
        });

        const dataFromZapi = await zapiResponse.json();

        if (zapiResponse.ok) {
            res.status(zapiResponse.status).json(dataFromZapi);
        } else {
            console.error('Error returned by Z-API (send-carousel):', dataFromZapi);
            res.status(zapiResponse.status).json({
                error: 'Z-API Error',
                message: dataFromZapi.message || 'Check details in Z-API response.',
                details: dataFromZapi
            });
        }

    } catch (error) {
        console.error('Internal server error in proxy when processing send-carousel:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});

// ==============================================================================
// ROUTE 3: To SEND SIMPLE TEXT MESSAGES (send-text)
// ==============================================================================
app.post('/send-simple-text', async (req, res) => {
    try {
        const { phone, message } = req.body; // Only phone and message for send-text

        if (!phone || !message) {
            return res.status(400).json({ error: 'Fields "phone" and "message" are required to send simple text.' });
        }

        const payloadParaZapi = {
            phone: phone,
            message: message
        };

        // Z-API URL to send SIMPLE TEXT
        const zapiApiUrl = `https://api.z-api.io/instances/${ZAPI_INSTANCE_ID}/token/${ZAPI_INSTANCE_PATH_TOKEN}/send-text`;

        const zapiResponse = await fetch(zapiApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Client-Token": ZAPI_ACCOUNT_SECURITY_TOKEN // ACCOUNT SECURITY Token in the header
            },
            body: JSON.stringify(payloadParaZapi)
        });

        const dataFromZapi = await zapiResponse.json();

        if (zapiResponse.ok) {
            res.status(zapiResponse.status).json(dataFromZapi);
        } else {
            console.error('Error returned by Z-API (send-text):', dataFromZapi);
            res.status(zapiResponse.status).json({
                error: 'Z-API Error',
                message: dataFromZapi.message || 'Check details in Z-API response.',
                details: dataFromZapi
            });
        }

    } catch (error) {
        console.error('Internal server error in proxy when processing send-text:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});


// Starts the proxy server
app.listen(port, () => {
    console.log(`Node.js proxy server running on port ${port}`);
    console.log('Open your HTML file in the browser to test locally.');
});
