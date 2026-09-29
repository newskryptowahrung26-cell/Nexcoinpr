const fs = require('fs');
const path = require('path');

const gradleKtsPath = path.join(__dirname, 'android', 'app', 'build.gradle.kts');
const gradleGroovyPath = path.join(__dirname, 'android', 'app', 'build.gradle');

const keystorePath = (process.env.GITHUB_WORKSPACE
  ? `${process.env.GITHUB_WORKSPACE}/.github/signing.keystore`
  : path.resolve(__dirname, '..', '.github', 'signing.keystore')).replace(/\\/g, '/');

// 1. Patch Gradle Configuration
if (fs.existsSync(gradleKtsPath)) {
  console.log('Patching build.gradle.kts...');
  let content = fs.readFileSync(gradleKtsPath, 'utf8');

  // ApplicationId & Namespace
  content = content.replace(/applicationId\s*=\s*["'][^"']+["']/, 'applicationId = "agency.nexcoinpr.app"');
  content = content.replace(/namespace\s*=\s*["'][^"']+["']/, 'namespace = "agency.nexcoinpr.app"');

  // API 36 compliance + versionCode 5 + versionName 1.3.1 + NDK 27
  content = content.replace(/compileSdk\s*=\s*flutter\.compileSdkVersion/, 'compileSdk = 36\n    ndkVersion = "27.0.12077973"');
  content = content.replace(/targetSdk\s*=\s*flutter\.targetSdkVersion/, 'targetSdk = 36');
  content = content.replace(/minSdk\s*=\s*flutter\.minSdkVersion/, 'minSdk = 24');
  content = content.replace(/versionCode\s*=\s*flutter\.versionCode/, 'versionCode = 5');
  content = content.replace(/versionName\s*=\s*flutter\.versionName/, 'versionName = "1.3.1"');

  // Add signingConfigs block right before buildTypes {
  const signingConfigKts = `
    signingConfigs {
        create("release") {
            storeFile = file("${keystorePath}")
            storePassword = "BmXzzl5nfft8"
            keyAlias = "my-key-alias"
            keyPassword = "BmXzzl5nfft8"
        }
    }
`;

  if (!content.includes('signingConfigs {')) {
    content = content.replace(/buildTypes\s*\{/, `${signingConfigKts}\n    buildTypes {`);
  }

  // Switch release signingConfig to release and disable minify so activity/classes are NEVER stripped
  content = content.replace(
    /signingConfig\s*=\s*signingConfigs\.getByName\(["']debug["']\)/,
    `signingConfig = signingConfigs.getByName("release")
            isMinifyEnabled = false
            isShrinkResources = false`
  );

  fs.writeFileSync(gradleKtsPath, content, 'utf8');
  console.log('Successfully patched build.gradle.kts!');
} else if (fs.existsSync(gradleGroovyPath)) {
  console.log('Patching build.gradle (Groovy)...');
  let content = fs.readFileSync(gradleGroovyPath, 'utf8');

  content = content.replace(/applicationId\s+["'][^"']+["']/, 'applicationId "agency.nexcoinpr.app"');
  content = content.replace(/namespace\s+["'][^"']+["']/, 'namespace "agency.nexcoinpr.app"');
  content = content.replace(/compileSdkVersion\s+flutter\.compileSdkVersion/, 'compileSdkVersion 36\n    ndkVersion "27.0.12077973"');
  content = content.replace(/targetSdkVersion\s+flutter\.targetSdkVersion/, 'targetSdkVersion 36');
  content = content.replace(/minSdkVersion\s+flutter\.minSdkVersion/, 'minSdkVersion 24');
  content = content.replace(/versionCode\s+flutterVersionCode\.toInteger\(\)/, 'versionCode 5');
  content = content.replace(/versionName\s+flutterVersionName/, 'versionName "1.3.1"');

  const signingConfigGroovy = `
    signingConfigs {
        release {
            storeFile file("${keystorePath}")
            storePassword "BmXzzl5nfft8"
            keyAlias "my-key-alias"
            keyPassword "BmXzzl5nfft8"
        }
    }
`;

  if (!content.includes('signingConfigs {')) {
    content = content.replace(/buildTypes\s*\{/, `${signingConfigGroovy}\n    buildTypes {`);
  }

  content = content.replace(
    /signingConfig\s+signingConfigs\.debug/,
    `signingConfig signingConfigs.release
            minifyEnabled false
            shrinkResources false`
  );

  fs.writeFileSync(gradleGroovyPath, content, 'utf8');
  console.log('Successfully patched build.gradle!');
}

// 2. Fix MainActivity Kotlin & Java to EXACTLY match package agency.nexcoinpr.app
const kotlinBase = path.join(__dirname, 'android', 'app', 'src', 'main', 'kotlin');
if (fs.existsSync(kotlinBase)) {
  const targetDir = path.join(kotlinBase, 'agency', 'nexcoinpr', 'app');
  fs.mkdirSync(targetDir, { recursive: true });

  const mainActivityKt = `package agency.nexcoinpr.app

import io.flutter.embedding.android.FlutterActivity

class MainActivity: FlutterActivity()
`;
  fs.writeFileSync(path.join(targetDir, 'MainActivity.kt'), mainActivityKt, 'utf8');
  console.log('Wrote MainActivity.kt at:', path.join(targetDir, 'MainActivity.kt'));

  // Clean up mismatched agency/nexcoinpr/nexcoinpr_app directory
  const mismatchedDir = path.join(kotlinBase, 'agency', 'nexcoinpr', 'nexcoinpr_app');
  if (fs.existsSync(mismatchedDir)) {
    fs.rmSync(mismatchedDir, { recursive: true, force: true });
    console.log('Cleaned up mismatched directory:', mismatchedDir);
  }
}

// Also create Java fallback for MainActivity
const javaBase = path.join(__dirname, 'android', 'app', 'src', 'main', 'java');
const javaTargetDir = path.join(javaBase, 'agency', 'nexcoinpr', 'app');
fs.mkdirSync(javaTargetDir, { recursive: true });
const mainActivityJava = `package agency.nexcoinpr.app;

import io.flutter.embedding.android.FlutterActivity;

public class MainActivity extends FlutterActivity {
}
`;
fs.writeFileSync(path.join(javaTargetDir, 'MainActivity.java'), mainActivityJava, 'utf8');
console.log('Wrote MainActivity.java fallback at:', path.join(javaTargetDir, 'MainActivity.java'));

// 3. Patch AndroidManifest.xml
const manifestPath = path.join(__dirname, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
if (fs.existsSync(manifestPath)) {
  console.log('Patching AndroidManifest.xml...');
  let manifest = fs.readFileSync(manifestPath, 'utf8');

  // Set proper human-readable label
  manifest = manifest.replace(/android:label="[^"]*"/g, 'android:label="NexcoinPR"');

  // Explicitly set full activity name agency.nexcoinpr.app.MainActivity
  manifest = manifest.replace(/android:name\s*=\s*["']\.?MainActivity["']/g, 'android:name="agency.nexcoinpr.app.MainActivity"');

  // Inject permissions and queries
  if (!manifest.includes('android.permission.INTERNET')) {
    const permissionsAndQueries = `
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>

    <queries>
        <intent>
            <action android:name="android.intent.action.VIEW" />
            <data android:scheme="https" />
        </intent>
        <intent>
            <action android:name="android.intent.action.VIEW" />
            <data android:scheme="http" />
        </intent>
        <intent>
            <action android:name="android.intent.action.VIEW" />
            <data android:scheme="tg" />
        </intent>
    </queries>
`;
    manifest = manifest.replace('<application', `${permissionsAndQueries}\n    <application`);
  }

  fs.writeFileSync(manifestPath, manifest, 'utf8');
  console.log('Successfully patched AndroidManifest.xml!');
}

// 4. Create Proguard rules
const proguardPath = path.join(__dirname, 'android', 'app', 'proguard-rules.pro');
const proguardRules = `
-keep class agency.nexcoinpr.app.** { *; }
-keep class io.flutter.** { *; }
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.** { *; }
-keep class io.flutter.plugins.** { *; }
-keep class io.flutter.embedding.** { *; }
-dontwarn io.flutter.**
`;
fs.writeFileSync(proguardPath, proguardRules, 'utf8');
console.log('Successfully wrote proguard-rules.pro!');
