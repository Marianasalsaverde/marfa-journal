let letters = [];  
let distortions = [];
let scrollValue = 0;
let imageIsActive = false;

const colorPalette = [
    "#FF3D00", "#FCDFBD", "#000084", "#345442", "#FF00B7", 
    "#AA3670", "#6D2511", "#2E4580", "#998518", "#7B9CF3", "#F2FF00", "#09C2A0"
];

let img;
let metIDs = [];

function preload() {
    img = loadImage('../assets/petercat.jpg');
}

function setup() {
    noCanvas();

    let marfaText = select('.marfa');
    let journalText = select('.journal');
    let marfaWord = "MARFA";  
    let journalWord = "JOURNAL";  

    marfaText.html('');
    journalText.html('');

    for (let i = 0; i < marfaWord.length; i++) {
        let char = marfaWord.charAt(i);
        let span = createSpan(char);
        span.parent(marfaText);
        span.style('display', 'inline-block');
        letters.push(span);

        distortions.push({
            xSpeed: random(0.02, 0.06), 
            ySpeed: random(0.01, 0.05),
            xAmp: random(10, 25), 
            yAmp: random(2, 10)
        });
    }

    for (let i = 0; i < journalWord.length; i++) {
        let char = journalWord.charAt(i);
        let span = createSpan(char);
        span.parent(journalText);
        span.style('display', 'inline-block');
        letters.push(span);

        distortions.push({
            xSpeed: random(0.02, 0.06), 
            ySpeed: random(0.01, 0.05),
            xAmp: random(10, 25), 
            yAmp: random(2, 10)
        });
    }

    let scrollBar = select('#scrollBar');
    if (scrollBar) {
        scrollBar.input(() => {
            scrollValue = scrollBar.value();
            applyFlipEffect(scrollValue);
            changeBackgroundColor(scrollValue);
            changeLetterColors(scrollValue);
        });
    }

    fetchMetIDs();
    animateLetters();
}

function applyFlipEffect(value) {
    let flipThreshold = map(value, 0, 100, 0, letters.length); 

    for (let i = 0; i < letters.length; i++) {
        let letter = letters[i];

        if (i < flipThreshold) {
            letter.style('transform', 'scaleX(-1)');
            letter.style('transform-origin', 'center center');
        } else {
            letter.style('transform', 'scaleX(1)');
            letter.style('transform-origin', 'center center');
        }
    }

    let journalStartIndex = 5;
    let allJournalFlipped = true;

    for (let i = journalStartIndex; i < letters.length; i++) {
        if (i >= flipThreshold) {
            allJournalFlipped = false;
            break;
        }
    }

    let journalEl = document.querySelector('.journal');
    if (allJournalFlipped) {
        journalEl.classList.add('upside-down');
    } else {
        journalEl.classList.remove('upside-down');
    }
}

function changeBackgroundColor(value) {
    imageIsActive = value >= 50 && value <= 60;

    const container = select('.container');
    if (imageIsActive) {
        container.style('background-image', `url(${img.src})`);
        container.style('background-size', 'cover');
    } else {
        container.style('background-image', 'none');
    }
}

function changeLetterColors(value) {
    if (imageIsActive) return;

    // Pick a random color from the palette each time
    const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];

    for (let i = 0; i < letters.length; i++) {
        letters[i].style('color', randomColor);
    }
}

function animateLetters() {
    requestAnimationFrame(animateLetters);
}

document.querySelectorAll('.distort-button').forEach(button => {
    button.addEventListener('click', (event) => {
        let value = parseInt(event.target.dataset.value);
        applyFlipEffect(value);
        changeBackgroundColor(value);
        changeLetterColors(value);
    });
});

function fetchMetIDs() {
    const departments = [19, 21, 1, 9];
    const randomDept = departments[Math.floor(Math.random() * departments.length)];

    fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=${randomDept}`)
        .then(res => res.json())
        .then(data => {
            metIDs = data.objectIDs.filter(id => id != null);
            if (metIDs.length > 0) {
                fetchRandomMetArtwork();
                setInterval(fetchRandomMetArtwork, 10000);
            }
        })
        .catch(err => console.error('Error fetching object IDs:', err));
}

function fetchRandomMetArtwork() {
    if (metIDs.length === 0) return;

    const randomID = metIDs[Math.floor(Math.random() * metIDs.length)];
    fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${randomID}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.artistDisplayName) {
                let artistLength = data.artistDisplayName.length;
                applyFlipEffect(artistLength);
                changeLetterColors(artistLength);

                // ✅ Update the .art-info element
                const artInfo = document.querySelector('.art-info');
                if (artInfo) {
                    artInfo.innerHTML = `
                        <strong>${data.title}</strong><br>
                        <em>${data.artistDisplayName}</em>
                    `;
                }

                console.log(`🎨 Artwork: ${data.title}`);
                console.log(`🧑‍🎨 Artist: ${data.artistDisplayName}`);
            }
        })
        .catch(err => console.error('Error fetching artwork:', err));
}
