// let letters = [];
// let distortions = [];
// let scrollValue = 0; // Controlled by scrollbar or buttons

// function setup() {
//     noCanvas();

//     let marfaText = select('.marfa');
//     let word = marfaText.html();
//     marfaText.html('');

//     // Create a span for each letter in "MARFA"
//     for (let i = 0; i < word.length; i++) {
//         let char = word.charAt(i);
//         let span = createSpan(char);
//         span.parent(marfaText);
//         span.style('display', 'inline-block');
//         letters.push(span);

//         distortions.push({
//             xSpeed: random(0.02, 0.06), 
//             ySpeed: random(0.01, 0.05),
//             xAmp: random(10, 25), 
//             yAmp: random(2, 10)
//         });
//     }

//     // Attach scroll bar input event
//     let scrollBar = select('#scrollBar');
//     if (scrollBar) {
//         scrollBar.input(() => {
//             scrollValue = scrollBar.value(); // Get new value
//             applyDistortion(scrollValue); // Apply distortion dynamically
//             changeBackgroundColor(scrollValue); // Update background color based on scroll
//             changeLetterColors(); // Update letter colors dynamically based on scroll
//         });
//     } else {
//         console.error("Scroll bar not found!");
//     }

//     animateLetters(); // Start animation loop
// }

// // Function to distort letters dynamically
// function applyDistortion(value) {
//     let distortionFactor = map(value, 0, 100, 0, 1); // Normalize value to 0-1

//     for (let i = 0; i < letters.length; i++) {
//         distortions[i].xAmp = map(distortionFactor, 0, 1, 10, 50);
//         distortions[i].yAmp = map(distortionFactor, 0, 1, 2, 20);

//         // Melting effect - changing letter size and shape based on scroll value
//         let scaleFactor = map(distortionFactor, 0, 1, 1, 1.5);  // Scale from 1 to 1.5
//         let skewFactor = map(distortionFactor, 0, 1, 0, 20);  // Skew letters to make them look like they're melting

//         // Apply the scale and skew to the letter
//         letters[i].style('transform', `scale(${scaleFactor}) skew(${skewFactor}deg)`);
//     }
// }

// // Function to change the background color based on distortion value
// function changeBackgroundColor(value) {
//     let colorValue = map(value, 0, 100, 0, 255);
//     let backgroundColor = color(colorValue, 100, 150);  // Customize this color palette if needed
//     select('.container').style('background-color', backgroundColor); // Will work now
// }

// // Function to change the color of each letter based on distortion value
// function changeLetterColors() {
//     for (let i = 0; i < letters.length; i++) {
//         let letter = letters[i];

//         // Use sine functions to create smooth color transitions
//         let red = map(sin(frameCount * 0.1 + i), -1, 1, 100, 255);
//         let green = map(sin(frameCount * 0.1 + i + 2), -1, 1, 100, 255);
//         let blue = map(sin(frameCount * 0.1 + i + 4), -1, 1, 100, 255);

//         // Apply color to each letter
//         letter.style('color', `rgb(${red}, ${green}, ${blue})`);
//     }
// }

// function animateLetters() {
//     for (let i = 0; i < letters.length; i++) {
//         let d = distortions[i];

//         // Calculate distortions for each letter (horizontal and vertical)
//         let xDistort = sin(frameCount * d.xSpeed + i) * d.xAmp;
//         let yDistort = cos(frameCount * d.ySpeed + i) * d.yAmp;

//         // Apply distortions as a CSS transform
//         letters[i].style('transform', `translate(${xDistort}px, ${yDistort}px)`);
//     }

//     // Keep animating
//     requestAnimationFrame(animateLetters);
// }

// // Event listener for buttons (optional, attach in HTML)
// document.querySelectorAll('.distort-button').forEach(button => {
//     button.addEventListener('click', (event) => {
//         let value = parseInt(event.target.dataset.value);
//         applyDistortion(value);
//         changeBackgroundColor(value); // Change background color based on button value
//         changeLetterColors(); // Update letter colors when button is clicked
//     });
// })