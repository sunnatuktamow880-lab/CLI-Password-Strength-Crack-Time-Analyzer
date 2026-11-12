const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function analyzePassword(password) {
    let poolSize = 0;
    const checks = {
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        numbers: /[0-9]/.test(password),
        symbols: /[^A-Za-z0-9]/.test(password)
    };

    if (checks.lowercase) poolSize += 26;
    if (checks.uppercase) poolSize += 26;
    if (checks.numbers) poolSize += 10;
    if (checks.symbols) poolSize += 32;

    // Entropiya (bitlarda) va taxminiy buzish vaqtini hisoblash
    const entropy = password.length * Math.log2(poolSize || 1);
    const combinations = Math.pow(poolSize || 1, password.length);
    const guessesPerSecond = 1e10; // Soniyasiga 10 milliard urinish (kuchli GPU)
    const secondsToCrack = combinations / guessesPerSecond;

    let strength = "Juda zaif (Very Weak) 🔴";
    if (entropy >= 80) strength = "Mustahkam (Very Strong) 🟢";
    else if (entropy >= 60) strength = "Yaxshi (Strong) 🟡";
    else if (entropy >= 40) strength = "O'rtacha (Moderate) 🟠";

    return {
        length: password.length,
        checks,
        entropy: entropy.toFixed(2),
        strength,
        crackTime: formatTime(secondsToCrack)
    };
}

function formatTime(seconds) {
    if (seconds < 1) return "Bir zumda (Instant)";
    if (seconds < 60) return `${Math.round(seconds)} soniya`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} daqiqa`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} soat`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} kun`;
    const years = seconds / 31536000;
    if (years > 1e9) return "Milliardlab yillar";
    return `${Math.round(years).toLocaleString()} yil`;
}

console.log("\n=== 🔐 JS Password Security Analyzer ===");
rl.question("Tekshirish uchun parol kiriting: ", (password) => {
    if (!password) {
        console.log("Parol kiritilmadi!");
        rl.close();
        return;
    }

    const report = analyzePassword(password);

    console.log("\n--- Tahlil natijasi ---");
    console.log(`Uzunligi:        ${report.length} belgi`);
    console.log(`Entropiya:       ${report.entropy} bit`);
    console.log(`Holati:          ${report.strength}`);
    console.log(`Buzish vaqti:    ~${report.crackTime}`);
    console.log("Tarkibi:", [
        report.checks.lowercase ? "a-z" : null,
        report.checks.uppercase ? "A-Z" : null,
        report.checks.numbers ? "0-9" : null,
        report.checks.symbols ? "!@#$" : null
    ].filter(Boolean).join(", "));
    console.log("-----------------------\n");

    rl.close();
});