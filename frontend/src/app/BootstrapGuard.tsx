import { useState } from "react";
import { logEvent } from "../services/eventLogger";
import BlockedScreen from "../components/BlockedScreen";
import AssessmentShell from "../components/AssessmentShell";

function detectBrowser() {
  const ua = navigator.userAgent;
  const isChrome =
    /Chrome/.test(ua) &&
    !/Edg/.test(ua) &&
    !/OPR/.test(ua);

  const versionMatch = ua.match(/Chrome\/(\d+)/);

  return {
    isChrome,
    name: isChrome ? "Google Chrome" : "Unsupported",
    version: versionMatch ? versionMatch[1] : "unknown",
  };
}

const BootstrapGuard = () => {
  const [allowed] = useState<boolean>(() => {
    const browser = detectBrowser();

    // Log detected browser
    logEvent("browser_detected", {
      browser: browser.name,
      version: browser.version,
    });

    // Block unsupported browsers
    if (!browser.isChrome) {
      logEvent("access_blocked", {
        reason: "unsupported_browser",
      });
      return false;
    }

    return true;
  });

  if (!allowed) {
    return <BlockedScreen />;
  }

  return <AssessmentShell />;
};

export default BootstrapGuard;
