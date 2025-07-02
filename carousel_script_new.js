// ATTENTION: This URL is the REAL URL of the proxy hosted on Render.com for your friend's project.
const proxyBaseUrl = 'https://whats-zap-painel.onrender.com'; // URL of the friend's proxy on Render.com
const proxyCarouselUrl = `${proxyBaseUrl}/send-carousel-message`;

let cardCounter = 0; // To give unique IDs to cards

// Adds a new card to the carousel
function addCarouselCard() {
    cardCounter++;
    const container = document.getElementById('carousel-cards-container');
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card-editor bg-white p-5 rounded-lg shadow-md border border-gray-200';
    cardDiv.setAttribute('data-card-id', cardCounter);
    cardDiv.innerHTML = `
        <h3 class="text-lg font-semibold text-gray-700 mb-4">Card #${cardCounter}</h3>
        <div class="space-y-3">
            <div>
                <label for="card-text-${cardCounter}" class="block text-sm font-medium text-gray-700 mb-1">Card Text:</label>
                <textarea id="card-text-${cardCounter}" rows="2" placeholder="Text for this card"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out shadow-sm"></textarea>
            </div>

            <div>
                <label for="card-image-${cardCounter}" class="block text-sm font-medium text-gray-700 mb-1">Card Image URL:</label>
                <input type="url" id="card-image-${cardCounter}" placeholder="https://example.com/image.jpg"
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out shadow-sm" />
            </div>
        </div>
        
        <h4 class="text-md font-semibold text-gray-700 mt-6 mb-3">Buttons for Card #${cardCounter}</h4>
        <div id="card-buttons-container-${cardCounter}" class="space-y-3">
            <!-- Buttons will be added here -->
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
            <button class="add-button-btn flex-grow py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition duration-150 ease-in-out"
                            onclick="addCardButton(${cardCounter})">
                + Add Button
            </button>
            <button class="remove-card-btn flex-grow py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-150 ease-in-out"
                            onclick="removeCarouselCard(${cardCounter})">
                - Remove Card
            </button>
        </div>
    `;
    container.appendChild(cardDiv);

    // Adds a default button to the new card
    addCardButton(cardCounter);
}

// Adds a new button to a specific card
function addCardButton(cardId) {
    const buttonsContainer = document.getElementById(`card-buttons-container-${cardId}`);
    const buttonDiv = document.createElement('div');
    buttonDiv.className = 'button-editor bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm';
    const buttonIndex = buttonsContainer.children.length; // Uses the index for unique ID within the card
    buttonDiv.innerHTML = `
        <div class="space-y-2">
            <div>
                <label for="button-type-${cardId}-${buttonIndex}" class="block text-sm font-medium text-gray-700 mb-1">Button Type:</label>
                <select id="button-type-${cardId}-${buttonIndex}" onchange="toggleButtonFields(${cardId}, ${buttonIndex})"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out shadow-sm">
                    <option value="URL">URL</option>
                    <option value="REPLY">Quick Reply</option>
                    <option value="CALL">Call</option>
                </select>
            </div>

            <div>
                <label for="button-label-${cardId}-${buttonIndex}" class="block text-sm font-medium text-gray-700 mb-1">Button Text:</label>
                <input type="text" id="button-label-${cardId}-${buttonIndex}" placeholder="Ex: Learn More"
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out shadow-sm" />
            </div>
            
            <div id="button-url-field-${cardId}-${buttonIndex}" class="button-field">
                <label for="button-url-${cardId}-${buttonIndex}" class="block text-sm font-medium text-gray-700 mb-1">URL:</label>
                <input type="url" id="button-url-${cardId}-${buttonIndex}" placeholder="https://example.com/link"
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out shadow-sm" />
            </div>
            <div id="button-phone-field-${cardId}-${buttonIndex}" class="button-field hidden">
                <label for="button-phone-${cardId}-${buttonIndex}" class="block text-sm font-medium text-gray-700 mb-1">Phone Number (with DDI, no +):</label>
                <input type="text" id="button-phone-${cardId}-${buttonIndex}" placeholder="Ex: 5511999999999"
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out shadow-sm" />
            </div>
            <input type="hidden" id="button-id-${cardId}-${buttonIndex}" value="btn_${cardId}_${buttonIndex}" />
        </div>
        <button class="remove-button-btn mt-4 py-2 px-4 bg-red-400 text-white font-semibold rounded-lg shadow-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-75 transition duration-150 ease-in-out">
            - Remove Button
        </button>
    `;
    buttonsContainer.appendChild(buttonDiv);
    // Adds the event listener to the newly created remove button
    buttonDiv.querySelector('.remove-button-btn').onclick = () => removeCardButton(buttonDiv);
    toggleButtonFields(cardId, buttonIndex); // Initializes visible fields
}

