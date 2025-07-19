This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.



<!-- 修改数据库后用于清空缓存？这样不会闪退 -->
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res



在 Windows 环境下打包 React Native 应用（不使用 Expo）为 Android APK 的详细流程如下（React Native CLI 方式）：

✅ 准备工作
1. 安装所需工具
确保以下工具都已经安装：

Node.js（建议使用稳定版本）

Yarn 或 npm

Java JDK 11 或 17

建议使用 OpenJDK 11

Android Studio

并配置好 SDK、平台工具和 Android NDK（可选）

Android Studio 安装时务必勾选 Android SDK、Android SDK Platform, Android SDK Tools, Android Emulator 等。

✅ 项目配置步骤
2. 配置 Android 环境变量（Windows）
在 环境变量 中添加以下变量：

plaintext
复制
编辑
JAVA_HOME = C:\Program Files\Java\jdk-11.x.x
ANDROID_HOME = C:\Users\<你的用户名>\AppData\Local\Android\Sdk
并将以下路径加入系统的 Path：

plaintext
复制
编辑
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\emulator
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
✅ 开始打包 APK
3. 生成签名密钥（仅正式发布用）
bash
复制
编辑
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
这个命令会生成一个 my-release-key.keystore 文件，把它放在项目根目录的 /android/app/ 中。

4. 配置密钥信息
编辑文件：

bash
复制
编辑
android/gradle.properties
添加以下内容：

properties
复制
编辑
MYAPP_UPLOAD_STORE_FILE=my-release-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=你的store密码
MYAPP_UPLOAD_KEY_PASSWORD=你的key密码
然后在 android/app/build.gradle 中找到 android { ... }，在 signingConfigs 中添加：

groovy
复制
编辑
signingConfigs {
    release {
        storeFile file(MYAPP_UPLOAD_STORE_FILE)
        storePassword MYAPP_UPLOAD_STORE_PASSWORD
        keyAlias MYAPP_UPLOAD_KEY_ALIAS
        keyPassword MYAPP_UPLOAD_KEY_PASSWORD
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
        shrinkResources false
        minifyEnabled false
        proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
    }
}
✅ 构建 APK
在项目根目录执行：

bash
复制
编辑
cd android
./gradlew assembleRelease
等待构建完成后，APK 会出现在：

plaintext
复制
编辑
android/app/build/outputs/apk/release/app-release.apk
你可以直接安装这个 APK 到手机或上传到测试平台。

✅ 如果你只想调试版本（不签名）
bash
复制
编辑
cd android
./gradlew assembleDebug
APK 会生成在：

plaintext
复制
编辑
android/app/build/outputs/apk/debug/app-debug.apk
🛠️ 常见问题
keystore was tampered with：密码填错了，检查 gradle.properties

SDK location not found：没配置好 ANDROID_HOME 环境变量

构建时间长：第一次构建会拉取 Gradle 依赖，可以修改 android/gradle/wrapper/gradle-wrapper.properties 指定国内源加速

中文路径/空格路径问题：确保项目路径没有中文和空格

如需打包 .aab 用于上传到 Google Play，可执行：

bash
复制
编辑
android目录下
./gradlew bundleRelease
如你需要我直接帮你核对打包配置文件、签名部分或遇到具体错误，可贴出相关内容继续沟通。
