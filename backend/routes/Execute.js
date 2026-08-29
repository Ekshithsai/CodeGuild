require("dotenv").config();
const express = require("express");
const { execSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");
const router = express.Router();

const TIMEOUT_MS = 15000;

const LANG_CONFIG = {
  python: {
    ext: ".py",
    cmd: "python",
    args: (f) => [f],
    fallbackCmd: "python3",
  },
  javascript: {
    ext: ".js",
    cmd: "node",
    args: (f) => [f],
  },
  cpp: {
    ext: ".cpp",
    compile: (f, out) => ["g++", "-o", out, f, "-std=c++17"],
    run: (out) => [out],
  },
  java: {
    ext: ".java",
    compile: (f) => ["javac", f],
    run: (f, dir) => ["java", "-cp", dir, "Main"],
  },
};

function runWithTimeout(cmd, args, stdin, cwd, timeoutMs) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { cwd, timeout: timeoutMs, shell: true });
    let stdout = "";
    let stderr = "";
    let killed = false;

    const timer = setTimeout(() => {
      killed = true;
      try { proc.kill("SIGKILL"); } catch (e) { /* ignore */ }
    }, timeoutMs);

    proc.stdout.on("data", (d) => { stdout += d.toString(); });
    proc.stderr.on("data", (d) => { stderr += d.toString(); });

    proc.on("close", (code) => {
      clearTimeout(timer);
      if (killed) {
        reject(new Error("Execution timed out (15s limit)"));
      } else {
        resolve({ stdout, stderr, code });
      }
    });

    proc.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });

    if (stdin) {
      proc.stdin.write(stdin);
      proc.stdin.end();
    }
  });
}

router.post("/execute", async (req, res) => {
  let tmpDir;
  try {
    const { language, code, stdin } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ error: "No code provided" });
    }

    const config = LANG_CONFIG[language];
    if (!config) {
      return res.status(400).json({ error: `Unsupported language: ${language}. Supported: python, javascript, cpp, java` });
    }

    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "codeguild-"));
    const srcFile = path.join(tmpDir, `Main${config.ext}`);

    // For Java, the class must be named Main
    let processedCode = code;
    if (language === "java") {
      // Replace any public class name with Main
      processedCode = code.replace(/public\s+class\s+\w+/g, "public class Main");
      if (!processedCode.includes("class Main")) {
        processedCode = "public class Main {\n" + processedCode + "\n}";
      }
    }

    fs.writeFileSync(srcFile, processedCode, "utf-8");

    let result;

    if (config.compile) {
      // Compile first (C++, Java)
      const outBin = path.join(tmpDir, "Main" + (os.platform() === "win32" ? ".exe" : ""));
      const compileArgs = language === "java"
        ? config.compile(srcFile, tmpDir)
        : config.compile(srcFile, outBin);

      console.log(`Compiling ${language}: ${compileArgs.join(" ")}`);
      const compileResult = await runWithTimeout(compileArgs[0], compileArgs.slice(1), null, tmpDir, TIMEOUT_MS);

      if (compileResult.code !== 0) {
        const errOutput = compileResult.stderr || compileResult.stdout;
        return res.json({
          output: errOutput || `Compilation failed with exit code ${compileResult.code}`,
          exitCode: compileResult.code,
          stdout: compileResult.stdout,
          stderr: compileResult.stderr,
        });
      }

      // Run
      const runArgs = language === "java"
        ? config.run(srcFile, tmpDir)
        : config.run(outBin);

      console.log(`Running ${language}: ${runArgs.join(" ")}`);
      result = await runWithTimeout(runArgs[0], runArgs.slice(1), stdin || "", tmpDir, TIMEOUT_MS);
    } else {
      // Direct run (Python, JavaScript)
      const runArgs = config.args(srcFile);
      console.log(`Running ${language}: ${config.cmd} ${runArgs.join(" ")}`);
      result = await runWithTimeout(config.cmd, runArgs, stdin || "", tmpDir, TIMEOUT_MS);
    }

    let output = "";
    if (result.stdout) output += result.stdout;
    if (result.stderr) output += (output ? "\n" : "") + result.stderr;

    if (result.code !== 0 && !output) {
      output = `Process exited with code ${result.code}`;
    }

    res.json({
      output: output || "Program executed successfully (exit code 0)",
      exitCode: result.code,
      stdout: result.stdout || "",
      stderr: result.stderr || "",
    });
  } catch (error) {
    console.error("Execution error:", error.message);

    if (error.message.includes("timed out")) {
      return res.status(408).json({ error: "Code execution timed out (15s limit)" });
    }

    if (error.code === "ENOENT") {
      const lang = req.body?.language || "the selected language";
      let installHint = "";
      if (lang === "python") installHint = "\nInstall Python: https://python.org";
      if (lang === "cpp") installHint = "\nInstall G++: https://mingw-w64.org or run: sudo apt install g++";
      if (lang === "java") installHint = "\nInstall JDK: https://adoptium.net";
      if (lang === "javascript") installHint = "\nInstall Node.js: https://nodejs.org";
      return res.status(500).json({ error: `${lang} is not installed on this machine.${installHint}` });
    }

    res.status(500).json({ error: `Execution failed: ${error.message}` });
  } finally {
    // Clean up temp files
    if (tmpDir) {
      try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (e) { /* ignore */ }
    }
  }
});

module.exports = router;