// Toggles the visibility of URL/Phone fields based on button type
function toggleButtonFields(cardId, buttonIndex) {
    const buttonType = document.getElementById(`button-type-${cardId}-${buttonIndex}`).value;
    const urlField = document.getElementById(`button-url-field-${cardId}-${buttonIndex}`);
    const phoneField = document.getElementById(`button-phone-field-${cardId}-${buttonIndex}`);

    if (urlField) urlField.classList.add('hidden');
    if (phoneField) phoneField.classList.add('hidden');

    if (buttonType === 'URL') {
        if (urlField) urlField.classList.remove('hidden');
    } else if (buttonType === 'CALL') {
        if (phoneField) phoneField.classList.remove('hidden');
    }
    // REPLY does not show any additional fields
}

// Removes a specific carousel card
function removeCarouselCard(cardId) {
    const cardDiv = document.querySelector(`.card-editor[data-card-id="${cardId}"]`);
    if (cardDiv) {
        cardDiv.remove();
    }
}

// Removes a specific button from a card
function removeCardButton(buttonElementDiv) {
    buttonElementDiv.remove();
}


// Sends the carousel message
async function enviarCarrossel() {
    const log = document.getElementById('log');
    const numero = document.getElementById('numero').value.trim();
    const mensagemGeral = document.getElementById('mensagemGeral').value.trim();
    const delayMessage = document.getElementById('delayMessage').value.trim();

    if (!numero || !mensagemGeral) {
        log.innerText = '❌ Please fill in the client number and general message.';
        return;
    }

    const carouselCards = [];
    const cardEditors = document.querySelectorAll('.card-editor');

    if (cardEditors.length === 0) {
        log.innerText = '❌ Please add at least one card to the carousel.';
        return;
    }

    for (const cardEditor of cardEditors) {
        const cardId = cardEditor.getAttribute('data-card-id');
        const cardText = document.getElementById(`card-text-${cardId}`).value.trim();
        const cardImage = document.getElementById(`card-image-${cardId}`).value.trim();

        if (!cardText || !cardImage) {
            log.innerText = `❌ Card #${cardId} requires text and image URL.`;
            return;
        }

        const cardButtons = [];
        const buttonEditors = cardEditor.querySelectorAll(`.button-editor`);
        
        for (let i = 0; i < buttonEditors.length; i++) {
            const buttonType = document.getElementById(`button-type-${cardId}-${i}`).value;
            const buttonLabel = document.getElementById(`button-label-${cardId}-${i}`).value.trim();
            const buttonId = document.getElementById(`button-id-${cardId}-${i}`).value.trim();

            if (!buttonLabel) {
                log.innerText = `❌ Button #${i+1} of card #${cardId} requires text (label).`;
                return;
            }

            const button = {
                type: buttonType,
                label: buttonLabel,
                id: buttonId // Optional, but useful for identification
            };

            if (buttonType === 'URL') {
                const buttonUrl = document.getElementById(`button-url-${cardId}-${i}`).value.trim();
                if (!buttonUrl) {
                    log.innerText = `❌ URL button #${i+1} of card #${cardId} requires a URL.`;
                    return;
                }
                button.url = buttonUrl;
            } else if (buttonType === 'CALL') {
                const buttonPhone = document.getElementById(`button-phone-${cardId}-${i}`).value.trim();
                if (!buttonPhone) {
                    log.innerText = `❌ Call button #${i+1} of card #${cardId} requires a phone number.`;
                    return;
                }
                button.phone = buttonPhone;
            }
            // REPLY does not need url or phone

            cardButtons.push(button);
        }

        carouselCards.push({
            text: cardText,
            image: cardImage,
            buttons: cardButtons
        });
    }

    const payload = {
        phone: numero,
        message: mensagemGeral,
        carousel: carouselCards,
    };

    if (delayMessage) {
        payload.delayMessage = parseInt(delayMessage);
    }

    try {
        log.innerText = 'Sending carousel...';
        const response = await fetch(proxyCarouselUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            log.innerText = '✅ Carousel sent successfully:\n' + JSON.stringify(data, null, 2);
        } else {
            log.innerText = '❌ Error sending carousel:\n' + JSON.stringify(data, null, 2);
            console.error('Error in proxy response:', data);
        }
    } catch (error) {
        log.innerText = '❌ Connection error with proxy:\n' + error.message;
        console.error('Network or proxy error:', error);
    }
}

// Adds an initial card when the page loads
document.addEventListener('DOMContentLoaded', () => {
    addCarouselCard(); 
});
