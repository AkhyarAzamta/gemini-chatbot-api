document.addEventListener('DOMContentLoaded', () => {
  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');
  const chatBox = document.getElementById('chat-box');

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userMessage = userInput.value.trim();

    if (!userMessage) {
      return;
    }

    // Add user's message to chat box
    appendMessage('user', userMessage);
    userInput.value = '';

    // Show "Thinking..." message
    const thinkingMessage = appendMessage('bot', 'Thinking...');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation: [{ role: 'user', text: userMessage }],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server.');
      }

      const data = await response.json();

      if (data.result) {
        // Replace "Thinking..." with the actual response
        thinkingMessage.textContent = data.result;
      } else {
        thinkingMessage.textContent = 'Sorry, no response received.';
      }
    } catch (error) {
      console.error('Error:', error);
      thinkingMessage.textContent = 'Failed to get response from server.';
    }
  });

  function appendMessage(role, text) {
    const messageElement = document.createElement('div');
    const textNode = document.createTextNode(text);
    messageElement.appendChild(textNode);
    messageElement.className = `message ${role}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
    return messageElement;
  }
});