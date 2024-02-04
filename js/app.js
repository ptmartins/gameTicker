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
                    break;
                case 'Barnsley':
                    break;
                case 'Bournemouth':
                    break;
                case 'Brentford':
                    break;
                case 'Brighton & Hove Albion':
                    break;
                case 'Burnley':
                    break;
                case 'Chelsea':
                    break;
                case 'Crystal Palace':
                    break;
                case 'Everton':
                    break;
                case 'Fulham':
                    break;
                case 'Leeds United':
                    break;
                case 'Leicester City':
                    break;
                case 'Liverpool':
                    break;
                case 'Luton Town':
                    break;
                case 'Manchester City':
                    break;
                case 'Manchester United':
                    break;
                case 'Newcastle United':
                    break;                
                case 'Nottingham Forest':
                    break;                
                case 'Sheffield United':
                    break;  
                case 'Southampton':
                    break;  
                case 'Tottenham Hotspur':
                    break;  
                case 'West Ham United':
                    break;  
                case 'Wolverhampton Wanderers':
                    break;  
                default: 
                    break;
            }
        }
    }

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
    }

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
    }

    /**
     * Setup Events
     */
    const setupEvents = () => {
        DOM.navPrev.addEventListener('click', goToPrev);
        DOM.navNext.addEventListener('click', goToNext);
    }

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
    window.addEventListener('resize', init);
})();