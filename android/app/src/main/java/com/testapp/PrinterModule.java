package com.testapp;

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.content.pm.PackageManager;
import android.os.Build;
import androidx.core.app.ActivityCompat;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import java.io.IOException;
import java.io.OutputStream;
import java.util.UUID;
import java.lang.reflect.Method;
import android.util.Log;

public class PrinterModule extends ReactContextBaseJavaModule {
    private static final String TAG = "PrinterModule";
    private static final UUID MY_UUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");
    private static final UUID SPP_UUID = UUID.fromString("00001101-0000-1000-8000-00805f9b34fb");
    private static BluetoothSocket currentSocket = null;
    
    public PrinterModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "PrinterModule";
    }

    private void closeCurrentSocket() {
        if (currentSocket != null) {
            try {
                if (currentSocket.isConnected()) {
                    currentSocket.close();
                }
            } catch (Exception e) {
                Log.e(TAG, "Error closing socket: " + e.getMessage());
            } finally {
                currentSocket = null;
            }
        }
    }

    private boolean hasBluetoothPermissions() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            return ActivityCompat.checkSelfPermission(getReactApplicationContext(), Manifest.permission.BLUETOOTH_CONNECT) == PackageManager.PERMISSION_GRANTED &&
                   ActivityCompat.checkSelfPermission(getReactApplicationContext(), Manifest.permission.BLUETOOTH_SCAN) == PackageManager.PERMISSION_GRANTED;
        } else {
            return ActivityCompat.checkSelfPermission(getReactApplicationContext(), Manifest.permission.BLUETOOTH) == PackageManager.PERMISSION_GRANTED &&
                   ActivityCompat.checkSelfPermission(getReactApplicationContext(), Manifest.permission.BLUETOOTH_ADMIN) == PackageManager.PERMISSION_GRANTED;
        }
    }

    @ReactMethod
    public void printReceipt(String receiptText, Promise promise) {
        new Thread(() -> {
            BluetoothSocket socket = null;
            OutputStream outputStream = null;
            
            try {
                Log.d(TAG, "Starting print operation...");
                
                if (!hasBluetoothPermissions()) {
                    promise.reject("NO_PERMISSION", "Bluetooth permissions not granted. Please enable all Bluetooth permissions in app settings.");
                    return;
                }

                BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
                if (bluetoothAdapter == null) {
                    promise.reject("NO_BLUETOOTH", "Bluetooth not supported on this device");
                    return;
                }

                if (!bluetoothAdapter.isEnabled()) {
                    promise.reject("BLUETOOTH_DISABLED", "Bluetooth is disabled. Please enable Bluetooth and try again.");
                    return;
                }

                // Close any existing connection
                closeCurrentSocket();
                
                // Cancel discovery to improve connection reliability
                if (bluetoothAdapter.isDiscovering()) {
                    bluetoothAdapter.cancelDiscovery();
                    Thread.sleep(1000); // Wait for discovery to stop
                }

                BluetoothDevice printerDevice = null;
                
                // Try to find a printer device (look for common printer names)
                for (BluetoothDevice device : bluetoothAdapter.getBondedDevices()) {
                    String deviceName = device.getName();
                    Log.d(TAG, "Found paired device: " + deviceName + " (" + device.getAddress() + ")");
                    if (deviceName != null && (deviceName.toLowerCase().contains("printer") || 
                        deviceName.toLowerCase().contains("pos") || 
                        deviceName.toLowerCase().contains("thermal") ||
                        deviceName.toLowerCase().contains("58") ||
                        deviceName.toLowerCase().contains("80"))) {
                        printerDevice = device;
                        Log.d(TAG, "Selected printer device: " + deviceName);
                        break;
                    }
                }
                
                // If no printer found, use first paired device
                if (printerDevice == null && bluetoothAdapter.getBondedDevices().size() > 0) {
                    printerDevice = bluetoothAdapter.getBondedDevices().iterator().next();
                    Log.d(TAG, "Using first paired device: " + printerDevice.getName());
                }

                if (printerDevice == null) {
                    promise.reject("NO_PRINTER", "No paired printer devices found. Please pair your thermal printer first in Bluetooth settings.");
                    return;
                }
                
                // Try multiple connection methods with improved error handling
                Exception lastException = null;
                boolean connected = false;
                int maxRetries = 5;
                
                for (int retry = 0; retry < maxRetries && !connected; retry++) {
                    Log.d(TAG, "Connection attempt " + (retry + 1) + " of " + maxRetries);
                    
                    // Method 1: Standard RFCOMM socket with SPP UUID
                    if (!connected) {
                        try {
                            Log.d(TAG, "Trying standard RFCOMM socket...");
                            socket = printerDevice.createRfcommSocketToServiceRecord(SPP_UUID);
                            socket.connect();
                            Thread.sleep(100); // Small delay to ensure connection
                            if (socket.isConnected()) {
                                connected = true;
                                Log.d(TAG, "Connected using standard RFCOMM");
                            }
                        } catch (Exception e) {
                            lastException = e;
                            Log.e(TAG, "Standard RFCOMM failed: " + e.getMessage());
                            if (socket != null) {
                                try { socket.close(); } catch (Exception ignored) {}
                                socket = null;
                            }
                        }
                    }
                    
                    // Method 2: Reflection method (channel 1)
                    if (!connected) {
                        try {
                            Log.d(TAG, "Trying reflection method (channel 1)...");
                            Method m = printerDevice.getClass().getMethod("createRfcommSocket", new Class[] { int.class });
                            socket = (BluetoothSocket) m.invoke(printerDevice, 1);
                            socket.connect();
                            Thread.sleep(100);
                            if (socket.isConnected()) {
                                connected = true;
                                Log.d(TAG, "Connected using reflection method channel 1");
                            }
                        } catch (Exception e) {
                            lastException = e;
                            Log.e(TAG, "Reflection method channel 1 failed: " + e.getMessage());
                            if (socket != null) {
                                try { socket.close(); } catch (Exception ignored) {}
                                socket = null;
                            }
                        }
                    }
                    
                    // Method 3: Reflection method (channel 2)
                    if (!connected) {
                        try {
                            Log.d(TAG, "Trying reflection method (channel 2)...");
                            Method m = printerDevice.getClass().getMethod("createRfcommSocket", new Class[] { int.class });
                            socket = (BluetoothSocket) m.invoke(printerDevice, 2);
                            socket.connect();
                            Thread.sleep(100);
                            if (socket.isConnected()) {
                                connected = true;
                                Log.d(TAG, "Connected using reflection method channel 2");
                            }
                        } catch (Exception e) {
                            lastException = e;
                            Log.e(TAG, "Reflection method channel 2 failed: " + e.getMessage());
                            if (socket != null) {
                                try { socket.close(); } catch (Exception ignored) {}
                                socket = null;
                            }
                        }
                    }
                    
                    // Method 4: Insecure RFCOMM socket
                    if (!connected) {
                        try {
                            Log.d(TAG, "Trying insecure RFCOMM socket...");
                            socket = printerDevice.createInsecureRfcommSocketToServiceRecord(SPP_UUID);
                            socket.connect();
                            Thread.sleep(100);
                            if (socket.isConnected()) {
                                connected = true;
                                Log.d(TAG, "Connected using insecure RFCOMM");
                            }
                        } catch (Exception e) {
                            lastException = e;
                            Log.e(TAG, "Insecure RFCOMM failed: " + e.getMessage());
                            if (socket != null) {
                                try { socket.close(); } catch (Exception ignored) {}
                                socket = null;
                            }
                        }
                    }
                    
                    // Method 5: Alternative UUID
                    if (!connected) {
                        try {
                            Log.d(TAG, "Trying alternative UUID...");
                            UUID altUUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");
                            socket = printerDevice.createRfcommSocketToServiceRecord(altUUID);
                            socket.connect();
                            Thread.sleep(100);
                            if (socket.isConnected()) {
                                connected = true;
                                Log.d(TAG, "Connected using alternative UUID");
                            }
                        } catch (Exception e) {
                            lastException = e;
                            Log.e(TAG, "Alternative UUID failed: " + e.getMessage());
                            if (socket != null) {
                                try { socket.close(); } catch (Exception ignored) {}
                                socket = null;
                            }
                        }
                    }
                    
                    if (!connected && retry < maxRetries - 1) {
                        Log.d(TAG, "Waiting before retry...");
                        Thread.sleep(3000); // Longer wait before retry
                    }
                }
                
                if (!connected || socket == null) {
                    String errorMsg = "Failed to connect to the printer: Failed to connect using all methods. Last Error: " + 
                        (lastException != null ? lastException.getMessage() : "Unknown error");
                    Log.e(TAG, errorMsg);
                    promise.reject("CONNECTION_ERROR", errorMsg);
                    return;
                }
                
                currentSocket = socket;
                
                // Verify connection one more time
                if (!socket.isConnected()) {
                    promise.reject("CONNECTION_ERROR", "Socket connection verification failed");
                    return;
                }
                
                Log.d(TAG, "Successfully connected to printer: " + printerDevice.getName());
                
                outputStream = socket.getOutputStream();
                
                // Add delay before writing to ensure connection is stable
                Thread.sleep(500);
                
                // Write data in chunks for better reliability
                byte[] data = receiptText.getBytes("UTF-8");
                int chunkSize = 1024;
                
                for (int i = 0; i < data.length; i += chunkSize) {
                    int end = Math.min(i + chunkSize, data.length);
                    byte[] chunk = new byte[end - i];
                    System.arraycopy(data, i, chunk, 0, end - i);
                    
                    outputStream.write(chunk);
                    outputStream.flush();
                    
                    // Small delay between chunks
                    if (end < data.length) {
                        Thread.sleep(50);
                    }
                }
                
                // Final flush and delay
                outputStream.flush();
                Thread.sleep(1000);
                
                Log.d(TAG, "Print completed successfully");
                promise.resolve("Print successful to " + printerDevice.getName());
                
            } catch (IOException e) {
                Log.e(TAG, "IOException: " + e.getMessage());
                promise.reject("CONNECTION_ERROR", "Failed to connect to the printer: " + e.getMessage());
            } catch (InterruptedException e) {
                Log.e(TAG, "InterruptedException: " + e.getMessage());
                promise.reject("INTERRUPTED", "Print operation was interrupted: " + e.getMessage());
            } catch (Exception e) {
                Log.e(TAG, "General Exception: " + e.getMessage());
                promise.reject("PRINT_ERROR", "Print failed: " + e.getMessage());
            } finally {
                // Clean up resources
                try {
                    if (outputStream != null) {
                        outputStream.close();
                    }
                } catch (IOException e) {
                    Log.e(TAG, "Error closing output stream: " + e.getMessage());
                }
                
                // Keep socket open for potential reuse, but close after delay
                new Thread(() -> {
                    try {
                        Thread.sleep(5000); // Keep connection open for 5 seconds
                        closeCurrentSocket();
                    } catch (InterruptedException e) {
                        closeCurrentSocket();
                    }
                }).start();
            }
        }).start();
    }
}