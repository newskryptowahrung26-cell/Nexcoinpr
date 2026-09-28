const fs = require('fs');
const path = require('path');

const gradlePath = path.join(__dirname, 'android', 'app', 'build.gradle');
const gradleKtsPath = path.join(__dirname, 'android', 'app', 'build.gradle.kts');
const keystorePath = process.env.GITHUB_WORKSPACE
  ? `${process.env.GITHUB_WORKSPACE}/.github/signing.keystore`
  : path.resolve(__dirname, '..', '.github', 'signing.keystore').replace(/\\/g, '/');

if (fs.existsSync(gradleKtsPath)) {
  console.log('Found build.gradle.kts, patching Kotlin DSL...');
  let content = fs.readFileSync(gradleKtsPath, 'utf8');

  // Fix namespace and applicationId
  content = content.replace(/applicationId\s*=\s*["'][^"']+["']/, 'applicationId = "agency.nexcoinpr.app"');
  content = content.replace(/namespace\s*=\s*["'][^"']+["']/, 'namespace = "agency.nexcoinpr.app"');
  content = content.replace(/minSdk\s*=\s*flutter\.minSdkVersion/, 'minSdk = 24');
  content = content.replace(/versionCode\s*=\s*flutter\.versionCode/, 'versionCode = 2');
  content = content.replace(/versionName\s*=\s*flutter\.versionName/, 'versionName = "1.1.0"');

  const signingBlock = `
    signingConfigs {
        create("release") {
            storeFile = file("${keystorePath}")
            storePassword = "BmXzzl5nfft8"
            keyAlias = "my-key-alias"
            keyPassword = "BmXzzl5nfft8"
        }
    }
`;

  // Inject signingConfigs inside android { ... }
  if (!content.includes('signingConfigs {')) {
    content = content.replace(/android\s*\{/, `android { \n${signingBlock}`);
  }

  // Update release buildType to use release signingConfig
  content = content.replace(
    /buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?\}/,
    `buildTypes {\n        release {\n            signingConfig = signingConfigs.getByName("release")\n            isMinifyEnabled = false\n            isShrinkResources = false\n        }\n    }`
  );

  fs.writeFileSync(gradleKtsPath, content, 'utf8');
  console.log('Successfully patched build.gradle.kts!');
} else if (fs.existsSync(gradlePath)) {
  console.log('Found build.gradle, patching Groovy DSL...');
  let content = fs.readFileSync(gradlePath, 'utf8');

  content = content.replace(/applicationId\s+["'][^"']+["']/, 'applicationId "agency.nexcoinpr.app"');
  content = content.replace(/namespace\s+["'][^"']+["']/, 'namespace "agency.nexcoinpr.app"');
  content = content.replace(/minSdkVersion\s+flutter\.minSdkVersion/, 'minSdkVersion 24');
  content = content.replace(/versionCode\s+flutterVersionCode\.toInteger\(\)/, 'versionCode 2');
  content = content.replace(/versionName\s+flutterVersionName/, 'versionName "1.1.0"');

  const signingBlock = `
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
    content = content.replace(/android\s*\{/, `android { \n${signingBlock}`);
  }

  content = content.replace(
    /buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?\}/,
    `buildTypes {\n        release {\n            signingConfig signingConfigs.release\n            minifyEnabled false\n            shrinkResources false\n        }\n    }`
  );

  fs.writeFileSync(gradlePath, content, 'utf8');
  console.log('Successfully patched build.gradle!');
} else {
  console.error('Neither build.gradle nor build.gradle.kts found in android/app!');
  process.exit(1);
}
