import fs from "node:fs/promises";
import path from "node:path";

const EXPO_LICENSE = `
The MIT License (MIT)

Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;

const EXPO_GOOGLE_FONTS_LICENSE = `
MIT License

Copyright (c) 2020 Expo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;

const defaultLicenses = new Map();
// Expo Google Fonts
defaultLicenses.set("@expo-google-fonts/baloo-bhai-2", EXPO_GOOGLE_FONTS_LICENSE);
defaultLicenses.set("@expo-google-fonts/nunito", EXPO_GOOGLE_FONTS_LICENSE);
// Expo packages
defaultLicenses.set("@expo/metro-runtime", EXPO_LICENSE);
defaultLicenses.set("expo", EXPO_LICENSE);
defaultLicenses.set("expo-constants", EXPO_LICENSE);
defaultLicenses.set("expo-device", EXPO_LICENSE);
defaultLicenses.set("expo-font", EXPO_LICENSE);
defaultLicenses.set("expo-haptics", EXPO_LICENSE);
defaultLicenses.set("expo-image", EXPO_LICENSE);
defaultLicenses.set("expo-linear-gradient", EXPO_LICENSE);
defaultLicenses.set("expo-linking", EXPO_LICENSE);
defaultLicenses.set("expo-router", EXPO_LICENSE);
defaultLicenses.set("expo-splash-screen", EXPO_LICENSE);
defaultLicenses.set("expo-status-bar", EXPO_LICENSE);
defaultLicenses.set("expo-system-ui", EXPO_LICENSE);
defaultLicenses.set("expo-web-browser", EXPO_LICENSE);

const packageJson = JSON.parse(await fs.readFile("package.json"));
const dependencies = Object.keys(packageJson.dependencies);

const licenses = [];

for (const dependency of dependencies) {
  try {
    const dependencyPath = path.join("node_modules", dependency);
    const dependencyPathFiles = await fs.readdir(dependencyPath);
    const licenseFilename = dependencyPathFiles.find(
      (file) => file.toLowerCase().includes("license") || file.toLowerCase().includes("licence")
    );
    if (licenseFilename) {
      const license = await fs.readFile(path.join(dependencyPath, licenseFilename), { encoding: "utf-8" });
      licenses.push({ dependency, license: license.trim() });
      continue;
    }

    const defaultLicense = defaultLicenses.get(dependency);
    if (defaultLicense) {
      licenses.push({ dependency, license: defaultLicense.trim() });
      continue;
    }

    console.error(`Missing license for dependency ${dependency}`);
  } catch (error) {
    console.error(`Error processing dependency ${dependency}:`, error.message);
  }
}

await fs.writeFile("data/licenses.json", JSON.stringify(licenses, null, 4) + "\n", { encoding: "utf-8" });
console.log(`Successfully generated licenses.json with ${licenses.length} licenses`);
