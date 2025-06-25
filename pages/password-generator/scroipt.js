document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate');
    const resultEl = document.getElementById('result');
    const copyBtn = document.getElementById('copy');

    generateBtn.addEventListener('click', () => {
        const length = parseInt(document.getElementById('length').value, 10);
        const useLowercase = document.getElementById('use-lowercase').checked;
        const useUppercase = document.getElementById('use-uppercase').checked;
        const useNumbers = document.getElementById('use-numbers').checked;
        const useSymbols = document.getElementById('use-symbols').checked;

        const password = generatePassword(length, {
            lowercase: useLowercase,
            uppercase: useUppercase,
            numbers: useNumbers,
            symbols: useSymbols
        });

        resultEl.value = password || '（文字種を1つ以上選んでください）';
    });

    copyBtn.addEventListener('click', () => {
        resultEl.select();
        document.execCommand('copy');
        copyBtn.textContent = 'コピー完了';
        setTimeout(() => {
            copyBtn.textContent = 'コピー';
        }, 1500);
    });

    function generatePassword(length, options) {
        const sets = {
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+[]{}|;:,.<>?'
        };

        let charset = '';
        for (const [key, chars] of Object.entries(sets)) {
            if (options[key]) charset += chars;
        }

        if (!charset) return '';

        const array = new Uint32Array(length);
        window.crypto.getRandomValues(array);
        return Array.from(array).map(x => charset[x % charset.length]).join('');
    }
});
