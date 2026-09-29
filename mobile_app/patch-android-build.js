const fs = require('fs');
const path = require('path');

const gradleKtsPath = path.join(__dirname, 'android', 'app', 'build.gradle.kts');
const gradleGroovyPath = path.join(__dirname, 'android', 'app', 'build.gradle');

const keystorePath = (process.env.GITHUB_WORKSPACE
  ? `${process.env.GITHUB_WORKSPACE}/.github/signing.keystore`
  : path.resolve(__dirname, '..', '.github', 'signing.keystore')).replace(/\\/g, '/');

if (fs.existsSync(gradleKtsPath)) {
  console.log('Patching build.gradle.kts with targetSdk 36, compileSdk 36, versionCode 3...');
  let content = fs.readFileSync(gradleKtsPath, 'utf8');

  // ApplicationId & Namespace
  content = content.replace(/applicationId\s*=\s*["'][^"']+["']/, 'applicationId = "agency.nexcoinpr.app"');
  content = content.replace(/namespace\s*=\s*["'][^"']+["']/, 'namespace = "agency.nexcoinpr.app"');

  // API 36 compliance + versionCode 4 + ndkVersion
  content = content.replace(/compileSdk\s*=\s*flutter\.compileSdkVersion/, 'compileSdk = 36\n    ndkVersion = "27.0.12077973"');
  content = content.replace(/targetSdk\s*=\s*flutter\.targetSdkVersion/, 'targetSdk = 36');
  content = content.replace(/minSdk\s*=\s*flutter\.minSdkVersion/, 'minSdk = 24');
  content = content.replace(/versionCode\s*=\s*flutter\.versionCode/, 'versionCode = 4');
  content = content.replace(/versionName\s*=\s*flutter\.versionName/, 'versionName = "1.3.0"');

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

  // Switch release signingConfig to release
  content = content.replace(
    /signingConfig\s*=\s*signingConfigs\.getByName\(["']debug["']\)/,
    'signingConfig = signingConfigs.getByName("release")'
  );

  fs.writeFileSync(gradleKtsPath, content, 'utf8');
  console.log('Successfully patched build.gradle.kts for API 36!');
} else if (fs.existsSync(gradleGroovyPath)) {
  console.log('Patching build.gradle (Groovy) for API 36...');
  let content = fs.readFileSync(gradleGroovyPath, 'utf8');

  content = content.replace(/applicationId\s+["'][^"']+["']/, 'applicationId "agency.nexcoinpr.app"');
  content = content.replace(/namespace\s+["'][^"']+["']/, 'namespace "agency.nexcoinpr.app"');
  content = content.replace(/compileSdkVersion\s+flutter\.compileSdkVersion/, 'compileSdkVersion 36\n    ndkVersion "27.0.12077973"');
  content = content.replace(/targetSdkVersion\s+flutter\.targetSdkVersion/, 'targetSdkVersion 36');
  content = content.replace(/minSdkVersion\s+flutter\.minSdkVersion/, 'minSdkVersion 24');
  content = content.replace(/versionCode\s+flutterVersionCode\.toInteger\(\)/, 'versionCode 4');
  content = content.replace(/versionName\s+flutterVersionName/, 'versionName "1.3.0"');

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
    'signingConfig signingConfigs.release'
  );

  fs.writeFileSync(gradleGroovyPath, content, 'utf8');
  console.log('Successfully patched build.gradle for API 36!');
} else {
  console.error('No build.gradle found!');
  process.exit(1);
}

// Patch AndroidManifest.xml for INTERNET permission & url_launcher intent queries
const manifestPath = path.join(__dirname, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
if (fs.existsSync(manifestPath)) {
  console.log('Patching AndroidManifest.xml with INTERNET permissions and intent queries...');
  let manifest = fs.readFileSync(manifestPath, 'utf8');

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
    manifest = manifest.replace(
      '<application',
      `${permissionsAndQueries}\n    <application`
    );
    manifest = manifest.replace(/android:label="[^"]*"/, 'android:label="NexcoinPR"');
    fs.writeFileSync(manifestPath, manifest, 'utf8');
    console.log('Successfully patched AndroidManifest.xml!');
  }
}

