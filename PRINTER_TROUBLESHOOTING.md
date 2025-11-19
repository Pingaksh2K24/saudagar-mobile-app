# Bluetooth Printer Troubleshooting Guide

## Common Issues and Solutions

### 1. "Failed to connect to the printer: Failed to connect using all methods"

**Causes:**
- Printer is not properly paired
- Bluetooth permissions not granted
- Printer is off or out of range
- Android device compatibility issues

**Solutions:**
1. **Check Bluetooth Pairing:**
   - Go to Settings > Bluetooth
   - Make sure printer is paired (not just discovered)
   - If not paired, pair it first

2. **Grant All Permissions:**
   - Go to Settings > Apps > Saudagar > Permissions
   - Enable all Bluetooth permissions:
     - Bluetooth
     - Nearby devices (Android 12+)
     - Location (required for Bluetooth scanning)

3. **Printer Setup:**
   - Turn printer ON
   - Make sure printer is within 10 meters
   - Check if printer has paper
   - Try printing from another app to verify printer works

4. **App Restart:**
   - Close app completely
   - Restart the app
   - Try printing again

### 2. "No paired printer devices found"

**Solutions:**
1. Pair your thermal printer:
   - Settings > Bluetooth > Available devices
   - Find your printer (usually named POS-58, POS-80, or similar)
   - Tap to pair

2. Common printer names to look for:
   - POS-58, POS-80
   - Thermal Printer
   - BlueTooth Printer
   - Any device with "printer" in the name

### 3. "Bluetooth permissions not granted"

**For Android 12+ (API 31+):**
- Bluetooth
- Nearby devices
- Location

**For Android 11 and below:**
- Bluetooth
- Bluetooth Admin
- Location

### 4. Print works on one device but not another

**Possible causes:**
- Different Android versions
- Different Bluetooth stack implementations
- Hardware compatibility
- Device-specific Bluetooth drivers

**Solutions:**
1. **For Samsung devices:**
   - Go to Settings > Apps > Bluetooth > Storage > Clear Data
   - Restart device and re-pair printer

2. **For Xiaomi/MIUI devices:**
   - Settings > Additional Settings > Developer Options > Enable "Disable Bluetooth A2DP hardware offload"
   - Restart device

3. **For OnePlus/OxygenOS:**
   - Settings > Bluetooth > Advanced > Reset Network Settings
   - Re-pair all devices

4. **For all devices:**
   - Try different connection methods (app tries 5 methods automatically)
   - Restart both devices
   - Clear Bluetooth cache: Settings > Apps > Bluetooth > Storage > Clear Cache
   - Reset network settings if nothing else works

### 5. Printer connects but nothing prints

**Solutions:**
1. Check printer paper
2. Check if printer supports ESC/POS commands
3. Try test print from printer settings
4. Verify printer is thermal printer (not inkjet/laser)

## Best Practices

1. **Always pair printer first** in Android Bluetooth settings
2. **Keep printer close** during connection (within 3 meters)
3. **Grant all permissions** when app asks
4. **Restart app** if connection fails multiple times
5. **Use thermal printers** (58mm or 80mm) for best compatibility
6. **Turn off other Bluetooth devices** during printing
7. **Ensure printer has sufficient battery/power**
8. **Test with different Android devices** if available

## Device-Specific Tips

### Samsung Galaxy Series:
- Enable "Developer Options" and turn off "Bluetooth HCI snoop log"
- Use "Smart Connect" feature if available

### Xiaomi/Redmi/POCO:
- Disable "MIUI Optimization" in Developer Options
- Turn off "Memory Extension" if enabled

### OnePlus:
- Disable "Adaptive Connectivity" in Settings
- Use "Gaming Mode" while printing for better performance

### Realme/Oppo:
- Turn off "Auto-launch management" for the app
- Disable "Sleep Standby Optimization"

## Supported Printer Types

- **Thermal Receipt Printers** (58mm, 80mm)
- **ESC/POS Compatible printers**
- **Bluetooth enabled POS printers**
- **Common brands:** Epson, Star, Citizen, Bixolon, MUNBYN

## Tested Compatible Printers

- **POS-58** series
- **POS-80** series  
- **Epson TM-P20/P60/P80**
- **Star SM-L200/L300**
- **MUNBYN ITPP941/ITPP129**
- **Generic ESC/POS thermal printers**

## Not Supported

- WiFi printers
- USB printers
- Inkjet/Laser printers
- Non-ESC/POS printers
- Label printers (unless ESC/POS compatible)

## If Still Having Issues

1. **Check logcat output:**
   ```bash
   adb logcat | grep PrinterModule
   ```

2. **Try different printer models** if available

3. **Test with manufacturer's app** first to ensure printer works

4. **Contact support** with:
   - Device model and Android version
   - Printer model and name
   - Error messages from logcat
   - Steps you've already tried