
# WebView Implementation Guide

## Overview

PeakMasterai uses React Native WebView to embed the Base44 web application (https://peak-pulse-279d9f00.base44.app) into a native mobile app.

## Architecture

### File Structure

```
app/(tabs)/(home)/
├── index.tsx          # Default/fallback implementation
├── index.ios.tsx      # iOS-specific implementation
└── index.android.tsx  # Android-specific implementation
```

### Platform-Specific Features

#### iOS (index.ios.tsx)
- Swipe gestures for navigation (`allowsBackForwardNavigationGestures`)
- Safe area handling with proper padding
- iOS-optimized user agent
- Bounce effect enabled

#### Android (index.android.tsx)
- Hardware back button support
- Hardware acceleration
- Android-specific layer rendering
- Elevation for UI elements
- Optimized scroll behavior

#### Cross-Platform (index.tsx)
- Fallback for all platforms
- Includes both iOS and Android features
- Conditional platform checks

## Key Features

### 1. Error Handling

```typescript
const handleError = (syntheticEvent: any) => {
  const { nativeEvent } = syntheticEvent;
  console.error('WebView error:', nativeEvent);
  setError(`Failed to load: ${nativeEvent.description || 'Unknown error'}`);
  setLoading(false);
  
  Alert.alert(
    'Loading Error',
    `Could not load PeakMasterai...`,
    [{ text: 'Retry', onPress: handleReload }]
  );
};
```

### 2. Navigation Management

```typescript
const handleNavigationStateChange = (navState: any) => {
  console.log('WebView: Navigation state changed:', navState.url);
  setCurrentUrl(navState.url);
  setCanGoBack(navState.canGoBack);
};
```

### 3. Android Back Button

```typescript
const onAndroidBackPress = useCallback(() => {
  if (canGoBack && webViewRef.current) {
    webViewRef.current.goBack();
    return true; // prevent default behavior (exit app)
  }
  return false;
}, [canGoBack]);

useEffect(() => {
  if (Platform.OS === 'android') {
    BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onAndroidBackPress);
    };
  }
}, [onAndroidBackPress]);
```

### 4. Injected JavaScript

The app injects JavaScript into the WebView for:
- Debugging and monitoring
- Error tracking
- DOM ready detection
- Communication with React Native

```javascript
const injectedJavaScript = `
  (function() {
    console.log('PeakMasterai WebView initialized');
    
    // Send debug info back to React Native
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'debug',
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    }));
    
    // Log any JavaScript errors
    window.addEventListener('error', function(e) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'error',
        message: e.message,
        filename: e.filename,
        lineno: e.lineno
      }));
    });
    
    true; // Required for injected JavaScript
  })();
`;
```

### 5. User Agent Customization

Custom user agents help with:
- Server-side detection
- Analytics
- Compatibility

```typescript
// iOS
userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 PeakMasterai/1.0"

// Android
userAgent="Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 PeakMasterai/1.0"
```

## WebView Props Explained

### Essential Props

| Prop | Purpose |
|------|---------|
| `source={{ uri: '...' }}` | URL to load |
| `javaScriptEnabled={true}` | Enable JavaScript execution |
| `domStorageEnabled={true}` | Enable localStorage/sessionStorage |
| `onLoadStart` | Called when loading starts |
| `onLoadEnd` | Called when loading completes |
| `onError` | Called on loading errors |
| `onMessage` | Receives messages from WebView |

### Performance Props

| Prop | Purpose |
|------|---------|
| `cacheEnabled={true}` | Enable caching for better performance |
| `androidLayerType="hardware"` | Use hardware acceleration (Android) |
| `androidHardwareAccelerationDisabled={false}` | Keep hardware acceleration on |

### Security Props

| Prop | Purpose |
|------|---------|
| `originWhitelist={['*']}` | Allow all origins |
| `mixedContentMode="always"` | Allow mixed HTTP/HTTPS content |
| `thirdPartyCookiesEnabled={true}` | Enable third-party cookies |
| `sharedCookiesEnabled={true}` | Share cookies with native |

