// script.js
class LivingComic {
    constructor() {
        this.currentSlide = 0;
        this.timeLeft = 600; // 10 minutes in seconds
        this.choices = [];
        this.timerActive = false;
        this.currentView = 'home'; // 'home' or 'comic'
        this.currentStoryPath = [];
        this.storyPanels = this.defineStoryStructure();
        
        this.soundEffects = ['POW!', 'BANG!', 'ZOOM!', 'CRASH!', 'TICK!', 'SWOOSH!'];
        
        this.init();
    }

    defineStoryStructure() {
        // EASY IMAGE CONFIGURATION - Just add your images to the images/ folder
        // and update the image paths here!
        return {
            'start': {
                id: 'start',
                caption: "He always plans too much for too little time. Today, he has only ten minutes. And a thousand tiny decisions.",
                image: 'images/1s.png', // Add your image here
                next: 'friend_approach'
            },
            'friend_approach': {
                id: 'friend_approach',
                caption: "She is chatting on but his brain's already running ahead of his. Should he stay and chat or run to the room??? Help him make a decision.'",
                image: 'images/2s.png', // Add your image here
                next: 'chat_scene'
            },
            'chat_scene': {
                id: 'chat_scene',
                caption: "They sat down, and the conversation got better and better!!! And he kept worrying about the chores waiting for him in the room.",
                image: 'images/chat_scene.jpg', // Add your image here
                next: 'rush_stairs'
            },
            'rush_stairs': {
                id: 'rush_stairs',
                caption: "THUD THUD THUD - Student running frantically up stairs after spending time chatting",
                image: 'images/rush_stairs.jpg', // Add your image here
                next: 'hallway_run'
            },
            'hallway_run': {
                id: 'hallway_run',
                caption: "After they separated, he ran! Food? Laundry? Breathing?He just needed to clear his head in ten minutes or less.",
                image: 'images/hallway_run.jpg', // Add your image here
                next: 'room_door'
            },
            'room_door': {
                id: 'room_door',
                caption: "Student at door with SIGH - He finally reached his room. But inside waited two battles: One boiling, one overflowing.",
                image: 'images/room_door.jpg', // Add your image here
                next: 'big_choice'
            },
            'big_choice': {
                id: 'big_choice',
                caption: "Student in room between laundry basket and ramen pot thinking 'Laundry or ramen... Whatever I skip, I'll regret later.'",
                image: 'images/big_choice.jpg', // Add your image here
                choices: [
                    { text: 'MAKE RAMEN', action: 'ramen', next: 'ramen_bliss' },
                    { text: 'DO LAUNDRY', action: 'laundry', next: 'laundry_journey' }
                ]
            },
            'ramen_bliss': {
                id: 'ramen_bliss',
                caption: "AMAZING! - Student savoring ramen noodles in pure bliss, steam rising, completely present in the moment",
                image: 'images/ramen_bliss.jpg', // Add your image here
                next: 'time_shock'
            },
            'time_shock': {
                id: 'time_shock',
                caption: "NOOO!! - Student's face in horror looking at phone, realizing time is almost up while ramen burns",
                image: 'images/time_shock.jpg', // Add your image here
                next: 'ramen_unfinished'
            },
            'ramen_unfinished': {
                id: 'ramen_unfinished',
                caption: "Student leaving unfinished ramen, grabbing bag thinking 'I'll finish it later... maybe.'",
                image: 'images/ramen_unfinished.jpg', // Add your image here
                next: 'ramen_ending'
            },
            'laundry_journey': {
                id: 'laundry_journey',
                caption: "Student hurriedly carrying laundry basket saying 'Let's get this over with.'",
                image: 'images/laundry_journey.jpg', // Add your image here
                next: 'laundry_hallway'
            },
            'laundry_hallway': {
                id: 'laundry_hallway',
                caption: "Student walking down hallway carrying colorful patterned laundry bag toward the unexplored zones",
                image: 'images/laundry_hallway.jpg', // Add your image here
                next: 'washing_machine'
            },
            'washing_machine': {
                id: 'washing_machine',
                caption: "Close-up view through washing machine door as student loads laundry inside",
                image: 'images/washing_machine.jpg', // Add your image here
                next: 'laundry_victory'
            },
            'laundry_victory': {
                id: 'laundry_victory',
                caption: "FINALLY!! - Student celebrating with arms raised in triumph in laundry room",
                image: 'images/laundry_victory.jpg', // Add your image here
                next: 'laundry_ending'
            },
            'ramen_ending': {
                id: 'ramen_ending',
                caption: "Student walking through hallway having used his ten minutes imperfectly but meaningfully",
                image: 'images/ramen_ending.jpg' // Add your image here
            },
            'laundry_ending': {
                id: 'laundry_ending',
                caption: "Student walking confidently through hallway with sense of accomplishment",
                image: 'images/laundry_ending.jpg' // Add your image here
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
            panel.addEventListener('mouseenter', () => this.hoverPreview(panel));
        });

        // Slider navigation
        document.getElementById('prevBtn').addEventListener('click', () => this.prevSlide());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextSlide());

        // Controls
        document.getElementById('restartBtn').addEventListener('click', () => this.restart());
        document.getElementById('modalClose').addEventListener('click', () => this.closeModal());

        // Panel interactions - now handled dynamically
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('comic-panel') || e.target.closest('.comic-panel')) {
                const panel = e.target.closest('.comic-panel') || e.target;
                this.activatePanel(panel);
            }
        });

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
            this.showHome();
        });

        document.getElementById('navComic').addEventListener('click', (e) => {
            e.preventDefault();
            this.startComic();
        });

        document.getElementById('navRestart').addEventListener('click', (e) => {
            e.preventDefault();
            this.restart();
        });

        document.getElementById('navAbout').addEventListener('click', (e) => {
            e.preventDefault();
            this.showAbout();
        });

        document.getElementById('navFullscreen').addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleFullscreen();
        });

        document.getElementById('navLogo').addEventListener('click', (e) => {
            e.preventDefault();
            this.showHome();
        });

        // Mobile menu toggle
        document.getElementById('navBurger').addEventListener('click', () => {
            this.toggleMobileMenu();
        });
    }

    // View Management
    showHome() {
        this.currentView = 'home';
        document.getElementById('homePage').classList.add('active');
        document.getElementById('comicPage').classList.remove('active');
        document.getElementById('timer').style.display = 'none';
        this.stopTimer();
    }

    showComic() {
        this.currentView = 'comic';
        document.getElementById('homePage').classList.remove('active');
        document.getElementById('comicPage').classList.add('active');
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
        document.getElementById('timer').style.display = 'block';
        
        this.buildInitialStoryPath();
        this.generateSlides();
        this.startTimer();
        this.createSoundEffect();
    }

    buildInitialStoryPath() {
        this.currentStoryPath = ['start', 'friend_approach', 'chat_scene', 'rush_stairs', 'hallway_run', 'room_door', 'big_choice'];
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
            panel.choices.forEach((choice, choiceIndex) => {
                const choicePortal = document.createElement('div');
                choicePortal.className = 'choice-portal';
                choicePortal.textContent = choice.text;
                choicePortal.style.bottom = '10%';
                choicePortal.style[choiceIndex === 0 ? 'left' : 'right'] = '15%';
                choicePortal.addEventListener('click', (e) => this.makeChoice(choice.action, choice.next, e));
                panelContent.appendChild(choicePortal);
            });
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
        
        // Start with image's natural dimensions
        if (aspectRatio > 1) {
            // Landscape image
            optimalWidth = Math.min(availableWidth * 0.9, imgWidth, 800);
            optimalHeight = optimalWidth / aspectRatio;
        } else {
            // Portrait image  
            optimalHeight = Math.min(availableHeight * 0.8, imgHeight, 600);
            optimalWidth = optimalHeight * aspectRatio;
        }
        
        // Ensure we don't exceed available space
        if (optimalWidth > availableWidth * 0.9) {
            optimalWidth = availableWidth * 0.9;
            optimalHeight = optimalWidth / aspectRatio;
        }
        
        if (optimalHeight > availableHeight * 0.8) {
            optimalHeight = availableHeight * 0.8;
            optimalWidth = optimalHeight * aspectRatio;
        }
        
        // Add space for caption (120px) and padding
        const totalPanelHeight = optimalHeight + 120 + 40; // image + caption + padding
        const totalPanelWidth = optimalWidth + 40; // image + padding
        
        // Apply computed dimensions with fallbacks
        panel.style.width = Math.min(totalPanelWidth, availableWidth * 0.95) + 'px';
        panel.style.height = Math.min(totalPanelHeight, availableHeight * 0.95) + 'px';
        
        // Ensure panel fits in all cases
        panel.style.maxWidth = 'calc(100vw - 200px)';
        panel.style.maxHeight = 'calc(100vh - 220px)';
        panel.style.overflow = 'hidden';
        
        console.log(`Adjusted panel size: ${panel.style.width} x ${panel.style.height}`);
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
        
        this.createSoundEffect();
        this.createExplosion(panel);
        this.showNarrative(previews[previewNumber] || "A moment in the ten-minute journey...");
    }

    hoverPreview(panel) {
        this.createHoverSoundEffect(panel);
    }

    createHoverSoundEffect(panel) {
        const effect = document.createElement('div');
        effect.style.position = 'absolute';
        effect.style.top = '10px';
        effect.style.left = '10px';
        effect.style.color = '#666';
        effect.style.fontSize = '0.8rem';
        effect.style.fontStyle = 'italic';
        effect.style.pointerEvents = 'none';
        effect.textContent = this.soundEffects[Math.floor(Math.random() * this.soundEffects.length)];
        
        panel.appendChild(effect);
        
        setTimeout(() => effect.remove(), 1000);
    }

    toggleMobileMenu() {
        const burger = document.getElementById('navBurger');
        const navLinks = document.getElementById('navLinks');
        
        burger.classList.toggle('active');
        navLinks.classList.toggle('active');
    }

    // Slider Functions
    nextSlide() {
        if (this.currentSlide < this.currentStoryPath.length - 1) {
            this.currentSlide++;
            this.updateSliderPosition();
            this.createSoundEffect();
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
            this.currentSlide--;
            this.updateSliderPosition();
            this.createSoundEffect();
        }
    }

    goToSlide(slideIndex) {
        if (slideIndex >= 0 && slideIndex < this.currentStoryPath.length) {
            this.currentSlide = slideIndex;
            this.updateSliderPosition();
            this.createSoundEffect();
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

    createSoundEffect() {
        const effect = document.createElement('div');
        effect.className = 'sound-effect';
        effect.textContent = this.soundEffects[Math.floor(Math.random() * this.soundEffects.length)];
        effect.style.left = Math.random() * 80 + 10 + '%';
        effect.style.top = Math.random() * 60 + 20 + '%';
        effect.style.position = 'absolute';
        effect.style.pointerEvents = 'none';
        effect.style.zIndex = '300';
        
        document.getElementById('comicWorld').appendChild(effect);
        
        setTimeout(() => effect.remove(), 1000);
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

    showAbout() {
        const aboutText = `"Ten Minutes" is an interactive photo-comic experience that explores the weight of small decisions in student life. 

Based on the reality that students often have impossible amounts to accomplish in tiny windows of time, 
this story follows one student's journey through a ten-minute break between classes.

Every choice you make shapes the narrative, representing the constant negotiation between efficiency and humanity, 
productivity and self-care, that defines modern student existence.

The experience features:
• Interactive home page with animated clock and preview panels
• Photo-based storytelling with descriptive captions that resize dynamically
• Choice-driven narrative that affects the story outcome
• Real-time countdown timer that adds pressure
• Slider navigation for smooth story progression
• Dynamic image loading with fallback support
• Fully responsive design that works on all devices

RESPONSIVE FEATURES:
• Panels automatically adjust to image dimensions
• Content never exceeds viewport boundaries
• Text sizes scale with screen size
• Touch-friendly navigation on mobile
• Landscape/portrait orientation support

To add your own images:
1. Create an 'images' folder in your project directory
2. Add your photos with the filenames specified in the defineStoryStructure() method
3. The panels will automatically resize based on your image dimensions!

Navigate using the arrow buttons, click the dots, or use your keyboard arrow keys. 
Start from the home page by clicking the animated clock or "Begin Your Story" button.`;
        
        this.openModal(aboutText);
    }

    makeChoice(action, nextPanelId, event) {
        this.choices.push(action);
        this.createSoundEffect();
        this.createExplosion(event.target);
        
        // Add the next panel(s) to the story path
        this.extendStoryPath(nextPanelId);
        
        const narratives = {
            chat: "You chose human connection over efficiency. The conversation got better and better! But time kept ticking...",
            rush: "Smart choice! You chose efficiency over socializing and gained precious time.",
            laundry: "Productivity over pleasure! You tackled the mountain of procrastination.",
            ramen: "For a moment, everything else faded. No deadlines. No choices. Just noodles."
        };

        this.showNarrative(narratives[action] || "Your choice echoes through the remaining minutes...");
        this.updateTimerUrgency();
        this.hideChoicePortal(event.target);
        
        // Auto-advance to next slide after choice
        setTimeout(() => {
            this.nextSlide();
            
            // Check if we've reached an ending after advancing
            const currentPanelId = this.currentStoryPath[this.currentSlide];
            const currentPanel = this.storyPanels[currentPanelId];
            if (currentPanel && !currentPanel.next && !currentPanel.choices) {
                // This is an ending panel, show conclusion after a delay
                setTimeout(() => this.showConclusion(), 2000);
            }
        }, 2000);
    }

    extendStoryPath(startPanelId) {
        let currentPanelId = startPanelId;
        
        // Follow the story chain until we hit a choice or ending
        while (currentPanelId && !this.currentStoryPath.includes(currentPanelId)) {
            const panel = this.storyPanels[currentPanelId];
            if (!panel) break;
            
            this.currentStoryPath.push(currentPanelId);
            
            // If this panel has choices, stop here
            if (panel.choices) {
                break;
            }
            
            // Continue to next panel if it exists
            currentPanelId = panel.next;
        }
        
        // Regenerate slides with new path
        this.generateSlides();
    }

    showConclusion() {
        const currentPanelId = this.currentStoryPath[this.currentStoryPath.length - 1];
        const finalPanel = this.storyPanels[currentPanelId];
        
        let conclusion = this.generateConclusion();
        
        this.openModal(conclusion);
        
        setTimeout(() => {
            if (confirm('Experience a different path through these ten minutes?')) {
                this.restart();
            }
        }, 5000);
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
        this.createSoundEffect();
        this.shakeWorld();
        
        setTimeout(() => {
            this.openModal("TIME'S UP! The bell rings, another class begins, and the cycle continues. Ten minutes gone, but the memory of choices lingers. In student life, time doesn't stop for decisions - decisions stop time.");
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
    }
}

// Initialize the living comic once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new LivingComic();
});
