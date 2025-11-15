import Printer, { COMMANDS, USBPrinter, BLEPrinter, NetPrinter } from '@haroldtran/react-native-thermal-printer';

export interface PrinterDevice {
  device_name: string;
  device_id: string;
  inner_mac_address?: string;
}

export class MyThermalPrinter {
  // Scan paired BLE printers
  static async getBLEDevices(): Promise<PrinterDevice[]> {
    try {
      const devices = await BLEPrinter.getDeviceList(); // Returns array of devices
      console.log('BLE Devices found:', devices);
      return devices.map((device: any) => ({
        device_name: device.name || 'Unknown',
        device_id: device.address,
        inner_mac_address: device.address,
      }));
    } catch (error) {
      console.error('Error getting BLE devices:', error);
      return [];
    }
  }

  // Connect to a BLE printer
  static async connectBLE(device: PrinterDevice): Promise<boolean> {
    try {
      await BLEPrinter.connect(device.device_id);
      console.log('BLE Printer connected:', device.device_name);
      return true;
    } catch (error) {
      console.error('Error connecting BLE printer:', error);
      return false;
    }
  }

  // Main print function
  static async printReceipt(receiptData: any, receiptNo: string): Promise<boolean> {
    try {
      const bleDevices = await this.getBLEDevices();
      if (bleDevices.length === 0) {
        console.error('No BLE printer found');
        return false;
      }

      // Select first PosBox or first device
      const printerDevice = bleDevices.find(d => d.device_name.includes('PosBox')) || bleDevices[0];

      const connected = await this.connectBLE(printerDevice);
      if (!connected) return false;

      await this.printFormattedReceipt(receiptData, receiptNo);
      return true;
    } catch (error) {
      console.error('Error printing receipt:', error);
      return false;
    }
  }

  private static async printFormattedReceipt(receiptData: any, receiptNo: string) {
    const gameName = receiptData.bids?.[0]?.game_name || 'Game';
    const agentName = receiptData.receipt_info?.agent_name || 'Agent';
    const receiptDate = receiptData.receipt_info?.receipt_date
      ? new Date(receiptData.receipt_info.receipt_date).toLocaleDateString('en-GB')
      : new Date().toLocaleDateString('en-GB');
    const session = receiptData.receipt_info?.session || 'Open';
    const totalAmount = receiptData.receipt_info?.total_amount || 0;

    // Center header
    await BLEPrinter.setAlign('center');
    await BLEPrinter.printText('SAUDAGAR\n');
    await BLEPrinter.printText(`${gameName}\n`);
    await BLEPrinter.printText(`Receipt #${receiptData.receipt_info?.receipt_no || receiptNo}\n`);
    await BLEPrinter.printText('--------------------------------\n');

    // Left aligned details
    await BLEPrinter.setAlign('left');
    await BLEPrinter.printText(`Agent: ${agentName}\n`);
    await BLEPrinter.printText(`Date: ${receiptDate}\n`);
    await BLEPrinter.printText(`Session: ${session}\n`);
    await BLEPrinter.printText('--------------------------------\n');

    // Center BID DETAILS
    await BLEPrinter.setAlign('center');
    await BLEPrinter.printText('BID DETAILS\n');
    await BLEPrinter.printText('--------------------------------\n');

    for (const [index, bid] of (receiptData.bids || []).entries()) {
      await BLEPrinter.printText(`${index + 1}. ${bid.bid_type_name} - ${bid.bid_number} - Rs${bid.amount}\n`);
    }

    await BLEPrinter.printText('--------------------------------\n');
    await BLEPrinter.printText(`TOTAL: Rs${totalAmount}\n`);
    await BLEPrinter.printText('--------------------------------\n');
    await BLEPrinter.printText('* Receipt generated upon request\n\n\n');
  }
}
