document.addEventListener('DOMContentLoaded', () => {
  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');
  const chatBox = document.getElementById('chat-box');

  let conversationHistory = [];

  // Simple Markdown to HTML converter
  function markdownToHtml(text) {
    // Escape HTML to prevent XSS, but keep line breaks for the next step
    let escapedText = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Bold: **text**
    escapedText = escapedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic: *text*
    escapedText = escapedText.replace(/(^|[^\*])\*(?!\*)([^\*]+)\*(?!\*)/g, '$1<em>$2</em>');

    // Lists: * item or - item
    escapedText = escapedText.replace(/^\s*[\*-]\s+(.*)$/gm, '<ul><li>$1</li></ul>');
    escapedText = escapedText.replace(/<\/ul>\s*<ul>/g, '');

    // Newlines to <br>
    escapedText = escapedText.replace(/\n/g, '<br>');

    return escapedText;
  }

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userMessage = userInput.value.trim();

    if (!userMessage) {
      return;
    }

    appendMessage('user', userMessage);
    conversationHistory.push({ role: 'user', text: userMessage });
    userInput.value = '';

    const thinkingMessage = appendMessage('bot', 'Thinking...');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation: conversationHistory,
        }),
      });

      if (!response.ok) {
        // Try to get the detailed error message from the server
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response from server.');
      }

      const data = await response.json();
      let botMessageText = 'Sorry, no response received.';

      if (data.result) {
        botMessageText = data.result;
      }

      thinkingMessage.innerHTML = markdownToHtml(botMessageText);
      conversationHistory.push({ role: 'model', text: botMessageText });

    } catch (error) {
      console.error('Error:', error);
      // Display error in a better formatted way
      const errorMessage = formatErrorMessage(error.message);
      thinkingMessage.className = 'message error';
      thinkingMessage.innerHTML = DOMPurify.sanitize(errorMessage);
      // Add the error to history so the model knows an error occurred.
      conversationHistory.push({ role: 'model', text: `Error: ${error.message}` });
    }
  });

  function formatErrorMessage(errorMsg) {
    // Check if it's a quota/rate limit error
    if (errorMsg.includes('quota') || errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED')) {
      return `
        <div class="error-header">
          <i class="fas fa-exclamation-circle"></i>
          <span>Batas Penggunaan Terlampaui</span>
        </div>
        <div class="error-content">
          <p><strong>API quota atau rate limit telah terlampaui.</strong></p>
          <p>Sistem terbatas dalam jumlah permintaan per waktu tertentu. Silakan:</p>
          <ul>
            <li>Tunggu beberapa saat sebelum mencoba lagi</li>
            <li>Cek rencana Google API Anda untuk informasi lebih lanjut</li>
            <li>Kunjungi <a href="https://ai.google.dev/gemini-api/docs/rate-limits" target="_blank">dokumentasi rate limits</a></li>
          </ul>
        </div>
      `;
    }

    // Check if it's a content validation error
    if (errorMsg.includes('Invalid value') || errorMsg.includes('INVALID_ARGUMENT')) {
      return `
        <div class="error-header">
          <i class="fas fa-exclamation-triangle"></i>
          <span>Format Pesan Tidak Valid</span>
        </div>
        <div class="error-content">
          <p>Ada masalah dengan format pesan yang dikirim.</p>
          <p>Coba lagi dengan pesan yang lebih sederhana atau hubungi developer.</p>
        </div>
      `;
    }

    // Generic error message
    return `
      <div class="error-header">
        <i class="fas fa-times-circle"></i>
        <span>Terjadi Kesalahan</span>
      </div>
      <div class="error-content">
        <p><strong>Error:</strong> ${escapeHtml(errorMsg)}</p>
        <p>Silakan coba lagi atau hubungi tim dukungan jika masalah berlanjut.</p>
      </div>
    `;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function appendMessage(role, text) {
    const messageElement = document.createElement('div');

    // For user messages, just set text to avoid any markdown interpretation
    if (role === 'user') {
      messageElement.textContent = text;
    } else {
      // For bot messages, parse potential markdown
      const htmlContent = markdownToHtml(text);
      messageElement.innerHTML = DOMPurify.sanitize(htmlContent);
    }

    const displayRole = role === 'model' ? 'bot' : role;
    messageElement.className = `message ${displayRole}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
    return messageElement;
  }
});
