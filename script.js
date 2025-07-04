document.getElementById('uploadForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const form = e.target;
    const artist = form.artist.value.trim();
    const title = form.title.value.trim();
    const platforms = Array.from(form.querySelectorAll('input[name="platform"]:checked')).map(el => el.value);
    if (platforms.length === 0) {
        document.getElementById('message').textContent = 'Bitte wähle mindestens eine Plattform aus.';
        return;
    }
    const message = `${artist} - "${title}" wird an folgende Plattformen gesendet: ${platforms.join(', ')}.`;
    document.getElementById('message').textContent = message;
    form.reset();
});
