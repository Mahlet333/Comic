class LivingComic {
    constructor() {
        this.currentSlide = 0;
        this.timeLeft = 600; // 10 minutes in seconds
        this.choices = [];
        this.timerActive = false;
        this.stressLevel = 0;
        this.currentView = 'home'; // 'home' or 'comic'
        this.currentStoryPath = [];
        this.storyPanels = this.defineStoryStructure();
        this.currentBackgroundSound = null; // Initialize background sound player
        
        this.init();
    }

    defineStoryStructure() {
        // STORY STRUCTURE BASED ON YOUR ACTUAL IMAGES
        // The story has two key decision points that redirect the narrative flow
        return {
            'start': {
                id: 'start',
                caption: "He always plans too much for too little time. Today, he has only ten minutes. And a thousand tiny decisions.",
                image: 'images/1.png',
                next: 'friend_approach',
                sound: 'sounds/science-teacher-lecturing-33676.mp3',
                soundEffect: 'TICK...TICK...'
            },
            'friend_approach': {
                id: 'friend_approach',
                caption: "She is chatting on but his brain's already running ahead of his. Should he stay and chat or run to the room??? Help him make a decision.",
                image: 'images/2.png',
                choices: [
                    { text: 'STAY & CHAT', action: 'chat', next: 'chat_scene' },
                    { text: 'RUN TO ROOM', action: 'rush', next: 'hallway_run' }
                ],
                sound: 'sounds/help-me-131903.mp3'
            },
            'chat_scene': {
                id: 'chat_scene',
                caption: "They sat down, and the conversation got better and better!!! And he kept worrying about the chores waiting for him in the room.",
                image: 'images/3.png',
                next: 'rush_stairs',
                sound: 'sounds/soft-laughing-6445.mp3'
            },
            'rush_stairs': {
                id: 'rush_stairs',
                caption: "After they separated, he ran! Food? Laundry? Breathing? He just needed to clear his head in ten minutes or less.",
                image: 'images/4.png',
                next: 'hallway_run',
                sound: 'sounds/running-14658.mp3'
            },
            'hallway_run': {
                id: 'hallway_run',
                caption: "Less than ten minutes. No plan. No pause. Just run.",
                image: 'images/5.png',
                next: 'room_door',
                sound: 'sounds/running-14658.mp3'
            },
            'room_door': {
                id: 'room_door',
                caption: "He finally reached his room. But inside waited two battles: One boiling, one overflowing.",
                image: 'images/6.png',
                next: 'big_choice',
                sound: 'sounds/male-sigh-6763.mp3'
            },
            'big_choice': {
                id: 'big_choice',
                caption: "He doesn't have time to think. He needs to act. Now. HELP HIM CHOOSE!",
                image: 'images/7.png',
                choices: [
                    { text: 'MAKE RAMEN', action: 'ramen', next: 'ramen_bliss' },
                    { text: 'DO LAUNDRY', action: 'laundry', next: 'laundry_journey' }
                ],
                sound: 'sounds/thinking-sound-effect-96989.mp3'
            },
            'ramen_bliss': {
                id: 'ramen_bliss',
                caption: "For a second, everything else faded. No deadlines. No choices. Just noodles.",
                image: 'images/8.png',
                next: 'time_shock',
                sound: 'sounds/man-eating-teriyaki-noodles-33320.mp3'
            },
            'time_shock': {
                id: 'time_shock',
                caption: "But....He had almost forgotten that time was almost up. He quickly checked his phone. It was already time for his next class..",
                image: 'images/9.png',
                next: 'ramen_unfinished',
                sound: 'sounds/horror-orchestra-warning-338415.mp3'
            },
            'ramen_unfinished': {
                id: 'ramen_unfinished',
                caption: "He didn't finish the noodles. But time waits for no one. So he grabbed his bag... and ran.",
                image: 'images/10.png',
                next: 'final_ending'
            },
            'laundry_journey': {
                id: 'laundry_journey',
                caption: "Let's get this over with. He made his choice. Laundry over lunch.",
                image: 'images/11.png',
                next: 'laundry_hallway',
                sound: 'sounds/041544_last-dance-77508.mp3',
                soundEffect: 'I got this'
            },
            'laundry_hallway': {
                id: 'laundry_hallway',
                caption: "He made his choice. Laundry over lunch.",
                image: 'images/12.png',
                next: 'washing_machine'
            },
            'washing_machine': {
                id: 'washing_machine',
                caption: "He finally set out for the unexplored zones. THE LAUNDRY ROOM. Where rigour is tested and only the strong survive.",
                image: 'images/13.png',
                next: 'laundry_victory',
                sound: 'sounds/laundry-75135.mp3'
            },
            'laundry_victory': {
                id: 'laundry_victory',
                caption: "DONE AND GONE!!! Yalla to the next class!!!",
                image: 'images/14.png',
                next: 'final_ending',
                sound: 'sounds/funny-yay-6273.mp3'
            },
            'final_ending': {
                id: 'final_ending',
                caption: "He used his ten minutes. Not perfectly. Not completely. But he used them.",
                image: 'images/15.png'
            }
        };
    }

    init() {
        // Build the story path immediately
        this.buildInitialStoryPath();
        
        this.hideLoading();
        this.setupEventListeners();
        this.showHome();
        this.createAtmosphericEffects();
        this.setupResponsiveHandlers();
    }

    setupResponsiveHandlers() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleResize();
            }, 500); // Wait for orientation change to complete
        });
    }

    handleResize() {
        // Recalculate panel sizes for current screen
        if (this.currentView === 'comic') {
            this.recalculatePanelSizes();
        }
    }

    recalculatePanelSizes() {
        // Re-adjust all visible panels
        const panels = document.querySelectorAll('.comic-panel');
        panels.forEach(panel => {
            const img = panel.querySelector('.comic-image');
            if (img && img.complete) {
                this.adjustPanelSizeResponsively(panel.querySelector('.photo-container'), img);
            }
        });
    }

    hideLoading() {
        setTimeout(() => {
            document.getElementById('loading').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loading').style.display = 'none';
            }, 500);
        }, 2000);
    }

    setupEventListeners() {
        // Navigation
        this.setupNavigation();

        // Home page interactions
        document.getElementById('interactiveClock').addEventListener('click', () => this.startComic());
        document.getElementById('startButton').addEventListener('click', () => this.startComic());
        
        // Preview panels
        document.querySelectorAll('.preview-panel').forEach(panel => {
            panel.addEventListener('click', () => this.previewPanel(panel));
        });

        // Slider navigation
        document.getElementById('prevBtn').addEventListener('click', () => this.prevSlide());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextSlide());

        // Controls
        document.getElementById('restartBtn').addEventListener('click', () => this.restart());
        document.getElementById('fullscreenBtn').addEventListener('click', () => this.toggleFullscreen());
        document.getElementById('modalClose').addEventListener('click', () => this.closeModal());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.currentView === 'comic') {
                if (e.key === 'ArrowLeft') this.prevSlide();
                if (e.key === 'ArrowRight') this.nextSlide();
            }
        });

        // Global interactions (ripple effect)
        document.addEventListener('click', (e) => this.createClickEffect(e));
    }

    setupNavigation() {
        // Navigation links
       document.getElementById('navHome').addEventListener('click', (e) => {
           e.preventDefault();
           this.closeModal();       // ← close “About” if it’s open
          this.showHome();
      });

       document.getElementById('navComic').addEventListener('click', (e) => {
          e.preventDefault();
          this.closeModal();       // ← close “About” if it’s open
           this.startComic();
      });   

        document.getElementById('navAbout').addEventListener('click', (e) => {
            e.preventDefault();
            this.showAbout();
        });

       document.getElementById('navTeam').addEventListener('click', (e) => {
           e.preventDefault();
           this.closeModal();       // ← close “About” if it’s open
           this.showTeam();
       });

       document.getElementById('navLogo').addEventListener('click', (e) => {
           e.preventDefault();
           this.closeModal();       // ← close “About” if it’s open
           this.showHome();
       });


        // Mobile menu toggle
        document.getElementById('navBurger').addEventListener('click', () => {
            this.toggleMobileMenu();
        });
    }

    // View Management
    showHome() {
   // Always close the About modal before switching away
    this.closeModal();

    this.currentView = 'home';
    if (this.currentBackgroundSound) {
        this.currentBackgroundSound.pause();
        this.currentBackgroundSound.currentTime = 0;
        this.currentBackgroundSound = null;
    }
    document.getElementById('homePage').classList.add('active');
    document.getElementById('comicPage').classList.remove('active');

    
    document.getElementById('teamPage').classList.remove('active');
    document.getElementById('comicWorld').style.display = 'block';
    document.getElementById('timer').style.display = 'none';
    this.stopTimer();
}

