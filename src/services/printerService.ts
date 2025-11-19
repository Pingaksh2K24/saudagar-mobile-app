import { NativeModules } from 'react-native';

const { PrinterModule } = NativeModules;

export interface PrinterService {
  printReceipt: (receiptText: string) => Promise<string>;
  isAvailable: () => boolean;
}

class BluetoothPrinterService implements PrinterService {
  async printReceipt(receiptText: string): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('Printer module not available');
    }

    try {
      const result = await PrinterModule.printReceipt(receiptText);
      return result;
    } catch (error) {
      // Enhanced error handling
      if (error.code === 'NO_PERMISSION') {
        throw new Error('Bluetooth permissions required. Please enable all Bluetooth permissions in app settings.');
      } else if (error.code === 'BLUETOOTH_DISABLED') {
        throw new Error('Bluetooth is disabled. Please enable Bluetooth and try again.');
      } else if (error.code === 'NO_PRINTER') {
        throw new Error('No paired printer found. Please pair your thermal printer in Bluetooth settings.');
      } else if (error.code === 'CONNECTION_ERROR') {
        throw new Error('Failed to connect to printer. Please ensure printer is on and nearby.');
      } else {
        throw new Error(error.message || 'Print operation failed');
      }
    }
  }

  isAvailable(): boolean {
    return PrinterModule !== undefined && PrinterModule !== null;
  }

  // Helper method to format receipt text
  formatReceipt(data: {
    title?: string;
    items?: Array<{ name: string; price: number; quantity?: number }>;
    total?: number;
    date?: Date;
    footer?: string;
  }): string {
    let receipt = '';
    
    // Header
    if (data.title) {
      receipt += `        ${data.title}\n`;
      receipt += '--------------------------------\n';
    }
    
    // Date and time
    const date = data.date || new Date();
    receipt += `Date: ${date.toLocaleDateString('en-GB')}\n`;
    receipt += `Time: ${date.toLocaleTimeString()}\n`;
    receipt += '--------------------------------\n';
    
    // Items
    if (data.items && data.items.length > 0) {
      data.items.forEach(item => {
        const qty = item.quantity || 1;
        const line = `${item.name}`;
        const price = `₹${item.price * qty}`;
        const spaces = 32 - line.length - price.length;
        receipt += `${line}${' '.repeat(Math.max(1, spaces))}${price}\n`;
        
        if (qty > 1) {
          receipt += `  ${qty} x ₹${item.price}\n`;
        }
      });
      receipt += '--------------------------------\n';
    }
    
    // Total
    if (data.total !== undefined) {
      const totalLine = `TOTAL: ₹${data.total}`;
      const spaces = 32 - totalLine.length;
      receipt += `${' '.repeat(Math.max(0, spaces))}${totalLine}\n`;
      receipt += '--------------------------------\n';
    }
    
    // Footer
    if (data.footer) {
      receipt += `${data.footer}\n`;
    }
    
    receipt += '\n\n\n'; // Extra lines for paper cutting
    
    return receipt;
  }
}

export const printerService = new BluetoothPrinterService();