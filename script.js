// Story data structure
const storyData = {
    scenes: {
        scene1: {
            timeRemaining: 600, // 10:00
            next: {
                choice1: 'scene2a', // Keep walking and chatting
                choice2: 'scene2b'  // Say goodbye and head to your room
            }
        },
        scene2a: {
            timeRemaining: 450, // ~7:30 remaining (staying)
            next: {
                choice1: 'scene6' // Continue Chatting (leads to running out of time)
            }
        },
        scene2b: {
            timeRemaining: 525, // ~8:45 remaining (leaving)
            next: {
                choice1: 'scene3' // Head to your room
            }
        },
        scene3: {
            timeRemaining: 420, // ~7:00 remaining (in dorm)
            next: {
                choice1: 'scene4a', // Heat the ramen
                choice2: 'scene4b'  // Grab the laundry basket
            }
        },
        scene4a: {
            timeRemaining: 240, // ~4:00 remaining (chosen ramen)
            next: {
                choice1: 'scene6' // Finish Ramen (leads to running out of time)
            }
        },
        scene4b: {
            timeRemaining: 330, // ~5:30 remaining (chosen laundry)
            next: {
                choice1: 'scene5' // Go to Laundry Room
            }
        },
        scene5: {
            timeRemaining: 210, // ~3:30 remaining (in laundry room)
            next: {
                choice1: { sceneId: 'scene7', ending: 'laundry' } // Finish Laundry (leads to success ending)
            }
        },
        scene6: {
            timeRemaining: 120, // ~2:00 remaining (ran out of time)
            next: {
                choice1: { sceneId: 'scene7', ending: 'timeout' } // Face the Consequences (leads to fail ending)
            }
        },
        scene7: {
            timeRemaining: 0, // 0:00 (End of story)
            next: {} // No choices in the end scene
        }
    },
    endingThoughts: {
        laundry: "It wasn't much. But it was mine.",
        timeout: "I'll fix it next time. I think."
    }
};

// Game state
let currentScene = 'scene1';
let timerInterval;
let timeRemaining = storyData.scenes.scene1.timeRemaining;
let sceneHistory = [];
let futureScenes = [];
let isTransitioning = false;

// DOM Elements
const sceneContainer = document.getElementById('scene-container');
const timeRemainingElement = document.getElementById('time-remaining');
const restartBtn = document.getElementById('restart-btn');
const thoughtBubble = document.getElementById('thought-bubble');
const thoughtText = document.getElementById('thought-text');
const endingThoughtElement = document.getElementById('ending-thought');
const loadingIndicator = document.querySelector('.loading');

// Add these utility functions at the top level
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Add cleanup utility
const cleanup = {
    eventListeners: new Set(),
    timers: new Set(),
    transitions: new Set(),
    
    addEventListener(element, type, handler) {
        element.addEventListener(type, handler);
        this.eventListeners.add({ element, type, handler });
    },
    
    addTimer(timer) {
        this.timers.add(timer);
    },
    
    addTransition(element, handler) {
        this.transitions.add({ element, handler });
    },
    
    clearAll() {
        // Clear all event listeners
        this.eventListeners.forEach(({ element, type, handler }) => {
            element.removeEventListener(type, handler);
        });
        this.eventListeners.clear();
        
        // Clear all timers
        this.timers.forEach(timer => clearTimeout(timer));
        this.timers.clear();
        
        // Clear all transitions
        this.transitions.forEach(({ element, handler }) => {
            element.removeEventListener('transitionend', handler);
        });
        this.transitions.clear();
        
        // Clear the main timer interval
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        
        // Reset transition state
        isTransitioning = false;
    }
};

// --- Story Logic Functions ---
// Enhanced story initialization
async function initStory() {
    if (!document.getElementById('comic').classList.contains('active')) {
        return;
    }

    // Show loading indicator
    loadingIndicator.classList.remove('hidden');

    // Reset game state
    currentScene = 'scene1';
    timeRemaining = storyData.scenes.scene1.timeRemaining;
    sceneHistory = [];
    futureScenes = [];
    endingThoughtElement.textContent = '';
    endingThoughtElement.classList.add('hidden');

    // Initialize with animation
    await showScene('scene1');
    startTimer();
    setupEventListeners();
    updateNavigationButtons();

    // Hide loading indicator
    loadingIndicator.classList.add('hidden');
}

