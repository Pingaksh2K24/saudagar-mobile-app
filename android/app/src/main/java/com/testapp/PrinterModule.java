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

            StringBuilder deviceList = new StringBuilder("Paired devices: ");
            for (BluetoothDevice device : bluetoothAdapter.getBondedDevices()) {
                deviceList.append(device.getName()).append(", ");
            }
            
            BluetoothDevice printerDevice = null;
            if (bluetoothAdapter.getBondedDevices().size() > 0) {
                printerDevice = bluetoothAdapter.getBondedDevices().iterator().next();
            }

            if (printerDevice == null) {
                promise.reject("NO_PRINTER", "No paired devices found. " + deviceList.toString());
                return;
            }

            BluetoothSocket socket = printerDevice.createRfcommSocketToServiceRecord(MY_UUID);
            socket.connect();
            
            OutputStream outputStream = socket.getOutputStream();
            outputStream.write(receiptText.getBytes());
            outputStream.flush();
            
            socket.close();
            promise.resolve("Print successful");
            
        } catch (IOException e) {
            promise.reject("PRINT_ERROR", e.getMessage());
        }
    }
}