showTeam() {
    this.currentView = 'team';

    // ◀ Stop any comic audio when switching to Team
    if (this.currentBackgroundSound) {
        this.currentBackgroundSound.pause();
        this.currentBackgroundSound.currentTime = 0;
        this.currentBackgroundSound = null;
    }

    document.getElementById('homePage').classList.remove('active');
    document.getElementById('comicPage').classList.remove('active');
    document.getElementById('comicWorld').style.display = 'none';
    document.getElementById('teamPage').classList.add('active');
    document.getElementById('timer').style.display = 'none';
    this.stopTimer();

    // Generate and display team members
    this.displayTeamMembers();
}
js
Copy
Edit


    showComic() {
        this.currentView = 'comic';
        document.getElementById('homePage').classList.remove('active');
        document.getElementById('comicPage').classList.add('active');
        document.getElementById('teamPage').classList.remove('active');
        document.getElementById('timer').style.display = 'block';
        
        // Make sure we have slides to show
        if (this.currentStoryPath.length === 0) {
            this.buildInitialStoryPath();
        }
        if (document.getElementById('sliderTrack').children.length === 0) {
            this.generateSlides();
        }
        
        this.updateSliderPosition();
    }

    startComic() {
        this.currentView = 'comic';
        document.getElementById('homePage').classList.remove('active');
        document.getElementById('comicPage').classList.add('active');

         document.getElementById('comicWorld').style.display = 'block';
         document.getElementById('timer').style.display = 'block';
         
        document.getElementById('teamPage').classList.remove('active');

        
        
        this.buildInitialStoryPath();
        this.generateSlides();
        this.startTimer();
        this.goToSlide(0);
    }

    buildInitialStoryPath() {
        // Only push panels up through the first decision point ('friend_approach').
        this.currentStoryPath = ['start', 'friend_approach'];
        this.currentSlide = 0;
        console.log('Built initial story path:', this.currentStoryPath);
    }

    generateSlides() {
        const sliderTrack = document.getElementById('sliderTrack');
        sliderTrack.innerHTML = '';

        this.currentStoryPath.forEach((panelId, index) => {
            const panel = this.storyPanels[panelId];
            if (panel) {
                const slide = this.createSlideElement(panel, index);
                sliderTrack.appendChild(slide);
            }
        });

        this.updateSliderWidth();
        this.updateDots();
        this.updateSliderPosition();
        
        // Debug: log the number of slides created
        console.log(`Generated ${this.currentStoryPath.length} slides`);
    }

    createSlideElement(panel, index) {
        console.log(`Creating slide ${index} for panel:`, panel.id);
        
        const slide = document.createElement('div');
        slide.className = `slide slide-${index + 1}`;
        slide.id = `slide${index + 1}`;
        
        const comicPanel = document.createElement('div');
        comicPanel.className = `comic-panel panel-${index + 1}`;
        
        const panelContent = document.createElement('div');
        panelContent.className = 'panel-content';
        
        // Create photo container
        const photoContainer = document.createElement('div');
        photoContainer.className = 'photo-container';
        
        // Add image or placeholder
        this.addImageToContainer(photoContainer, panel);
        
        // Add caption
        const caption = document.createElement('div');
        caption.className = 'image-caption';
        caption.textContent = panel.caption;
        photoContainer.appendChild(caption);
        
        panelContent.appendChild(photoContainer);
        
        // Add choice portals if this panel has choices
        if (panel.choices) {
            console.log(`Adding choices for panel ${panel.id}:`, panel.choices);
            
            // Create a container for the choice buttons
            const choiceContainer = document.createElement('div');
            choiceContainer.className = 'choice-container';

            panel.choices.forEach((choice, choiceIndex) => {
                const choicePortal = document.createElement('div');
                choicePortal.className = 'choice-portal';
                choicePortal.textContent = choice.text;
                
                // Remove absolute positioning styles from JS
                // choicePortal.style.position = 'absolute';
                // choicePortal.style.top      = '50%';
                // choicePortal.style[ choiceIndex === 0 ? 'left' : 'right' ] = '5%';
                
                choicePortal.addEventListener('click', (e) => this.makeChoice(choice.action, choice.next, e));
                // Append to the new container instead of photoContainer
                choiceContainer.appendChild(choicePortal);
            });
            
            // Append the choice container to the slide, outside the comic panel
            slide.appendChild(choiceContainer);
        }
        
        comicPanel.appendChild(panelContent);
        slide.appendChild(comicPanel);
        
        return slide;
    }

    addImageToContainer(container, panel) {
        if (panel.image) {
            // Create loading state first
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'image-loading';
            container.appendChild(loadingDiv);
            
            // Create actual image
            const img = document.createElement('img');
            img.className = 'comic-image';
            img.alt = panel.caption;
            
            img.onload = () => {
                // Remove loading state and add image
                container.removeChild(loadingDiv);
                container.insertBefore(img, container.firstChild);
                
                // Adjust panel size based on image - IMPROVED VERSION
                this.adjustPanelSizeResponsively(container, img);
            };
            
            img.onerror = () => {
                // Remove loading state and show error
                container.removeChild(loadingDiv);
                const errorDiv = document.createElement('div');
                errorDiv.className = 'image-error';
                container.insertBefore(errorDiv, container.firstChild);
                
                console.warn(`Image not found: ${panel.image}`);
            };
            
            img.src = panel.image;
        } else {
            // Use placeholder
            const placeholder = document.createElement('div');
            placeholder.className = 'photo-placeholder';
            container.insertBefore(placeholder, container.firstChild);
        }
    }

    // IMPROVED: Responsive panel sizing that prevents overflow
    adjustPanelSizeResponsively(container, img) {
        const panel = container.closest('.comic-panel');
        if (!panel) return;
        
        // Get available space (viewport minus UI elements)
        const navbarHeight = 80; // Fixed navbar height
        const controlsHeight = 100; // Space for controls and dots
        const navigationWidth = 160; // Space for left/right arrows
        
        const availableWidth = window.innerWidth - navigationWidth;
        const availableHeight = window.innerHeight - navbarHeight - controlsHeight;
        
        // Get image dimensions
        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;
        const aspectRatio = imgWidth / imgHeight;
        
        // Calculate optimal dimensions within constraints
        let optimalWidth, optimalHeight;
        
        // Use aggressive scaling factors to make the image as large as possible
        const widthFactor = 0.98; // Use 98% of available width
        const heightFactor = 0.95; // Use 95% of available height (leaving space for caption/padding)

        // Calculate potential dimensions based on fitting to available width or height
        const widthBasedOnHeight = availableHeight * heightFactor * aspectRatio;
        const heightBasedOnWidth = availableWidth * widthFactor / aspectRatio;

        // Choose the dimensions that are largest but still fit within natural image size and available space
        if (widthBasedOnHeight <= availableWidth * widthFactor && widthBasedOnHeight <= imgWidth) {
            // Fitting to height is the limiting factor, but width fits
            optimalHeight = availableHeight * heightFactor;
            optimalWidth = optimalHeight * aspectRatio;
        } else if (heightBasedOnWidth <= availableHeight * heightFactor && heightBasedOnWidth <= imgHeight) {
            // Fitting to width is the limiting factor, but height fits
            optimalWidth = availableWidth * widthFactor;
            optimalHeight = optimalWidth / aspectRatio;
        } else if (imgWidth / (availableWidth * widthFactor) > imgHeight / (availableHeight * heightFactor)) {
             // Image is relatively wider compared to available space ratio, fit to width
             optimalWidth = availableWidth * widthFactor;
            optimalHeight = optimalWidth / aspectRatio;
        }
         else {
            // Image is relatively taller, fit to height
            optimalHeight = availableHeight * heightFactor;
            optimalWidth = optimalHeight * aspectRatio;
        }
        
        // Ensure optimal dimensions do not exceed natural image dimensions
        optimalWidth = Math.min(optimalWidth, imgWidth);
        optimalHeight = Math.min(optimalHeight, imgHeight);

        // Also ensure a reasonable minimum size if needed (optional, current CSS clamp might handle this)
        // optimalWidth = Math.max(optimalWidth, 300); // Example minimum width
        // optimalHeight = Math.max(optimalHeight, 200); // Example minimum height
        
        // Add space for caption (120px) and padding (40px total top/bottom)
        const panelPadding = 40; // Total padding around image container
        const captionHeight = 120; // Estimated height for caption

        // Calculate panel dimensions based on optimal image size plus padding and caption
        const panelWidthBasedOnImage = optimalWidth + panelPadding; // Panel width is image width + horizontal padding
        const panelHeightBasedOnImage = optimalHeight + captionHeight + panelPadding; // Panel height is image height + caption + vertical padding
        
        // The panel should be sized to contain its content, but not exceed available space.
        // Choose the dimensions that best fit the content while staying within available space.
        let finalPanelWidth = Math.min(panelWidthBasedOnImage, availableWidth);
        let finalPanelHeight = Math.min(panelHeightBasedOnImage, availableHeight);

        // Apply computed dimensions to the panel
        panel.style.width = finalPanelWidth + 'px';
        panel.style.height = finalPanelHeight + 'px';
        
        // Ensure panel fits in all cases (redundant with lines above, but good safeguard)
        panel.style.maxWidth = 'calc(100vw - 20px)'; // Minimal overall max width constraint
        panel.style.maxHeight = 'calc(100vh - 60px)'; // Minimal overall max height constraint
        panel.style.overflow = 'hidden';
        
        console.log(`Adjusted panel size: ${panel.style.width} x ${panel.style.height}. Optimal Image: ${optimalWidth.toFixed(0)}x${optimalHeight.toFixed(0)}`);
    }

    updateSliderWidth() {
        const track = document.getElementById('sliderTrack');
        const slideCount = this.currentStoryPath.length;
        track.style.width = `${slideCount * 100}%`;
        
        const slides = track.querySelectorAll('.slide');
        slides.forEach(slide => {
            slide.style.width = `${100 / slideCount}%`;
            slide.style.flexShrink = '0';
            slide.style.height = '100%';
        });
    }

    updateDots() {
        const dotsContainer = document.getElementById('sliderDots');
        dotsContainer.innerHTML = '';
        
        this.currentStoryPath.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `dot ${index === this.currentSlide ? 'active' : ''}`;
            dot.setAttribute('data-slide', index);
            dot.addEventListener('click', () => this.goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }

    // Home Page Interactions
    previewPanel(panel) {
        const previewNumber = panel.dataset.preview;
        const previews = {
            '1': "Class just ended. The clock is ticking. You have exactly ten minutes until your next commitment. What's your first move?",
            '2': "Your friend approaches with that look - they want to chat. But you're calculating: transit time, task priority, energy levels...",
            '3': "Sometimes the only solution is speed. Running between responsibilities, your mind races faster than your feet.",
            '4': "Your room. Two simple choices that somehow carry the weight of your entire organizational system.",
            '5': "In a world demanding constant optimization, sometimes the most radical act is choosing comfort over productivity."
        };
        
        this.createExplosion(panel);
    }

    toggleMobileMenu() {
        const burger = document.getElementById('navBurger');
        const navLinks = document.getElementById('navLinks');
        const comicWorld = document.getElementById('comicWorld'); // Get comicWorld element
        const overlay = document.getElementById('overlay'); // Get overlay element

        burger.classList.toggle('active');
        navLinks.classList.toggle('active');

        // Toggle sidebar-active class on comicWorld to shift content
        if (comicWorld) {
            comicWorld.classList.toggle('sidebar-active');
        }

        // Toggle active class on overlay to show/hide it
        if (overlay) {
            overlay.classList.toggle('active');
        }
    }

    // Slider Functions
    nextSlide() {
        if (this.currentSlide < this.currentStoryPath.length - 1) {
            this.goToSlide(this.currentSlide + 1);
        } else {
            // Check if we're at an ending
            const currentPanelId = this.currentStoryPath[this.currentSlide];
            const currentPanel = this.storyPanels[currentPanelId];
            if (currentPanel && !currentPanel.next && !currentPanel.choices) {
                // This is an ending panel
                setTimeout(() => this.showConclusion(), 1000);
            }
        }
    }

    prevSlide() {
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    goToSlide(slideIndex) {
        console.log(`Navigating to slide index: ${slideIndex}`);
        if (slideIndex >= 0 && slideIndex < this.currentStoryPath.length) {
            // Always stop any currently playing background sound first
            if (this.currentBackgroundSound) {
                console.log('Stopping current background sound...');
                this.currentBackgroundSound.pause();
                this.currentBackgroundSound.currentTime = 0;
                this.currentBackgroundSound = null; // Clear the reference
                console.log('Current background sound stopped and cleared.');
            }

            this.currentSlide = slideIndex;
            this.updateSliderPosition();

            // Get the panel data for the new slide
            const currentPanelId = this.currentStoryPath[this.currentSlide];
            const currentPanel = this.storyPanels[currentPanelId];

            // Display sound effect text if defined for this panel
            if (currentPanel && currentPanel.soundEffect) {
                const effect = document.createElement('div');
                effect.className = 'sound-effect';
                effect.textContent = currentPanel.soundEffect;
                effect.style.left = Math.random() * 80 + 10 + '%';
                effect.style.top = Math.random() * 60 + 20 + '%';
                effect.style.position = 'absolute';
                effect.style.pointerEvents = 'none';
                effect.style.zIndex = '300';
                
                document.getElementById('comicWorld').appendChild(effect);
                
                setTimeout(() => effect.remove(), 2000);
            }

            // Play the background sound if defined for this panel
            if (currentPanel && currentPanel.sound) {
                console.log(`Attempting to play sound: ${currentPanel.sound}`);
                this.currentBackgroundSound = new Audio(currentPanel.sound);
                this.currentBackgroundSound.volume = 0.5; // Adjust volume as needed
                this.currentBackgroundSound.play().then(() => {
                    console.log(`Sound played successfully: ${currentPanel.sound}`);
                }).catch(error => {
                    console.error(`Error playing sound ${currentPanel.sound}:`, error);
                });
            } else {
                 console.log('No background sound defined for this panel.');
            }
        } else {
             console.log(`Invalid slide index: ${slideIndex}`);
        }
    }

    updateSliderPosition() {
        const track = document.getElementById('sliderTrack');
        const slideWidth = 100 / this.currentStoryPath.length;
        const translateX = -this.currentSlide * slideWidth;
        track.style.transform = `translateX(${translateX}%)`;

        // Update dots
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });

        // Update navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        prevBtn.classList.toggle('disabled', this.currentSlide === 0);
        nextBtn.classList.toggle('disabled', this.currentSlide === this.currentStoryPath.length - 1);
    }

    createExplosion(element) {
        const explosion = document.createElement('div');
        explosion.style.position = 'absolute';
        explosion.style.width = '200px';
        explosion.style.height = '200px';
        explosion.style.background = 'radial-gradient(circle, #ff6b35, #ff9800, transparent)';
        explosion.style.borderRadius = '50%';
        explosion.style.animation = 'explode 0.8s ease-out forwards';
        explosion.style.pointerEvents = 'none';
        explosion.style.zIndex = '150';
        
        const rect = element.getBoundingClientRect();
        explosion.style.left = (rect.left + rect.width/2 - 100) + 'px';
        explosion.style.top = (rect.top + rect.height/2 - 100) + 'px';
        
        document.body.appendChild(explosion);
        
        setTimeout(() => explosion.remove(), 800);
    }

    hideChoicePortal(portal) {
        portal.style.transform = 'scale(0)';
        portal.style.opacity = '0';
        setTimeout(() => portal.style.display = 'none', 300);
    }

    startTimer() {
        this.timerActive = true;
        
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 120) {
                this.increaseStress();
            }
            
            if (this.timeLeft <= 0) {
                this.handleTimeUp();
            }
        }, 1000);
    }

    stopTimer() {
        this.timerActive = false;
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const timerElement = document.getElementById('timer');
        
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (this.timeLeft <= 60) {
            timerElement.classList.add('urgent');
        }
    }

    updateTimerUrgency() {
        this.timeLeft = Math.max(this.timeLeft - 30, 0); // Choices cost time
    }

    increaseStress() {
        this.stressLevel++;
        this.createStressParticles();
        
        if (this.stressLevel % 10 === 0) {
            this.shakeWorld();
        }
    }

    createStressParticles() {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.position = 'absolute';
                particle.style.width = '8px';
                particle.style.height = '8px';
                particle.style.background = '#ff4444';
                particle.style.borderRadius = '50%';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = '100%';
                particle.style.pointerEvents = 'none';
                particle.style.animation = 'stressFloat 3s ease-out forwards';
                
                document.getElementById('comicWorld').appendChild(particle);
                
                setTimeout(() => particle.remove(), 3000);
            }, i * 200);
        }
    }

    shakeWorld() {
        const world = document.getElementById('comicWorld');
        world.style.animation = 'none';
        world.offsetHeight; // Trigger reflow
        world.style.animation = 'shake 0.5s ease-in-out';
        
        setTimeout(() => {
            world.style.animation = 'none';
        }, 500);
    }

    showNarrative(text) {
        const narrativeBox = document.getElementById('narrativeBox');
        narrativeBox.textContent = text;
        narrativeBox.classList.add('active');
        
        setTimeout(() => {
            narrativeBox.classList.remove('active');
        }, 4000);
    }

    activatePanel(panel) {
        this.showPanelDetails(panel);
    }

    showPanelDetails(panel) {
        const currentPanelId = this.currentStoryPath[this.currentSlide];
        const panelData = this.storyPanels[currentPanelId];
        
        if (panelData) {
            const detailedText = `Image: ${panelData.caption}`;
            this.openModal(detailedText);
        } else {
            this.openModal("A moment captured in the endless complexity of student time management.");
        }
    }

    openModal(text) {
        document.getElementById('modalText').textContent = text;
        document.getElementById('storyModal').classList.add('active');
    }

    closeModal() {
        document.getElementById('storyModal').classList.remove('active');
    }

    createClickEffect(e) {
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.left = e.clientX + 'px';
        ripple.style.top = e.clientY + 'px';
        ripple.style.width = '10px';
        ripple.style.height = '10px';
        ripple.style.background = '#ff6b35';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '1000';
        
        document.body.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    createAtmosphericEffects() {
        setInterval(() => {
            if (Math.random() < 0.1) {
                this.createRandomSoundEffect();
            }
        }, 3000);
    }

    createRandomSoundEffect() {
        const ambientSounds = ['*tick*', '*rustle*', '*sigh*', '*shuffle*'];
        const effect = document.createElement('div');
        effect.style.position = 'absolute';
        effect.style.left = Math.random() * 100 + '%';
        effect.style.top = Math.random() * 100 + '%';
        effect.style.color = 'rgba(255, 255, 255, 0.3)';
        effect.style.fontSize = '0.7rem';
        effect.style.fontStyle = 'italic';
        effect.style.pointerEvents = 'none';
        effect.style.zIndex = '10';
        effect.textContent = ambientSounds[Math.floor(Math.random() * ambientSounds.length)];
        
        document.getElementById('comicWorld').appendChild(effect);
        
        setTimeout(() => effect.remove(), 2000);
    }

// --- Replace your current showAbout() with this:

showAbout() {
    // ◀ Stop any comic audio before opening the About modal
    if (this.currentBackgroundSound) {
        this.currentBackgroundSound.pause();
        this.currentBackgroundSound.currentTime = 0;
        this.currentBackgroundSound = null;
    }

        const aboutHTML = `
            <div class="modal-about">
                <p class="modal-intro">"Ten Minutes" is an interactive photo-comic about the chaos of student life — where ten minutes feels like a lifetime and a blink.</p>
                
                <p>You've got laundry piling up, ramen calling your name, and barely enough time to think. Every choice matters. What you pick shapes the story.</p>
                
                <div class="choice-highlights">
                    <p class="choice-item"><span class="choice-icon">⚡</span> Chat or dash?</p>
                    <p class="choice-item"><span class="choice-icon">🍜</span> Noodles or chores?</p>
                    <p class="choice-item"><span class="choice-icon">💨</span> Recharge or rush?</p>
                </div>

                <p><strong>Explore your day through a fast-paced, choice-driven comic with real-time pressure, branching paths, and a few surprises.</strong></p>

                <h3>Features:</h3>
                <div class="features-list">
                    <p class="feature-item"><span class="feature-bullet">★</span> Animated clock & preview panels</p>
                    <p class="feature-item"><span class="feature-bullet">★</span> Responsive photo panels that fit any screen</p>
                    <p class="feature-item"><span class="feature-bullet">★</span> Decisions that actually matter</p>
                    <p class="feature-item"><span class="feature-bullet">★</span> Mobile-ready, keyboard-friendly, stress-enhancing 😅</p>
                </div>

                <div class="ready-section">
                    <p class="ready-text">Ready?</p>
                    <p class="ready-text">Click the clock.</p>
                    <p class="ready-text">Beat the timer.</p>
                    <p class="ready-text"><strong>Live your ten minutes.</strong></p>
                </div>
            </div>
        `;
        
    document.getElementById('modalText').innerHTML = aboutHTML;
    document.getElementById('storyModal').classList.add('active');
}

    // Team Page Management
// Replace the displayTeamMembers() function in your script.js file
// Find the existing function (around line 600+) and replace it with this enhanced version

// Replace the displayTeamMembers() function in your script.js file
// This version has much shorter, punchier bios that will look better

// Team Page Management
displayTeamMembers() {
    const teamMembersContainer = document.querySelector('.team-members-container');
    if (teamMembersContainer) {
        teamMembersContainer.innerHTML = ''; 
    }

    // ====== CUSTOMIZE YOUR TEAM MEMBERS HERE ======
    // Keep bios SHORT (under 60 characters) for best visual results
            const teamMembers = [
            {
                name: 'Irem Naz Celen',
                role: 'Creative Director',
                image: 'images/team/naz.png',
                bio: 'Storyteller who turns chaos into compelling narratives.'
            },
            {
                name: 'Abdelrahman Khater',
                role: 'Lead Developer',
                image: 'images/team/khater.png',
                bio: 'Code wizard bringing interactive stories to life.'
            },
            {
                name: 'Mahlet Atrsaw',
                role: 'Visual Designer',
                image: 'images/team/mahlet.png',
                bio: 'Comic artist creating visual magic panel by panel.'
            },
            {
                name: 'Ahmed Bilal',
                role: 'UX Researcher',
                image: 'images/team/bilal.png',
                bio: 'User advocate ensuring every choice feels right.'
            }
        ];

    teamMembers.forEach(member => {
        const memberElement = document.createElement('div');
        memberElement.className = 'team-member';

        // Create member image with better error handling
        const imgElement = document.createElement('img');
        imgElement.className = 'team-member-image';
        imgElement.src = member.image;
        imgElement.alt = member.name;
        imgElement.onerror = function() {
            // Fallback placeholder if image is missing
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNmZjZiMzUiLz4KPHN2ZyB4PSIyNSIgeT0iMjAiIHdpZHRoPSIzMCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Ik0xMiA0YTQgNCAwIDAgMSA0IDR2MmE0IDQgMCAwIDEtOCAwVjhhNCA0IDAgMCAxIDQtNHptNiAxMmE2IDYgMCAwIDEtMTIgMCIvPgo8L3N2Zz4KPC9zdmc+';
        };

        // Create member name
        const nameElement = document.createElement('div');
        nameElement.className = 'team-member-name';
        nameElement.textContent = member.name;

        // Create member role
        const roleElement = document.createElement('div');
        roleElement.className = 'team-member-role';
        roleElement.textContent = member.role;

        // Create member bio
        const bioElement = document.createElement('div');
        bioElement.className = 'team-member-bio';
        bioElement.textContent = member.bio;

        // Assemble the member element
        memberElement.appendChild(imgElement);
        memberElement.appendChild(nameElement);
        memberElement.appendChild(roleElement);
        memberElement.appendChild(bioElement);

        if (teamMembersContainer) {
            teamMembersContainer.appendChild(memberElement);
        }
    });
}

    makeChoice(action, nextPanelId, event) {
        this.choices.push(action);
        this.createExplosion(event.target);

        this.updateTimerUrgency();

        // Hide all choice portals in the current panel immediately
        const currentPanelElement = document.querySelector(`#slide${this.currentSlide + 1} .comic-panel`);
        if (currentPanelElement) {
            currentPanelElement.querySelectorAll('.choice-portal').forEach(portal => {
                this.hideChoicePortal(portal);
            });
        }
        
        // Extend the story path by simply appending the chosen branch
        // extendStoryPath returns the index in the updated path where the new panels started
        const newPathStartIndex = this.extendStoryPath(nextPanelId);

        // Regenerate slides with the updated path
        this.generateSlides();

        // Go directly to the start of the newly added branch
        // A small timeout to allow DOM repaint after generateSlides
        setTimeout(() => {
            this.goToSlide(newPathStartIndex);
            
            // Check if the destination panel is an ending panel after navigating
            const destinationPanelId = this.currentStoryPath[newPathStartIndex];
            const destinationPanel = this.storyPanels[destinationPanelId];
            if (destinationPanel && !destinationPanel.next && !destinationPanel.choices) {
                // This is an ending panel, show conclusion after a delay
                setTimeout(() => this.showConclusion(), 1500); // Slightly longer delay before conclusion
            }
        }, 100); // Small delay to ensure DOM is ready
    }

    // extendStoryPath is used for building the path by appending
    extendStoryPath(startPanelId) {
        let currentPanelId = startPanelId;
        const initialPathLength = this.currentStoryPath.length; // Length before adding new panels
        
        // Follow the story chain, adding panels to the path until a choice or ending is hit
        while (currentPanelId && !this.currentStoryPath.includes(currentPanelId)) {
            const panel = this.storyPanels[currentPanelId];
            if (!panel) break; // Stop if panel data is missing
            
            this.currentStoryPath.push(currentPanelId);
            
            // Stop if this panel has choices or is an ending
            if (panel.choices || !panel.next) {
                break;
            }
            
            // Move to the next panel in the chain
            currentPanelId = panel.next;
        }
        
        // Return the index in the currentStoryPath where the new panels started
        // This is the index of the first panel of the new branch
        return initialPathLength;
    }

    showConclusion() {
        const currentPanelId = this.currentStoryPath[this.currentStoryPath.length - 1];
        const finalPanel = this.storyPanels[currentPanelId];
        
        let conclusion = this.generateConclusion();
        
        this.openModal(conclusion);
        
        // Check if the last panel added was an ending panel
        if (finalPanel && !finalPanel.next && !finalPanel.choices) {
        setTimeout(() => {
            if (confirm('Experience a different path through these ten minutes?')) {
                this.restart();
            }
        }, 5000);
        }
    }

    generateConclusion() {
        const hasChat = this.choices.includes('chat');
        const hasRamen = this.choices.includes('ramen') || this.choices.includes('quick_snack');
        const hasLaundry = this.choices.includes('laundry');
        const hasRush = this.choices.includes('rush');
        
        if (hasChat && hasRamen) {
            return "You chose the path of human connection and nourishment. In a world obsessed with productivity, you remembered that relationships and self-care matter most.";
        } else if (hasRush && hasLaundry) {
            return "Efficiency and organization defined your journey. You conquered chaos through decisive action and smart time management.";
        } else if (hasChat) {
            return "You prioritized human connection over efficiency. Sometimes the most important conversations happen in stolen moments.";
        } else {
            return "You navigated the impossible mathematics of student time. Every choice was a negotiation between competing priorities.";
        }
    }

handleTimeUp() {
  clearInterval(this.timerInterval);
  this.shakeWorld();

  setTimeout(() => {
    // 1) Show the "Time's Up" modal
    this.openModal(
      "TIME'S UP! The bell rings, another class begins, and the cycle continues. Ten minutes gone, but the memory of choices lingers. In student life, time doesn't stop for decisions – decisions stop time."
    );

    // 2) Force the Restart button to display above everything
    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
      // a) Add the "showing" class so our CSS fixes take effect
      restartBtn.classList.add('showing');
      // b) Unhide and bring its parent container to the front
      const controls = restartBtn.parentElement;        // .comic-controls
      controls.style.display = 'flex';                  // override “display: none”
      controls.style.zIndex   = '3000';                 // float above modal
    }
  }, 1000);
}

restart() {
    location.reload();
}

toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}}

// Initialize the living comic once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new LivingComic();
});