// Enhanced scene transition
async function showScene(sceneId, isBack = false) {
    if (isTransitioning) return;
    
    try {
        isTransitioning = true;

        const comicContainer = document.getElementById('comic');
        if (!comicContainer || !comicContainer.classList.contains('active')) {
            isTransitioning = false;
            return;
        }

        const currentActiveScene = document.querySelector('#scene-container .scene.active');
        const nextScene = document.getElementById(sceneId);

        if (currentActiveScene === nextScene) {
            isTransitioning = false;
            return;
        }

        if (currentActiveScene) {
            currentActiveScene.style.opacity = '0';
            currentActiveScene.style.transform = 'translateX(20px)';

            const transitionHandler = () => {
                currentActiveScene.classList.remove('active');
                cleanup.addTransition(currentActiveScene, transitionHandler);
                activateScene(nextScene, sceneId, isBack);
            };
            
            cleanup.addTransition(currentActiveScene, transitionHandler);
            currentActiveScene.addEventListener('transitionend', transitionHandler);
        } else {
            await activateScene(nextScene, sceneId, isBack);
        }
    } catch (error) {
        console.error('Scene transition error:', error);
        isTransitioning = false;
    }
}

async function activateScene(scene, sceneId, isBack) {
    if (scene) {
        if (!isBack && currentScene && currentScene !== sceneId) {
            sceneHistory.push(currentScene);
        }

        // Force reflow before showing the new scene
        scene.offsetHeight;

        scene.classList.add('active');
        scene.style.opacity = '1';
        scene.style.transform = 'translateX(0)';

        // Listen for transition end on the new section
        scene.addEventListener('transitionend', function handler() {
            scene.removeEventListener('transitionend', handler);
            isTransitioning = false; // Allow clicks again
        });

        currentScene = sceneId;
        updateTimer(storyData.scenes[sceneId].timeRemaining);
        updateNavigationButtons();

        // Handle ending scene
        if (sceneId === 'scene7') {
            clearInterval(timerInterval);
            timerInterval = null;
            showRestartButton();
        } else {
            restartBtn.classList.add('hidden');
            endingThoughtElement.textContent = '';
            endingThoughtElement.classList.add('hidden');
        }
    } else {
        isTransitioning = false; // Release transition lock if scene not found
    }
}

// Enhanced timer with visual feedback
function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    const timerElement = document.getElementById('time-remaining');
    timerElement.classList.add('timer-active');

    timerInterval = setInterval(() => {
        if (timeRemaining > 0) {
            timeRemaining--;
            updateTimerDisplay();
            
            if (timeRemaining <= 30) {
                timerElement.classList.add('timer-warning');
            }
        } else {
            clearInterval(timerInterval);
            timerInterval = null;
            timerElement.classList.remove('timer-active', 'timer-warning');
            
            try {
                if (currentScene !== 'scene6' && currentScene !== 'scene7') {
                    showScene('scene6');
                    displayEndingThought('timeout');
                } else if (currentScene === 'scene6') {
                    displayEndingThought('timeout');
                }
                showRestartButton();
                updateNavigationButtons();
            } catch (error) {
                console.error('Timer end error:', error);
                isTransitioning = false;
            }
        }
    }, 1000);
    
    cleanup.addTimer(timerInterval);
}

