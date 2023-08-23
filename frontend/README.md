Its also a good idea to run `npm run codegen` on the frontend if you have messed around 
with GraphQL types anywhere

# Android Development
There may be times when capacitor builds at a different api level than what Android Studio uses. At least right now, it's building Android apps at the SDK version 33, when the Android Studio is at 34. Just for now you can change the following in variables.gradle if you have capacitor generate android app:
```
// generated was 33
compileSdkVersion = 34 
targetSdkVersion = 34
```