### UX Props

| Prop | Purpose |
|------|---------|
| `startInLoadingState={true}` | Show loading indicator |
| `scalesPageToFit={true}` | Scale content to fit screen |
| `allowsInlineMediaPlayback={true}` | Play media inline |
| `showsVerticalScrollIndicator={true}` | Show scroll indicator |

## Communication Flow

```
┌─────────────────┐
│  React Native   │
│   Component     │
└────────┬────────┘
         │
         │ injectedJavaScript
         │ injectJavaScript()
         ▼
┌─────────────────┐
│    WebView      │
│  (Base44 App)   │
└────────┬────────┘
         │
         │ postMessage()
         │ onMessage
         ▼
┌─────────────────┐
│  React Native   │
│   Component     │
└─────────────────┘
```

## Best Practices

### 1. Always Handle Errors
```typescript
onError={handleError}
onHttpError={handleHttpError}
```

### 2. Provide User Feedback
```typescript
{loading && <ActivityIndicator />}
{error && <ErrorMessage />}
```

### 3. Enable Reload Functionality
```typescript
const handleReload = () => {
  setWebViewKey(prev => prev + 1);
  setError(null);
  setLoading(true);
};
```

### 4. Log Everything
```typescript
console.log('WebView: Load started');
console.log('WebView: Navigation changed');
console.error('WebView error:', error);
```

### 5. Use Refs for Control
```typescript
const webViewRef = useRef<WebView>(null);
webViewRef.current?.goBack();
webViewRef.current?.reload();
```

## Debugging Tips

### 1. Check Console Logs
Look for messages starting with "WebView:" in your terminal.

### 2. Monitor Network
Use Chrome DevTools or React Native Debugger to monitor network requests.

### 3. Test Error Scenarios
- Turn off WiFi
- Use airplane mode
- Block the domain in hosts file

### 4. Test on Real Devices
Emulators/simulators may behave differently than real devices.

### 5. Check WebView Messages
Monitor messages sent from the WebView:
```typescript
const handleMessage = (event: any) => {
  console.log('WebView message:', event.nativeEvent.data);
};
```

## Common Issues

### Issue: WebView Not Loading
**Solution:** Check network, verify URL, check console logs

### Issue: JavaScript Not Working
**Solution:** Ensure `javaScriptEnabled={true}` and `domStorageEnabled={true}`

### Issue: Cookies Not Persisting
**Solution:** Enable `sharedCookiesEnabled={true}` and `thirdPartyCookiesEnabled={true}`

### Issue: Back Button Not Working
**Solution:** Implement `BackHandler` on Android, use `allowsBackForwardNavigationGestures` on iOS

### Issue: Content Not Scaling
**Solution:** Set `scalesPageToFit={true}` and check viewport meta tags in web content

## Performance Optimization

1. **Enable Caching**
   ```typescript
   cacheEnabled={true}
   cacheMode="LOAD_DEFAULT"
   ```

2. **Hardware Acceleration (Android)**
   ```typescript
   androidLayerType="hardware"
   androidHardwareAccelerationDisabled={false}
   ```

3. **Minimize Re-renders**
   ```typescript
   const webViewRef = useRef<WebView>(null);
   const memoizedProps = useMemo(() => ({ ... }), []);
   ```

4. **Lazy Load Heavy Content**
   - Load critical content first
   - Defer non-critical resources

## Security Considerations

1. **Validate URLs**
   - Only load trusted domains
   - Implement URL validation

2. **Sanitize Messages**
   - Validate data from `onMessage`
   - Don't execute arbitrary code

3. **Use HTTPS**
   - Always use secure connections
   - Avoid mixed content when possible

4. **Limit Permissions**
   - Only enable necessary features
   - Review security implications

## Future Enhancements

Potential improvements:
- [ ] Offline mode with cached content
- [ ] Pull-to-refresh functionality
- [ ] Progress bar for loading
- [ ] Screenshot/share functionality
- [ ] Deep linking support
- [ ] Push notification integration
- [ ] Biometric authentication
- [ ] Custom context menus