function updateTimer(seconds) {
    timeRemaining = seconds;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timeRemainingElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Enhanced thought bubble
function showThought(text) {
    thoughtText.textContent = text;
    thoughtBubble.classList.remove('hidden');
    
    // Force reflow
    thoughtBubble.offsetHeight;
    
    thoughtBubble.classList.add('visible');
    
    setTimeout(() => {
        thoughtBubble.classList.remove('visible');
        const timer = setTimeout(() => {
            thoughtBubble.classList.add('hidden');
        }, 400);
        cleanup.addTimer(timer);
    }, 4000);
}

// Enhanced ending thought display
function displayEndingThought(endingType) {
    const thought = storyData.endingThoughts[endingType];
    if (thought) {
        endingThoughtElement.style.opacity = '0';
        endingThoughtElement.textContent = thought;
        endingThoughtElement.classList.remove('hidden');
        
        // Force reflow
        endingThoughtElement.offsetHeight;
        
        endingThoughtElement.style.opacity = '1';
    }
}

// Enhanced choice handling with animation
async function handleChoice(choiceButton) {
    if (isTransitioning) return;
    
    // Add click animation
    choiceButton.classList.add('choice-clicked');
    const timer = setTimeout(() => choiceButton.classList.remove('choice-clicked'), 200);
    cleanup.addTimer(timer);

    clearInterval(timerInterval);
    timerInterval = null;

    const nextSceneInfo = storyData.scenes[currentScene].next[choiceButton.dataset.choice];
    
    if (nextSceneInfo) {
        if (typeof nextSceneInfo === 'object') {
            await showScene(nextSceneInfo.sceneId);
            if (nextSceneInfo.ending) {
                displayEndingThought(nextSceneInfo.ending);
            }
        } else {
            await showScene(nextSceneInfo);
        }
    }
}

// Restart functionality
function restartStory() {
    initStory();
}

// Back and Forward Navigation
function goBack() {
    if (sceneHistory.length > 0) {
        clearInterval(timerInterval); // Stop timer when going back
        timerInterval = null;
        futureScenes.push(currentScene); // Push current scene to future for potential forward nav
        const previousSceneId = sceneHistory.pop();
        showScene(previousSceneId, true); // Pass true to indicate navigating back
        // updateNavigationButtons(); // Called by showScene
    }
}

function goForward() {
    if (futureScenes.length > 0) {
         clearInterval(timerInterval); // Stop timer when going forward
         timerInterval = null;
        const nextSceneId = futureScenes.pop();
         sceneHistory.push(currentScene); // Push current scene to history
        showScene(nextSceneId);
        // updateNavigationButtons(); // Called by showScene
    }
}

// Enhanced navigation buttons
function updateNavigationButtons() {
    const activeSceneElement = document.getElementById(currentScene);
    const backBtn = activeSceneElement?.querySelector('.back-btn');
    const forwardBtn = activeSceneElement?.querySelector('.forward-btn');

    if (backBtn) {
        backBtn.disabled = sceneHistory.length === 0;
        backBtn.classList.toggle('nav-btn-disabled', sceneHistory.length === 0);
    }

    if (forwardBtn) {
        forwardBtn.disabled = futureScenes.length === 0;
        forwardBtn.classList.toggle('nav-btn-disabled', futureScenes.length === 0);
    }

    restartBtn.classList.toggle('hidden', currentScene !== 'scene7' && timeRemaining > 0);
}

// Show restart button
function showRestartButton() {
    restartBtn.classList.remove('hidden');
}

// --- End Story Logic Functions ---

// Replace the initializeTabs function with this enhanced version
async function initializeTabs() {
    cleanup.clearAll(); // Clear any existing listeners
    
    const tabLinks = document.querySelectorAll('.top-nav a[data-tab]');
    const contentSections = document.querySelectorAll('.content-section');

    // Show home section by default with animation
    document.getElementById('home').classList.add('active');
    document.querySelector('.top-nav a[data-tab="home"]').classList.add('active');

    // Debounced tab click handler
    const handleTabClick = debounce(async (e, link) => {
        e.preventDefault();
        if (isTransitioning) return;

        const tabId = link.getAttribute('data-tab');
        const currentSection = document.querySelector('.content-section.active');
        const newSection = document.getElementById(tabId);

        if (currentSection === newSection) return;

        try {
            isTransitioning = true;
            
            // Update active tab
            tabLinks.forEach(t => {
                t.classList.remove('active', 'hovered');
            });
            link.classList.add('active');

            loadingIndicator.classList.remove('hidden');

            if (currentSection) {
                currentSection.style.opacity = '0';
                currentSection.style.transform = 'translateY(20px)';

                const transitionHandler = () => {
                    currentSection.classList.remove('active');
                    cleanup.addTransition(currentSection, transitionHandler);
                    activateNewSection(newSection, tabId);
                };
                
                cleanup.addTransition(currentSection, transitionHandler);
                currentSection.addEventListener('transitionend', transitionHandler);
            } else {
                await activateNewSection(newSection, tabId);
            }
        } catch (error) {
            console.error('Tab transition error:', error);
            isTransitioning = false;
            loadingIndicator.classList.add('hidden');
        }
    }, 300); // 300ms debounce

    // Add hover effects and click handlers
    tabLinks.forEach(link => {
        cleanup.addEventListener(link, 'mouseenter', () => {
            if (!link.classList.contains('active')) {
                link.classList.add('hovered');
            }
        });

        cleanup.addEventListener(link, 'mouseleave', () => {
            link.classList.remove('hovered');
        });

        cleanup.addEventListener(link, 'click', (e) => handleTabClick(e, link));
    });

    // Add click handler for CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        cleanup.addEventListener(ctaButton, 'click', (e) => {
            e.preventDefault();
            document.querySelector('.top-nav a[data-tab="comic"]').click();
        });
    }
}

async function activateNewSection(newSection, tabId) {
    // Force reflow before showing the new section
    newSection.offsetHeight;

    newSection.classList.add('active');
    newSection.style.opacity = '1';
    newSection.style.transform = 'translateY(0)';

    // Listen for transition end on the new section
    newSection.addEventListener('transitionend', function handler() {
        newSection.removeEventListener('transitionend', handler); // Remove listener after it fires

        // Hide loading indicator after transition
        loadingIndicator.classList.add('hidden');
        isTransitioning = false; // Allow clicks again

        // If switching to comic tab, initialize the story
        if (tabId === 'comic') {
            initStory(); // Call initStory without await to avoid blocking
        } else {
            // Clear any running timers when leaving comic tab
            clearInterval(timerInterval);
            timerInterval = null;
        }
    });
}

