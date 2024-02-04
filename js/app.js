import data from '../data/pl.json' assert {type: 'json'}

(function() {

    let viewportWidth = null,
        trackWidth = null,
        scrollDist = 0,
        visiblePanels = null,
        totalPages = 0,
        currentPage = 0;

    /**
     * DOM object
     */
    const DOM = {};

    /**
     * Methods to create DOM elements
     */
    const view = {
        panel: data => {
            const panel = document.createElement('DIV'),
                  venue = document.createElement('DIV'),
                  date = document.createElement('DIV'),
                  homeTeam = document.createElement('DIV'),
                  awayTeam = document.createElement('DIV');

            panel.className = 'panel';
            venue.className = 'panel__venue';
            date.className = 'panel__date';
            homeTeam.className = 'panel__home';
            awayTeam.className = 'panel__away';

            venue.textContent = data.Location;
            date.textContent = new Date(data.DateUtc).toLocaleDateString('en-EN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            homeTeam.append(view.result(data.HomeTeam, data.HomeTeamScore));
            awayTeam.append(view.result(data.AwayTeam, data.AwayTeamScore));

            panel.append(venue, date, homeTeam, awayTeam);

            return panel;
        },
        result: (team, teamScore) => {
            const result = document.createElement('DIV'),
                  teamName = document.createElement('SPAN'),
                  badge = document.createElement('SPAN'),
                  score = document.createElement('SPAN');
            result.className = 'panel__result';
            teamName.className = 'panel__team';
            badge.className = 'panel__badge';
            score.className = 'panel__score';

            badge.setAttribute('title', team);

            teamName.textContent = team;
            view.badge(team, badge);
            score.textContent = teamScore; 
    
            result.append(badge, teamName, score);
    
            return result;
        },
        badge: (team, el) => {

            switch(team) {
                case 'Arsenal':
                    el.classList.add('badge--arsenal'); 
                    break;
                case 'Aston Villa':
                    el.classList.add('badge--astonVilla'); 
                    break;
                case 'Barnsley':
                    el.classList.add('badge--barnsley'); 
                    break;
                case 'Bournemouth':
                    el.classList.add('badge--bournemouth'); 
                    break;
                case 'Brentford':
                    el.classList.add('badge--brentford'); 
                    break;
                case 'Brighton':
                    el.classList.add('badge--brighton'); 
                    break;
                case 'Burnley':
                    el.classList.add('badge--burnley'); 
                    break;
                case 'Chelsea':
                    el.classList.add('badge--chelsea'); 
                    break;
                case 'Crystal Palace':
                    el.classList.add('badge--crystalPalace'); 
                    break;
                case 'Everton':
                    el.classList.add('badge--everton'); 
                    break;
                case 'Fulham':
                    el.classList.add('badge--fulham'); 
                    break;
                case 'Leeds':
                    el.classList.add('badge--leeds'); 
                    break;
                case 'Leicester':
                    el.classList.add('badge--leicester'); 
                    break;
                case 'Liverpool':
                    el.classList.add('badge--liverpool'); 
                    break;
                case 'Luton Town':
                    el.classList.add('badge--luton'); 
                    break;
                case 'Man City':
                    el.classList.add('badge--manchesterCity'); 
                    break;
                case 'Man Utd':
                    el.classList.add('badge--manchesterUnited'); 
                    break;
                case 'Newcastle':
                    el.classList.add('badge--newcastle'); 
                    break;                
                case 'Nottingham Forest':
                    el.classList.add('badge--nottinghamForest'); 
                    break;                
                case 'Sheffield United':
                    el.classList.add('badge--sheffieldUnited'); 
                    break;  
                case 'Southampton':
                    el.classList.add('badge--southampton'); 
                    break;  
                case 'Spurs':
                    el.classList.add('badge--spurs'); 
                    break;  
                case 'West Ham':
                    el.classList.add('badge--westHam'); 
                    break;  
                case 'Wolves':
                    el.classList.add('badge--wolves'); 
                    break;  
                default: 
                    break;
            }
        }
    };

    /**
     * Cache necessary DOM elements
     */
    const cacheDOM = () => {
        DOM.gameTicker = document.querySelector('.gameTicker');
        DOM.fixtures = document.getElementById('fixtures');
        DOM.navPrev = document.querySelector('.nav--prev');
        DOM.navNext = document.querySelector('.nav--next');
    };

    /**
     * CLear fixtures contents
     */
    const clearFixtures = () => {
        if(DOM.fixtures.children.length > 0) {
            DOM.fixtures.innerHTML = '';
        }
    };

    /**
     * Handle nav buttons state
     */
    const handleNav = () => {
        if(totalPages > 1 && currentPage < totalPages - 1) {
            DOM.navNext.classList.add('nav--active');
        } else {
            if(DOM.navNext.classList.contains('nav--active')) {
                DOM.navNext.classList.remove('nav--active');
            }
        }

        if(totalPages > 1 && currentPage > 0) {
            DOM.navPrev.classList.add('nav--active');
        } else {
            if(DOM.navPrev.classList.contains('nav--active')) {
                DOM.navPrev.classList.remove('nav--active');
            }
        }
    };

    /**
     * Render results
     */
    const renderResults = () => {
        clearFixtures();

        DOM.track = document.createElement('DIV');
        DOM.track.className = 'fixtures__track';

        data.forEach(item => {
            DOM.track.appendChild(view.panel(item));
        });

        DOM.fixtures.appendChild(DOM.track);
        DOM.panels = document.getElementsByClassName('panel');

        handleNav();

        trackWidth = DOM.track.getBoundingClientRect().width;
    };

    /**
     * Sets how many results panels are visible
     */
    const setVisiblePanels = () => {
        switch(true) {
            case(viewportWidth < 480):
                visiblePanels = 1;
                break;
            case(viewportWidth < 672):
                visiblePanels = 2;
                break;
            case(viewportWidth < 768):
                visiblePanels = 3;
                break;
            case(viewportWidth < 990):
                visiblePanels = 4;
                break;
            case(viewportWidth < 1024):
                visiblePanels = 5;
                break;
            case(viewportWidth < 1296):
                visiblePanels = 6;
                break; 
            case(viewportWidth < 1440):
                visiblePanels = 7;
                break;    
            default:
                visiblePanels = 8;
                break;  
        } 

        document.documentElement.style.setProperty('--visible-panels', visiblePanels);

        totalPages = Math.ceil(data.length / visiblePanels);
    };

    /**
     * Go to previous page
     */
    const goToPrev = () => {
        if(totalPages > 1 && currentPage > 0) {
            currentPage--;
            scrollDist -= trackWidth;
            DOM.track.style.transform = `translateX(-${scrollDist}px)`;
        } else {
            return;
        }

        handleNav();
    }

    /**
     * Go to next page
     */
    const goToNext = () => {
        if(totalPages > 1 && currentPage < totalPages - 1) {
            currentPage++;
            scrollDist += trackWidth;
            DOM.track.style.transform = `translateX(-${scrollDist}px)`;
        } else {
            return;
        }

        handleNav();
    };

    /**
     * Setup Events
     */
    const setupEvents = () => {
        DOM.navPrev.addEventListener('click', goToPrev);
        DOM.navNext.addEventListener('click', goToNext);
    };

    /**
     * Re-init logic
     */
    const reInit = () => {
        currentPage = 0;
        scrollDist = 0
        init();
    };

    /**
     * Kick-off logic
     */
    const init = () => {
        viewportWidth = window.innerWidth;
        cacheDOM();
        setVisiblePanels();
        renderResults();
        setupEvents();
    };

    window.addEventListener('DOMContentLoaded', init);
    window.addEventListener('resize', reInit);
})();