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
        
        let analyzedData = null;
        
        // Upload handlers
        uploadZone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', handleFileSelect);
        
        // Drag and drop
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
        
        function analyzeSoil() {
            analyzeBtn.innerHTML = '<span class="loading"></span><span>Analyzing...</span>';
            analyzeBtn.disabled = true;
            
            setTimeout(() => {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    const maxWidth = 500;
                    const ratio = previewImage.naturalWidth > maxWidth ? maxWidth / previewImage.naturalWidth : 1;
                    canvas.width = previewImage.naturalWidth * ratio;
                    canvas.height = previewImage.naturalHeight * ratio;
                    
                    ctx.drawImage(previewImage, 0, 0, canvas.width, canvas.height);
                    
                    const centerX = canvas.width / 2;
                    const centerY = canvas.height / 2;
                    const sampleSize = Math.min(canvas.width, canvas.height) * 0.7;
                    const startX = Math.max(0, centerX - sampleSize/2);
                    const startY = Math.max(0, centerY - sampleSize/2);
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
                        analyzeBtn.innerHTML = '<span>🔍</span><span>Analyze Moisture</span>';
                        analyzeBtn.disabled = false;
                        return;
                    }
                    
                    const avgBrightness = totalBrightness / soilPixelCount;
                    let moisturePercent;
                    
                    if (avgBrightness > 180) {
                        moisturePercent = 18 + (avgBrightness - 180) * 0.18;
                    } else if (avgBrightness > 110) {
                        moisturePercent = 32 + (180 - avgBrightness) * 0.32;
                    } else if (avgBrightness > 50) {
                        moisturePercent = 55 + (110 - avgBrightness) * 0.42;
                    } else {
                        moisturePercent = 78;
                    }
                    
                    moisturePercent = Math.max(15, Math.min(82, Math.round(moisturePercent)));
                    
                    analyzedData = { moisture: moisturePercent };
                    displayResults(moisturePercent);
                    showToast('✅', `Analysis complete: ${moisturePercent}% soil moisture detected`);
                    
                } catch (error) {
                    console.error('Analysis error:', error);
                    showToast('❌', 'Analysis failed. Please try another photo');
                } finally {
                    analyzeBtn.innerHTML = '<span>🔍</span><span>Analyze Moisture</span>';
                    analyzeBtn.disabled = false;
                }
            }, 1000);
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
            results.classList.add('visible');
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