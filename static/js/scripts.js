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
                const html = marked.parse(markdown);
                document.getElementById(name + '-md').innerHTML = html;
                MathJax.typeset();
            })
            .catch(error => console.error(error));
    };

    // Display a static quote in the home section
    const staticQuote = () => {
        const quoteElement = document.getElementById('home-quote');
        if (quoteElement) {
            quoteElement.innerHTML = "Creativity is intelligence having fun. - Albert Einstein";
            quoteElement.style.color = "black"; // Set static color
        }
    };

    staticQuote();

    // Load and display all sections statically
    const showSections = async () => {
        for (let i = 0; i < section_names.length; i++) {
            await loadMarkdown(section_names[i]);
        }
    };

    // Start displaying sections
    showSections();
});
