
# PeakMasterai Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: ERR_NGROK_3200 - Development Server Offline

**Problem:** Users see "HTTP response error 404: The endpoint kph-1xe-anonymous-8081.exp.direct is offline" with error code ERR_NGROK_3200.

**Cause:** This error occurs when using Expo's tunnel mode (`--tunnel`) and the ngrok tunnel becomes unavailable or times out.

**Solutions:**

1. **Restart the development server:**
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart with:
   npm run dev
   ```

2. **Use LAN mode instead of tunnel mode:**
   - Make sure your phone and computer are on the same WiFi network
   - The app will automatically use LAN mode when available

3. **For production builds:**
   - Build the app using EAS Build or create a production build
   - Production builds don't rely on development tunnels

### Issue 2: Limited Button Functionality on Android

**Problem:** Some Android users can only interact with Home and Profile buttons, but other features don't work.

**Cause:** This can be caused by:
- WebView not fully loading
- JavaScript execution issues
- Touch event handling problems
- Network connectivity issues

**Solutions Implemented:**

1. **Enhanced Error Handling:**
   - Added comprehensive error logging
   - Implemented error alerts with retry functionality
   - Added HTTP error detection

2. **Android-Specific Optimizations:**
   - Hardware acceleration enabled
   - Proper touch event handling
   - Android back button support
   - Optimized layer rendering

3. **Debugging Features:**
   - Injected JavaScript for monitoring WebView state
   - Console logging for all WebView events
   - Message passing between WebView and React Native

### Issue 3: Infinite Loading on natively.dev Preview

**Problem:** The preview on natively.dev spins indefinitely with "Loading PeakMasterai..."

**Possible Causes:**
- Network connectivity issues
- WebView initialization problems
- Base44 app not responding
- CORS or security policy issues

**Solutions Implemented:**

1. **Loading State Management:**
   - Proper loading indicators
   - Timeout handling
   - Progress tracking

2. **Reload Functionality:**
   - Manual reload button in header
   - Automatic retry on error
   - WebView key-based remounting

3. **Enhanced Compatibility:**
   - Custom user agent strings
   - Cookie and storage management
   - Mixed content mode enabled

## Testing Checklist

When testing the app, verify:

- [ ] App loads successfully on first launch
- [ ] All buttons and interactive elements work
- [ ] Navigation within the Base44 app works correctly
- [ ] Back button works on Android
- [ ] Reload button refreshes the content
- [ ] Error messages appear when network is unavailable
- [ ] Loading indicator shows during page loads
- [ ] WebView content is fully interactive

## Debug Mode

To enable detailed logging:

1. Open the app
2. Check the console logs in your terminal
3. Look for messages starting with "WebView:"
4. Messages from the WebView will show:
   - Load start/end events
   - Navigation changes
   - JavaScript errors
   - DOM ready state

## Platform-Specific Notes

### Android
- Uses hardware acceleration for better performance
- Implements hardware back button support
- Has additional touch event optimizations
- Uses Android-specific WebView properties

### iOS
- Uses swipe gestures for navigation
- Implements iOS-specific safe area handling
- Uses iOS-optimized WebView settings

## Network Requirements

The app requires:
- Active internet connection
- Access to https://peak-pulse-279d9f00.base44.app
- No firewall blocking the Base44 domain

## Getting Help

If issues persist:

1. Check the console logs for error messages
2. Try the reload button
3. Restart the app completely
4. Check your internet connection
5. Verify the Base44 app is accessible in a web browser

## Recent Improvements

### Version 1.0 Updates:
- ✅ Added comprehensive error handling
- ✅ Implemented Android back button support
- ✅ Added reload functionality
- ✅ Enhanced loading states
- ✅ Added debug logging
- ✅ Improved WebView configuration
- ✅ Platform-specific optimizations
- ✅ Better user feedback on errors
