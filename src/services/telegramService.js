// Telegram service to send receipt details directly to Telegram API
export const sendReceiptToTelegram = async (
  receiptData,
  showNotification = null
) => {
  try {
    if (showNotification) {
      showNotification({
        type: 'info',
        message: 'Sending receipt to admin...',
      });
    }

    const {
      receiptId,
      userName,
      gameName,
      totalAmount,
      bids,
      selectedSession,
      date,
    } = receiptData;

    // Validate required data
    if (!receiptId || !userName || !gameName || !totalAmount || !bids) {
      if (showNotification) {
        showNotification({
          type: 'error',
          message: 'Missing required receipt data',
        });
      }
      return { success: false, error: 'Missing required receipt data' };
    }

    // Format message with proper escaping
    const bidDetails = bids
      .map(
        (bid, index) =>
          `${index + 1}. ${bid.bid_name || 'N/A'} - ${bid.bid_number || 'N/A'} - ₹${bid.amount || 0}`
      )
      .join('\n');

    const message = `🧾 NEW BID RECEIPT\n\n📋 Receipt ID: ${receiptId}\n👤 Agent: ${userName}\n🎮 Game: ${gameName}\n⏰ Session: ${selectedSession}\n📅 Date: ${date}\n\n💰 BID DETAILS:\n${bidDetails}\n\n💵 Total Amount: ₹${totalAmount}`;

    const botToken = '8582589555:AAEQPIRal_0tSSpmHvFx64qGPXLVfkr6A5o';
    const chatId = '891739768';
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const result = await response.json();

    if (result.ok) {
      if (showNotification) {
        // showNotification({
        //   type: 'success',
        //   title: 'Receipt Sent',
        // });
      }
      return { success: true, data: result };
    } else {
      if (showNotification) {
        showNotification({
          type: 'error',
          message: `Failed to send receipt: ${result.description || 'Unknown error'}`,
        });
      }
      return { success: false, error: result.description || 'Unknown error' };
    }
  } catch (error) {
    if (showNotification) {
      showNotification({
        type: 'error',
        message: `Error sending receipt: ${error.message}`,
      });
    }
    return { success: false, error: error.message };
  }
};

// Send contact message to admin via Telegram
export const sendContactMessageToTelegram = async (
  messageData,
  showNotification = null
) => {
  try {
    const { agentName, agentMobile, message } = messageData;

    // Validate required data
    if (!agentName || !message) {
      if (showNotification) {
        showNotification({
          type: 'error',
          title: 'Error',
          message: 'Missing required message data',
        });
      }
      return { success: false, error: 'Missing required message data' };
    }

    // Format message
    const telegramMessage = `📞 CONTACT MESSAGE\n\n👤 Agent Name: ${agentName}\n📱 Mobile: ${agentMobile || 'Not provided'}\n\n💬 Message:\n${message}`;

    const botToken = '8582589555:AAEQPIRal_0tSSpmHvFx64qGPXLVfkr6A5o';
    const chatId = '891739768';
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramMessage,
        parse_mode: 'HTML',
      }),
    });

    const result = await response.json();

    if (result.ok) {
      if (showNotification) {
        showNotification({
          type: 'success',
          title: 'Message Sent',
          message: 'Your message has been sent to admin successfully!',
        });
      }
      return { success: true, data: result };
    } else {
      if (showNotification) {
        showNotification({
          type: 'error',
          title: 'Error',
          message: `Failed to send message: ${result.description || 'Unknown error'}`,
        });
      }
      return { success: false, error: result.description || 'Unknown error' };
    }
  } catch (error) {
    if (showNotification) {
      showNotification({
        type: 'error',
        title: 'Error',
        message: `Error sending message: ${error.message}`,
      });
    }
    return { success: false, error: error.message };
  }
};