// Replace the setupEventListeners function with this enhanced version
function setupEventListeners() {
    cleanup.clearAll(); // Clear any existing listeners before setting up new ones

    // Debounced choice handler
    const handleChoiceClick = debounce(async (e) => {
        const choiceButton = e.target.closest('.choice-btn');
        if (choiceButton && !choiceButton.disabled) {
            const currentSceneElement = document.getElementById(currentScene);
            const choiceButtonsInScene = currentSceneElement.querySelectorAll('.choice-btn');
            let choiceIndex = -1;
            
            choiceButtonsInScene.forEach((btn, index) => {
                if (btn === choiceButton || (e.target.tagName === 'IMG' && e.target.parentElement === btn)) {
                    choiceIndex = index + 1;
                }
            });

            if (choiceIndex !== -1) {
                try {
                    choiceButton.dataset.choice = 'choice' + choiceIndex;
                    await handleChoice(choiceButton);
                    delete choiceButton.dataset.choice;
                    futureScenes = [];
                } catch (error) {
                    console.error('Choice handling error:', error);
                    isTransitioning = false;
                }
            }
        }
    }, 300);

    // Add event listeners with cleanup tracking
    cleanup.addEventListener(sceneContainer, 'mouseover', (e) => {
        const choiceButton = e.target.closest('.choice-btn');
        if (choiceButton && !choiceButton.disabled) {
            choiceButton.classList.add('choice-hover');
        }
    });

    cleanup.addEventListener(sceneContainer, 'mouseout', (e) => {
        const choiceButton = e.target.closest('.choice-btn');
        if (choiceButton) {
            choiceButton.classList.remove('choice-hover');
        }
    });

    cleanup.addEventListener(sceneContainer, 'click', handleChoiceClick);

    // Restart button
    cleanup.addEventListener(restartBtn, 'click', async () => {
        try {
            restartBtn.classList.add('restart-clicked');
            const timer = setTimeout(() => restartBtn.classList.remove('restart-clicked'), 200);
            cleanup.addTimer(timer);
            await restartStory();
        } catch (error) {
            console.error('Restart error:', error);
            isTransitioning = false;
        }
    });

    // Navigation buttons
    const handleNavigation = debounce(async (e, direction) => {
        const button = e.target.closest(`.${direction}-btn`);
        if (button && !button.disabled) {
            try {
                button.classList.add('nav-btn-clicked');
                const timer = setTimeout(() => button.classList.remove('nav-btn-clicked'), 200);
                cleanup.addTimer(timer);
                await (direction === 'back' ? goBack() : goForward());
            } catch (error) {
                console.error(`${direction} navigation error:`, error);
                isTransitioning = false;
            }
        }
    }, 300);

    cleanup.addEventListener(sceneContainer, 'click', (e) => handleNavigation(e, 'back'));
    cleanup.addEventListener(sceneContainer, 'click', (e) => handleNavigation(e, 'forward'));

    // Scene 5 thought bubble
    const scene5Visual = document.querySelector('#scene5 .visual');
    if (scene5Visual) {
        cleanup.addEventListener(scene5Visual, 'mouseenter', () => {
            showThought("Maybe I should check the dryer...");
        });
    }
}

// Show restart button
function showRestartButton() {
    restartBtn.classList.remove('hidden');
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    
    // Enhanced image loading with error handling
    document.querySelectorAll('img').forEach(img => {
        // Add loading state
        img.classList.add('loading-image');
        
        // Log when image starts loading
        console.log(`Loading image: ${img.src}`);
        
        // Handle successful load
        img.addEventListener('load', () => {
            console.log(`Image loaded successfully: ${img.src}`);
            img.classList.remove('loading-image');
            img.classList.add('image-loaded');
        });
        
        // Handle load errors
        img.addEventListener('error', (e) => {
            console.error(`Failed to load image: ${img.src}`, e);
            img.classList.remove('loading-image');
            img.classList.add('image-error');
            // Add fallback text
            img.alt = `[Image failed to load: ${img.alt}]`;
        });
        
        // Force image reload if it's already cached
        if (img.complete) {
            if (img.naturalHeight === 0) {
                console.error(`Image failed to load (cached): ${img.src}`);
                img.classList.add('image-error');
            } else {
                console.log(`Image already loaded (cached): ${img.src}`);
                img.classList.add('image-loaded');
            }
        }
    });
});

// Add cleanup on page unload
window.addEventListener('beforeunload', () => {
    cleanup.clearAll();
}); 