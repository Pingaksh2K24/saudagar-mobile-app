# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# Keep PrinterModule classes
-keep class com.testapp.PrinterModule { *; }
-keep class com.testapp.PrinterPackage { *; }

# Keep Bluetooth related classes
-keep class android.bluetooth.** { *; }
-dontwarn android.bluetooth.**

# Keep reflection methods used in PrinterModule
-keepclassmembers class android.bluetooth.BluetoothDevice {
    public java.lang.reflect.Method createRfcommSocket(int);
}

# Keep React Native modules
-keep class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.modules.** { *; }
