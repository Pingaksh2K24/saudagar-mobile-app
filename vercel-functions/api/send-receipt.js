// Vercel serverless function to send receipt to Telegram
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { receiptId, userName, gameName, totalAmount, bids, selectedSession, date } = req.body;

    // Telegram bot credentials (keep secure on server)
    const BOT_TOKEN = '8582589555:AAEQPIRal_0tSSpmHvFx64qGPXLVfkr6A5o';
    const CHAT_ID = '891739768';

    // Format receipt message
    const message = `
🧾 *NEW BID RECEIPT*

📋 Receipt ID: \`${receiptId}\`
👤 Player: *${userName}*
🎮 Game: *${gameName}*
⏰ Session: *${selectedSession}*
📅 Date: ${date}

💰 *BID DETAILS:*
${bids.map((bid, index) => 
  `${index + 1}. ${bid.bid_name} - ${bid.bid_number} - ₹${bid.amount}`
).join('\n')}

💵 *Total Amount: ₹${totalAmount}*

📝 Note: Keep this receipt safe for records
    `;

    // Send message to Telegram
    const telegramResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const telegramResult = await telegramResponse.json();

    if (telegramResult.ok) {
      res.status(200).json({ success: true, message: 'Receipt sent to Telegram' });
    } else {
      console.error('Telegram API error:', telegramResult);
      res.status(500).json({ error: 'Failed to send to Telegram' });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}