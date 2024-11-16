const content_dir = 'contents/';
const config_file = 'config.yml';
const section_names = ['home', 'publications', 'statement'];

window.addEventListener('DOMContentLoaded', event => {
    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    }

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Fetch and apply YAML configuration
    fetch(content_dir + config_file)
        .then(response => response.text())
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                try {
                    document.getElementById(key).innerHTML = yml[key];
                } catch {
                    console.log("Unknown id and value: " + key + ", " + yml[key].toString());
                }
            });
        })
        .catch(error => console.log(error));

    // Fetch and render Markdown sections
    const loadMarkdown = name => {
        return fetch(content_dir + name + '.md')
            .then(response => response.text())
            .then(markdown => {
                if (name === 'statement') {
                    simulateTyping(markdown, name + '-md'); // Typing effect for 'statement'
                } else {
                    const html = marked.parse(markdown);
                    document.getElementById(name + '-md').innerHTML = html;
                }
                MathJax.typeset();
            })
            .catch(error => console.error(error));
    };

    const scrollToSection = (id, delay = 1000) => {
        return new Promise(resolve => {
            setTimeout(() => {
                document.querySelector(id).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
                resolve();
            }, delay); // Add a delay before scrolling
        });
    };

    // Simulate typing effect with a blinking cursor
    const simulateTyping = (text, elementId, callback) => {
        const element = document.getElementById(elementId);
        let i = 0;
        const speed = 20; // Typing speed (20ms per character)
        const cursor = document.createElement('span'); // Create a blinking cursor
        cursor.textContent = '|';
        cursor.style.display = 'inline-block';
        cursor.style.animation = 'blink 0.5s step-end infinite';
    
        element.innerHTML = ''; // Clear existing content
        element.appendChild(cursor); // Add cursor to the element
    
        const type = () => {
            if (i < text.length) {
                element.innerHTML = text.substring(0, i + 1); // Add the next character
                element.appendChild(cursor); // Keep the cursor at the end
                i++;
                setTimeout(type, speed); // Continue typing
            } else {
                cursor.remove(); // Remove the cursor after typing is done
                if (typeof callback === 'function') callback(); // Execute callback after typing
            }
        };
        type();
    };

    const applyZoomEffect = elementId => {
        const element = document.getElementById(elementId);
    
        // Initially make the element transparent and extremely small
        element.style.transform = 'scale(0)'; // Shrink to an unnoticeable size
        element.style.opacity = '0'; // Fully transparent
        element.style.transition = 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out';
    
        // After a short delay, make it visible and apply the zoom-in effect
        setTimeout(() => {
            element.style.opacity = '1'; // Make it visible
            element.style.transform = 'scale(2.5)'; // Zoom in to a large size
        }, 100);
    
        // Zoom out to normal size and keep it permanently visible
        setTimeout(() => {
            element.style.transition = 'transform 1.1s ease-in-out';
            element.style.transform = 'scale(1)'; // Return to normal size
        }, 600);
    };
    
    
    

    // Add dynamic quotes to the home section
    const quotes = [
        "Creativity is intelligence having fun. - Albert Einstein",
        "The best way to predict the future is to invent it. - Alan Kay",
        "Do not wait to strike till the iron is hot; but make it hot by striking. - William Butler Yeats",
        "Simplicity is the ultimate sophistication. - Leonardo da Vinci",
        "You miss 100% of the shots you don’t take. - Wayne Gretzky"
    ];
    
    const changeQuote = () => {
        const quoteElement = document.getElementById('home-quote'); // Separate element for quote
        if (!quoteElement) {
            console.error('home-quote not found in the DOM.');
            return;
        }
    
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        const randomColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    
        // Step 1: Fade out
        quoteElement.style.opacity = '0';
    
        // Step 2: Change content and fade back in
        setTimeout(() => {
            quoteElement.innerHTML = randomQuote; // Update the quote text
            quoteElement.style.color = randomColor; // Apply a new random color
            quoteElement.style.opacity = '1'; // Smooth fade-in
        }, 1500); // Wait for fade-out to complete
    };
    
    const initQuote = () => {
        changeQuote(); // Display the first quote
        setInterval(changeQuote, 3000); // Update every 7 seconds
    };
    
    initQuote();

    // Start by loading all sections but scroll directly to the last one
    const showSections = async () => {
        for (let i = 0; i < section_names.length; i++) {
            await loadMarkdown(section_names[i]);
        }
    
        // Scroll directly to the last section
        await scrollToSection('#statement', 1000); // Stay for 1 second before scrolling
    
        // Trigger typing, and only after typing completes, scroll back to the top
    
        // Trigger zoom effect for publications after scrolling is complete
        applyZoomEffect('publications-md');
    };
    

    // Start the sequential section display
    showSections();
});
