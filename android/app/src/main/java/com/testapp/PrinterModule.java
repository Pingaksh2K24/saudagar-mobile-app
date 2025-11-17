package com.testapp;

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.content.pm.PackageManager;
import androidx.core.app.ActivityCompat;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import java.io.IOException;
import java.io.OutputStream;
import java.util.UUID;

public class PrinterModule extends ReactContextBaseJavaModule {
    private static final UUID MY_UUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");
    
    public PrinterModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "PrinterModule";
    }

    @ReactMethod
    public void printReceipt(String receiptText, Promise promise) {
        BluetoothSocket socket = null;
        OutputStream outputStream = null;
        
        try {
            if (ActivityCompat.checkSelfPermission(getReactApplicationContext(), Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
                promise.reject("NO_PERMISSION", "Bluetooth permission not granted. Please enable in app settings.");
                return;
            }

            BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
            if (bluetoothAdapter == null) {
                promise.reject("NO_BLUETOOTH", "Bluetooth not supported");
                return;
            }

            if (!bluetoothAdapter.isEnabled()) {
                promise.reject("BLUETOOTH_DISABLED", "Bluetooth is disabled. Please enable Bluetooth.");
                return;
            }

            BluetoothDevice printerDevice = null;
            
            // Try to find a printer device (look for common printer names)
            for (BluetoothDevice device : bluetoothAdapter.getBondedDevices()) {
                String deviceName = device.getName();
                if (deviceName != null && (deviceName.toLowerCase().contains("printer") || 
                    deviceName.toLowerCase().contains("pos") || 
                    deviceName.toLowerCase().contains("thermal"))) {
                    printerDevice = device;
                    break;
                }
            }
            
            // If no printer found, use first paired device
            if (printerDevice == null && bluetoothAdapter.getBondedDevices().size() > 0) {
                printerDevice = bluetoothAdapter.getBondedDevices().iterator().next();
            }

            if (printerDevice == null) {
                promise.reject("NO_PRINTER", "No paired printer devices found. Please pair your printer first.");
                return;
            }

            // Create socket and connect
            socket = printerDevice.createRfcommSocketToServiceRecord(MY_UUID);
            
            // Cancel discovery to improve connection reliability
            bluetoothAdapter.cancelDiscovery();
            
            // Connect with timeout handling
            socket.connect();
            
            // Verify connection
            if (!socket.isConnected()) {
                throw new IOException("Failed to establish connection to printer");
            }
            
            outputStream = socket.getOutputStream();
            
            // Add small delay before writing
            Thread.sleep(100);
            
            // Write data
            outputStream.write(receiptText.getBytes("UTF-8"));
            outputStream.flush();
            
            // Add delay to ensure data is sent
            Thread.sleep(500);
            
            promise.resolve("Print successful to " + printerDevice.getName());
            
        } catch (IOException e) {
            promise.reject("CONNECTION_ERROR", "Failed to connect to printer: " + e.getMessage());
        } catch (InterruptedException e) {
            promise.reject("INTERRUPTED", "Print operation was interrupted: " + e.getMessage());
        } catch (Exception e) {
            promise.reject("PRINT_ERROR", "Print failed: " + e.getMessage());
        } finally {
            // Ensure resources are properly closed
            try {
                if (outputStream != null) {
                    outputStream.close();
                }
                if (socket != null && socket.isConnected()) {
                    socket.close();
                }
            } catch (IOException e) {
                // Log but don't fail the promise
            }
        }
    }
}