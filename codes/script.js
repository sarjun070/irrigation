const fileInput = document.getElementById('fileInput');
        const uploadZone = document.getElementById('uploadZone');
        const previewContainer = document.getElementById('previewContainer');
        const previewImage = document.getElementById('previewImage');
        const removeImage = document.getElementById('removeImage');
        const analyzeBtn = document.getElementById('analyzeBtn');
        const results = document.getElementById('results');
        const resultsPlaceholder = document.getElementById('resultsPlaceholder');
        const moistureValue = document.getElementById('moistureValue');
        const moistureRing = document.getElementById('moistureRing');
        const conditionBadge = document.getElementById('conditionBadge');
        const statusEmoji = document.getElementById('statusEmoji');
        const healthScore = document.getElementById('healthScore');
        const waterAmount = document.getElementById('waterAmount');
        const potSize = document.getElementById('potSize');
        const waterNote = document.getElementById('waterNote');
        const toast = document.getElementById('toast');
        const toastIcon = document.getElementById('toastIcon');
        const toastMessage = document.getElementById('toastMessage');
        const plantCard = document.getElementById('plantCard');
        const plantList = document.getElementById('plantList');
        const plantModal = document.getElementById('plantModal');
        const modalClose = document.getElementById('modalClose');
        const modalPlantIcon = document.getElementById('modalPlantIcon');
        const modalPlantName = document.getElementById('modalPlantName');
        const modalPlantWater = document.getElementById('modalPlantWater');
        const modalPlantSun = document.getElementById('modalPlantSun');
        const modalPlantCare = document.getElementById('modalPlantCare');

        let analyzedData = null;

        const plantDatabase = {
            dry: [
                { name: 'Cactus', icon: '🌵', water: 'Once every 2-3 weeks', sun: 'Full sun', care: 'Well-draining soil, minimal water' },
                { name: 'Aloe Vera', icon: '🌿', water: 'Once every 2 weeks', sun: 'Bright indirect', care: 'Allow soil to dry completely' },
                { name: 'Lavender', icon: '🌸', water: 'Once weekly', sun: 'Full sun', care: 'Excellent drainage required' },
                { name: 'Rosemary', icon: '🌿', water: 'When soil is dry', sun: 'Full sun', care: 'Mediterranean herb, drought tolerant' },
                { name: 'Snake Plant', icon: '🪴', water: 'Every 2-3 weeks', sun: 'Low to bright', care: 'Very low maintenance' },
                { name: 'Succulents', icon: '🍂', water: 'Every 2 weeks', sun: 'Bright light', care: 'Store water in leaves' },
                { name: 'Jade Plant', icon: '🌳', water: 'Every 2-3 weeks', sun: 'Bright indirect', care: 'Let soil dry between watering' },
                { name: 'ZZ Plant', icon: '🌿', water: 'Every 3 weeks', sun: 'Low to bright', care: 'Extremely drought tolerant' },
                { name: 'Ponytail Palm', icon: '🌴', water: 'Every 2 weeks', sun: 'Bright light', care: 'Stores water in bulb base' },
                { name: 'Olive Tree', icon: '🫒', water: 'When dry', sun: 'Full sun', care: 'Mediterranean climate plant' }
            ],
            optimal: [
                { name: 'Tomato', icon: '🍅', water: '2-3 times weekly', sun: 'Full sun', care: 'Consistent moisture for fruits' },
                { name: 'Basil', icon: '🌿', water: 'When top soil dry', sun: 'Full sun', care: 'Harvest regularly for growth' },
                { name: 'Spider Plant', icon: '🕸️', water: 'Weekly', sun: 'Bright indirect', care: 'Easy to propagate' },
                { name: 'Pothos', icon: '🍃', water: 'When soil feels dry', sun: 'Low to bright', care: 'Trailing vine, very adaptable' },
                { name: 'Pepper', icon: '🌶️', water: '2-3 times weekly', sun: 'Full sun', care: 'Warm temperatures preferred' },
                { name: 'Monstera', icon: '🌿', water: 'Weekly', sun: 'Bright indirect', care: 'Large leaves need humidity' },
                { name: 'Peace Lily', icon: '🕊️', water: 'When wilting', sun: 'Low to medium', care: 'Droops when needs water' },
                { name: 'Rubber Plant', icon: '🌳', water: 'Weekly', sun: 'Bright indirect', care: 'Wipe leaves for shine' },
                { name: 'Fiddle Leaf Fig', icon: '🎻', water: 'When top 2" dry', sun: 'Bright indirect', care: 'Consistent care needed' },
                { name: 'Cucumber', icon: '🥒', water: 'Daily in summer', sun: 'Full sun', care: 'Needs support to climb' }
            ],
            wet: [
                { name: 'Mint', icon: '🍃', water: 'Keep moist', sun: 'Partial shade', care: 'Spreads quickly, contain it' },
                { name: 'Fern', icon: '🌿', water: 'Keep damp', sun: 'Indirect light', care: 'High humidity lover' },
                { name: 'Peace Lily', icon: '🕊️', water: 'Keep moist', sun: 'Low light', care: 'Tolerates wet conditions' },
                { name: 'Rice', icon: '🌾', water: 'Flooded fields', sun: 'Full sun', care: 'Aquatic crop plant' },
                { name: 'Willow', icon: '🌳', water: 'Very high', sun: 'Full sun', care: 'Grows near water sources' },
                { name: 'Caladium', icon: '🎨', water: 'Keep moist', sun: 'Shade to partial', care: 'Colorful foliage plant' },
                { name: 'Begonia', icon: '🌺', water: 'Keep damp', sun: 'Partial shade', care: 'Beautiful flowering plant' },
                { name: 'Impatiens', icon: '🌸', water: 'Daily watering', sun: 'Shade', care: 'Continuous bloomer' },
                { name: 'Hosta', icon: '🌿', water: 'Keep moist', sun: 'Shade', care: 'Perennial shade plant' },
                { name: 'Water Lily', icon: '💧', water: 'Aquatic', sun: 'Full sun', care: 'Grows in ponds' }
            ]
        };

        function initEventListeners() {
            uploadZone.addEventListener('click', () => fileInput.click());
            uploadZone.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInput.click();
                }
            });

            fileInput.addEventListener('change', handleFileSelect);

            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.classList.add('dragover');
            });

            uploadZone.addEventListener('dragleave', () => {
                uploadZone.classList.remove('dragover');
            });

            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.classList.remove('dragover');
                const file = e.dataTransfer.files[0];
                if (file && file.type.match('image.*')) {
                    displayImage(file);
                }
            });

            removeImage.addEventListener('click', (e) => {
                e.stopPropagation();
                resetUpload();
            });

            analyzeBtn.addEventListener('click', analyzeSoil);
            potSize.addEventListener('change', updateWaterRecommendation);

            modalClose.addEventListener('click', closeModal);
            plantModal.addEventListener('click', (e) => {
                if (e.target === plantModal) closeModal();
            });

            //
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && plantModal.classList.contains('visible')) {
                    closeModal();
                }
            });
        }

        function handleFileSelect(e) {
            const file = e.target.files[0];
            if (!file) return;

            if (!file.type.match('image.*')) {
                showToast('❌', 'Please upload an image file');
                return;
            }

            if (file.size > 15 * 1024 * 1024) {
                showToast('⚠️', 'File too large. Maximum 15MB allowed');
                return;
            }

            displayImage(file);
        }

        function displayImage(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                uploadZone.style.display = 'none';
                previewContainer.classList.add('visible');
                analyzeBtn.disabled = false;
                results.classList.remove('visible');
                resultsPlaceholder.style.display = 'block';
                analyzedData = null;
            };
            reader.readAsDataURL(file);
        }

        function resetUpload() {
            previewImage.src = '';
            uploadZone.style.display = 'block';
            previewContainer.classList.remove('visible');
            analyzeBtn.disabled = true;
            results.classList.remove('visible');
            resultsPlaceholder.style.display = 'block';
            fileInput.value = '';
            analyzedData = null;
        }

        //
        function analyzeSoil() {
            analyzeBtn.innerHTML = '<span class="loading"></span><span>Analyzing...</span>';
            analyzeBtn.disabled = true;

            setTimeout(() => {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // 
                    const maxWidth = 500;
                    const ratio = previewImage.naturalWidth > maxWidth ? maxWidth / previewImage.naturalWidth : 1;
                    canvas.width = previewImage.naturalWidth * ratio;
                    canvas.height = previewImage.naturalHeight * ratio;

                    ctx.drawImage(previewImage, 0, 0, canvas.width, canvas.height);

                    //
                    const centerX = canvas.width / 2;
                    const centerY = canvas.height / 2;
                    const sampleSize = Math.min(canvas.width, canvas.height) * 0.7;
                    const startX = Math.max(0, centerX - sampleSize / 2);
                    const startY = Math.max(0, centerY - sampleSize / 2);
                    const sampleWidth = Math.min(sampleSize, canvas.width - startX);
                    const sampleHeight = Math.min(sampleSize, canvas.height - startY);

                    const imageData = ctx.getImageData(startX, startY, sampleWidth, sampleHeight);
                    const pixels = imageData.data;

                    let totalBrightness = 0;
                    let soilPixelCount = 0;

                    for (let i = 0; i < pixels.length; i += 4) {
                        const r = pixels[i];
                        const g = pixels[i + 1];
                        const b = pixels[i + 2];
                        const a = pixels[i + 3];

                        if (a < 128) continue;
                        const isGreen = (g > r + 30) && (g > b + 30) && (g > 100);
                        const isBlue = (b > r + 40) && (b > g + 30) && (b > 80);
                        const isBrightWhite = (r > 230) && (g > 230) && (b > 230);
                        const isDarkShadow = (r < 40) && (g < 40) && (b < 40);

                        if (isGreen || isBlue || isBrightWhite || isDarkShadow) continue;

                        
                        const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                        totalBrightness += luminance;
                        soilPixelCount++;
                    }

                    const totalPixels = sampleWidth * sampleHeight;
                    const soilCoverage = (soilPixelCount / totalPixels) * 100;

                    if (soilCoverage < 25) {
                        showToast('⚠️', `Low soil coverage (${soilCoverage.toFixed(0)}%). Please upload a clearer photo`);
                        resetAnalyzeButton();
                        return;
                    }

                    const avgBrightness = totalBrightness / soilPixelCount;
                    let moisturePercent = calculateMoisture(avgBrightness);

                    moisturePercent = Math.max(15, Math.min(82, Math.round(moisturePercent)));

                    analyzedData = { moisture: moisturePercent };
                    displayResults(moisturePercent);
                    showToast('✅', `Analysis complete: ${moisturePercent}% soil moisture detected`);

                } catch (error) {
                    console.error('Analysis error:', error);
                    showToast('❌', 'Analysis failed. Please try another photo');
                } finally {
                    resetAnalyzeButton();
                }
            }, 1000);
        }

        function calculateMoisture(avgBrightness) {
            if (avgBrightness > 180) {
                return 18 + (avgBrightness - 180) * 0.18;
            } else if (avgBrightness > 110) {
                return 32 + (180 - avgBrightness) * 0.32;
            } else if (avgBrightness > 50) {
                return 55 + (110 - avgBrightness) * 0.42;
            } else {
                return 78;
            }
        }

        function resetAnalyzeButton() {
            analyzeBtn.innerHTML = '<span>🔍</span><span>Analyze Moisture</span>';
            analyzeBtn.disabled = false;
        }

        function displayResults(moisture) {
            resultsPlaceholder.style.display = 'none';
            moistureValue.textContent = `${moisture}%`;

            let condition, conditionClass, emoji, health;

            if (moisture < 30) {
                condition = 'Very Dry';
                conditionClass = 'dry';
                emoji = '🔴';
                health = Math.round(moisture / 30 * 60) + '/100';
            } else if (moisture < 50) {
                condition = 'Dry';
                conditionClass = 'dry';
                emoji = '🟡';
                health = Math.round(60 + (moisture - 30) / 20 * 20) + '/100';
            } else if (moisture < 65) {
                condition = 'Optimal';
                conditionClass = 'optimal';
                emoji = '🟢';
                health = Math.round(80 + (moisture - 50) / 15 * 20) + '/100';
            } else {
                condition = 'Wet';
                conditionClass = 'wet';
                emoji = '🔵';
                health = Math.round(100 - (moisture - 65) / 17 * 20) + '/100';
            }

            conditionBadge.textContent = condition;
            conditionBadge.className = `condition-badge ${conditionClass}`;
            moistureRing.className = `moisture-ring-fill ${conditionClass}`;

            const rotation = (moisture / 100) * 360;
            setTimeout(() => {
                moistureRing.style.transform = `rotate(${rotation - 90}deg)`;
            }, 100);

            statusEmoji.textContent = emoji;
            healthScore.textContent = health;

            updateWaterRecommendation();
            updatePlantSuggestions(moisture, conditionClass);
            results.classList.add('visible');
        }

        function updatePlantSuggestions(moisture, conditionClass) {
            let category = 'optimal';
            if (conditionClass === 'dry') category = 'dry';
            else if (conditionClass === 'wet') category = 'wet';

            const plants = plantDatabase[category];

            plantList.innerHTML = plants.map((p, index) => `
        <div class="plant-item" 
             data-index="${index}" 
             data-category="${category}"
             role="listitem"
             tabindex="0">
          <span class="plant-icon" aria-hidden="true">${p.icon}</span>
          <span class="plant-name">${p.name}</span>
          <span class="plant-water">${p.water}</span>
        </div>
      `).join('');

            document.querySelectorAll('.plant-item').forEach(item => {
                item.addEventListener('click', () => {
                    const index = parseInt(item.dataset.index);
                    const category = item.dataset.category;
                    showPlantModal(category, index);
                });

                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const index = parseInt(item.dataset.index);
                        const category = item.dataset.category;
                        showPlantModal(category, index);
                    }
                });
            });

            plantCard.style.display = 'block';
        }

        function showPlantModal(category, index) {
            const plant = plantDatabase[category][index];
            modalPlantIcon.textContent = plant.icon;
            modalPlantName.textContent = plant.name;
            modalPlantWater.textContent = plant.water;
            modalPlantSun.textContent = plant.sun;
            modalPlantCare.textContent = plant.care;
            plantModal.classList.add('visible');

            setTimeout(() => modalClose.focus(), 100);
        }

        function closeModal() {
            plantModal.classList.remove('visible');
            const firstPlant = plantList.querySelector('.plant-item');
            if (firstPlant) firstPlant.focus();
        }

        function updateWaterRecommendation() {
            if (!analyzedData) return;

            const moisture = analyzedData.moisture;
            const potDiameter = parseFloat(potSize.value);
            const radius = potDiameter / 2;
            const surfaceArea = Math.PI * Math.pow(radius, 2);
            const targetMoisture = 45;
            const deficit = Math.max(0, targetMoisture - moisture);
            const waterMl = Math.round((deficit * surfaceArea * 0.65) / 100);

            waterAmount.textContent = waterMl > 0 ? `${waterMl} ml` : 'None needed';

            if (moisture < 30) {
                waterNote.textContent = '🚨 Critical: Water immediately and thoroughly until drainage appears';
            } else if (moisture < 50) {
                waterNote.textContent = '💧 Water needed: Apply slowly and evenly across the surface';
            } else if (moisture < 65) {
                waterNote.textContent = '✅ Perfect moisture level: Your plant is happy!';
            } else {
                waterNote.textContent = '⏳ Too moist: Wait 3-5 days before next watering';
            }
        }

        function showToast(icon, message) {
            toastIcon.textContent = icon;
            toastMessage.textContent = message;
            toast.classList.add('visible');

            setTimeout(() => {
                toast.classList.remove('visible');
            }, 4500);
        }

        function init() {
            initEventListeners();

            document.querySelectorAll('.particle').forEach(particle => {
                const size = Math.random() * 8 + 4;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.animationDelay = `${Math.random() * 20}s`;
                particle.style.animationDuration = `${Math.random() * 10 + 15}s`;
            });
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }