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
const getLocationBtn = document.getElementById('getLocationBtn');
const locationStatus = document.getElementById('locationStatus');
const locationMapDiv = document.getElementById('locationMap');
const weatherInfoDiv = document.getElementById('weatherInfo');
const seasonalCard = document.getElementById('seasonalCard');
const climateNote = document.getElementById('climateNote');
const seasonalList = document.getElementById('seasonalList');

let analyzedData = null;
let userLocation = null;
let mapInstance = null;

const plantDatabase = {
    dry: [{
            name: 'Cactus',
            icon: '🌵',
            water: 'Once every 2-3 weeks',
            sun: 'Full sun',
            care: 'Well-draining soil, minimal water'
        },
        {
            name: 'Aloe Vera',
            icon: '🌿',
            water: 'Once every 2 weeks',
            sun: 'Bright indirect',
            care: 'Allow soil to dry completely'
        },
        {
            name: 'Lavender',
            icon: '🌸',
            water: 'Once weekly',
            sun: 'Full sun',
            care: 'Excellent drainage required'
        },
        {
            name: 'Rosemary',
            icon: '🌿',
            water: 'When soil is dry',
            sun: 'Full sun',
            care: 'Mediterranean herb, drought tolerant'
        },
        {
            name: 'Snake Plant',
            icon: '🏠',
            water: 'Every 2-3 weeks',
            sun: 'Low to bright',
            care: 'Very low maintenance'
        },
        {
            name: 'Succulents',
            icon: '🍂',
            water: 'Every 2 weeks',
            sun: 'Bright light',
            care: 'Store water in leaves'
        },
        {
            name: 'Jade Plant',
            icon: '🌳',
            water: 'Every 2-3 weeks',
            sun: 'Bright indirect',
            care: 'Let soil dry between watering'
        },
        {
            name: 'ZZ Plant',
            icon: '🌿',
            water: 'Every 3 weeks',
            sun: 'Low to bright',
            care: 'Extremely drought tolerant'
        },
        {
            name: 'Ponytail Palm',
            icon: '🌴',
            water: 'Every 2 weeks',
            sun: 'Bright light',
            care: 'Stores water in bulb base'
        },
        {
            name: 'Olive Tree',
            icon: '🫖',
            water: 'When dry',
            sun: 'Full sun',
            care: 'Mediterranean climate plant'
        },
        {
            name: 'Echeveria',
            icon: '🌸',
            water: 'Every 2-3 weeks',
            sun: 'Full sun',
            care: 'Rosette succulent, avoid water on leaves'
        },
        {
            name: 'Haworthia',
            icon: '🌵',
            water: 'Every 2 weeks',
            sun: 'Bright indirect',
            care: 'Small succulent, perfect for desks'
        },
        {
            name: 'String of Pearls',
            icon: '📿',
            water: 'Every 2-3 weeks',
            sun: 'Bright indirect',
            care: 'Trailing succulent, let dry between water'
        },
        {
            name: 'Agave',
            icon: '🌵',
            water: 'Once monthly',
            sun: 'Full sun',
            care: 'Very drought tolerant, sharp leaves'
        },
        {
            name: 'Yucca',
            icon: '🌴',
            water: 'Every 2-3 weeks',
            sun: 'Full sun',
            care: 'Architectural plant, low water needs'
        },
        {
            name: 'Burro Tail',
            icon: '🌿',
            water: 'Every 3 weeks',
            sun: 'Bright indirect',
            care: 'Fleshy leaves store water'
        },
        {
            name: 'Prickly Pear',
            icon: '🌵',
            water: 'Monthly',
            sun: 'Full sun',
            care: 'Edible fruit, very hardy'
        },
        {
            name: 'Crown of Thorns',
            icon: '🌹',
            water: 'Every 2 weeks',
            sun: 'Full sun',
            care: 'Flowering succulent'
        },
        {
            name: 'Lithops',
            icon: '🪨',
            water: 'Once monthly',
            sun: 'Full sun',
            care: 'Living stone, minimal water'
        },
        {
            name: 'Sedum',
            icon: '🌿',
            water: 'Every 2 weeks',
            sun: 'Full sun',
            care: 'Ground cover succulent'
        },
        {
            name: 'Kalanchoe',
            icon: '🌸',
            water: 'Every 2 weeks',
            sun: 'Bright light',
            care: 'Flowering succulent'
        },
        {
            name: 'Aeonium',
            icon: '🌿',
            water: 'Every 2-3 weeks',
            sun: 'Full sun',
            care: 'Rosette forming succulent'
        },
        {
            name: 'Graptopetalum',
            icon: '🌿',
            water: 'Every 2 weeks',
            sun: 'Bright light',
            care: 'Colorful succulent'
        },
        {
            name: 'Senecio',
            icon: '🌿',
            water: 'Every 2-3 weeks',
            sun: 'Bright indirect',
            care: 'Trailing succulent'
        },
        {
            name: 'Crassula',
            icon: '🌿',
            water: 'Every 2 weeks',
            sun: 'Bright light',
            care: 'Easy care succulent'
        }
    ],
    optimal: [{
            name: 'Tomato',
            icon: '🍅',
            water: '2-3 times weekly',
            sun: 'Full sun',
            care: 'Consistent moisture for fruits'
        },
        {
            name: 'Basil',
            icon: '🌿',
            water: 'When top soil dry',
            sun: 'Full sun',
            care: 'Harvest regularly for growth'
        },
        {
            name: 'Spider Plant',
            icon: '🕸',
            water: 'Weekly',
            sun: 'Bright indirect',
            care: 'Easy to propagate'
        },
        {
            name: 'Pothos',
            icon: '🍃',
            water: 'When soil feels dry',
            sun: 'Low to bright',
            care: 'Trailing vine, very adaptable'
        },
        {
            name: 'Pepper',
            icon: '🌶',
            water: '2-3 times weekly',
            sun: 'Full sun',
            care: 'Warm temperatures preferred'
        },
        {
            name: 'Monstera',
            icon: '🌿',
            water: 'Weekly',
            sun: 'Bright indirect',
            care: 'Large leaves need humidity'
        },
        {
            name: 'Peace Lily',
            icon: '🕊',
            water: 'When wilting',
            sun: 'Low to medium',
            care: 'Droops when needs water'
        },
        {
            name: 'Rubber Plant',
            icon: '🌳',
            water: 'Weekly',
            sun: 'Bright indirect',
            care: 'Wipe leaves for shine'
        },
        {
            name: 'Fiddle Leaf Fig',
            icon: '🎻',
            water: 'When top 2 dry',
            sun: 'Bright indirect',
            care: 'Consistent care needed'
        },
        {
            name: 'Cucumber',
            icon: '🥒',
            water: 'Daily in summer',
            sun: 'Full sun',
            care: 'Needs support to climb'
        },
        {
            name: 'Lettuce',
            icon: '🥬',
            water: 'Every 2 days',
            sun: 'Partial shade',
            care: 'Keep cool, harvest outer leaves'
        },
        {
            name: 'Strawberry',
            icon: '🍓',
            water: '2-3 times weekly',
            sun: 'Full sun',
            care: 'Keep fruits off soil surface'
        },
        {
            name: 'Herbs Mix',
            icon: '🌿',
            water: 'When top soil dry',
            sun: 'Full sun',
            care: 'Trim regularly for bushy growth'
        },
        {
            name: 'Zucchini',
            icon: '🥒',
            water: 'Daily in heat',
            sun: 'Full sun',
            care: 'One plant feeds a family'
        },
        {
            name: 'Carrot',
            icon: '🥕',
            water: '2-3 times weekly',
            sun: 'Full sun',
            care: 'Loose soil for straight roots'
        },
        {
            name: 'Bell Pepper',
            icon: '🫖',
            water: '2-3 times weekly',
            sun: 'Full sun',
            care: 'Support heavy fruits'
        },
        {
            name: 'Eggplant',
            icon: '🍆',
            water: '2-3 times weekly',
            sun: 'Full sun',
            care: 'Warm climate lover'
        },
        {
            name: 'Green Beans',
            icon: '🌱',
            water: '2-3 times weekly',
            sun: 'Full sun',
            care: 'Climbing variety needs trellis'
        },
        {
            name: 'Corn',
            icon: '🌽',
            water: '2-3 times weekly',
            sun: 'Full sun',
            care: 'Plant in blocks for pollination'
        },
        {
            name: 'Squash',
            icon: '🎃',
            water: '2-3 times weekly',
            sun: 'Full sun',
            care: 'Needs space to spread'
        },
        {
            name: 'Pumpkin',
            icon: '🎃',
            water: '2-3 times weekly',
            sun: 'Full sun',
            care: 'Long growing season'
        },
        {
            name: 'Melon',
            icon: '🍈',
            water: '2-3 times weekly',
            sun: 'Full sun',
            care: 'Needs warm soil'
        },
        {
            name: 'Watermelon',
            icon: '🍉',
            water: '2-3 times weekly',
            sun: 'Full sun',
            care: 'Needs lots of space'
        },
        {
            name: 'Okra',
            icon: '🥬',
            water: '2-3 times weekly',
            sun: 'Full sun',
            care: 'Heat loving vegetable'
        },
        {
            name: 'Sweet Potato',
            icon: '🍠',
            water: '2-3 times weekly',
            sun: 'Full sun',
            care: 'Vigorous grower'
        }
    ],
    wet: [{
            name: 'Mint',
            icon: '🍃',
            water: 'Keep moist',
            sun: 'Partial shade',
            care: 'Spreads quickly, contain it'
        },
        {
            name: 'Fern',
            icon: '🌿',
            water: 'Keep damp',
            sun: 'Indirect light',
            care: 'High humidity lover'
        },
        {
            name: 'Peace Lily',
            icon: '🕊',
            water: 'Keep moist',
            sun: 'Low light',
            care: 'Tolerates wet conditions'
        },
        {
            name: 'Rice',
            icon: '🌾',
            water: 'Flooded fields',
            sun: 'Full sun',
            care: 'Aquatic crop plant'
        },
        {
            name: 'Willow',
            icon: '🌳',
            water: 'Very high',
            sun: 'Full sun',
            care: 'Grows near water sources'
        },
        {
            name: 'Caladium',
            icon: '🎨',
            water: 'Keep moist',
            sun: 'Shade to partial',
            care: 'Colorful foliage plant'
        },
        {
            name: 'Begonia',
            icon: '🌺',
            water: 'Keep damp',
            sun: 'Partial shade',
            care: 'Beautiful flowering plant'
        },
        {
            name: 'Impatiens',
            icon: '🌸',
            water: 'Daily watering',
            sun: 'Shade',
            care: 'Continuous bloomer'
        },
        {
            name: 'Hosta',
            icon: '🌿',
            water: 'Keep moist',
            sun: 'Shade',
            care: 'Perennial shade plant'
        },
        {
            name: 'Water Lily',
            icon: '💧',
            water: 'Aquatic',
            sun: 'Full sun',
            care: 'Grows in ponds'
        },
        {
            name: 'Bamboo',
            icon: '🎋',
            water: 'Keep wet',
            sun: 'Partial shade',
            care: 'Fast growing, needs containment'
        },
        {
            name: 'Cattail',
            icon: '🌾',
            water: 'Standing water',
            sun: 'Full sun',
            care: 'Pond edge plant'
        },
        {
            name: 'Iris',
            icon: '🌷',
            water: 'Keep moist',
            sun: 'Full sun',
            care: 'Beautiful spring flowers'
        },
        {
            name: 'Taro',
            icon: '🍃',
            water: 'Very high',
            sun: 'Partial shade',
            care: 'Tropical water-loving plant'
        },
        {
            name: 'Papyrus',
            icon: '🌾',
            water: 'Standing water',
            sun: 'Full sun',
            care: 'Ancient Egyptian plant'
        },
        {
            name: 'Watercress',
            icon: '🥬',
            water: 'Running water',
            sun: 'Partial shade',
            care: 'Edible aquatic herb'
        },
        {
            name: 'Lotus',
            icon: '🌸',
            water: 'Deep water',
            sun: 'Full sun',
            care: 'Sacred flower, needs pond'
        },
        {
            name: 'Hydrangea',
            icon: '🌸',
            water: 'Keep moist',
            sun: 'Morning sun',
            care: 'Flower color changes with soil pH'
        },
        {
            name: 'Astilbe',
            icon: '🌸',
            water: 'Keep moist',
            sun: 'Partial shade',
            care: 'Feathery flower plumes'
        },
        {
            name: 'Cardinal Flower',
            icon: '🌺',
            water: 'Keep wet',
            sun: 'Partial shade',
            care: 'Attracts hummingbirds'
        },
        {
            name: 'Marsh Marigold',
            icon: '🌼',
            water: 'Standing water',
            sun: 'Full sun',
            care: 'Early spring bloomer'
        },
        {
            name: 'Pickerel Weed',
            icon: '🌾',
            water: 'Shallow water',
            sun: 'Full sun',
            care: 'Native aquatic plant'
        },
        {
            name: 'Water Hyacinth',
            icon: '🌸',
            water: 'Floating',
            sun: 'Full sun',
            care: 'Fast growing, invasive'
        },
        {
            name: 'Duckweed',
            icon: '🌿',
            water: 'Floating',
            sun: 'Full sun',
            care: 'Tiny floating plant'
        },
        {
            name: 'Water Lettuce',
            icon: '🥬',
            water: 'Floating',
            sun: 'Full sun',
            care: 'Rosette floating plant'
        }
    ]
};
const climateZones = {
    tropical: {
        latRange: [-23.5, 23.5],
        description: 'Tropical - Warm year-round'
    },
    subtropical: {
        latRange: [-35, -23.5, 23.5, 35],
        description: 'Subtropical - Mild winters'
    },
    temperate: {
        latRange: [-55, -35, 35, 55],
        description: 'Temperate - Four distinct seasons'
    },
    cold: {
        latRange: [-90, -55, 55, 90],
        description: 'Cold - Short growing season'
    }
};
const seasonalSeeds = {
    tropical: {
        allYear: [{
                name: 'Basil',
                icon: '🌿',
                season: 'Any',
                tip: 'Thrives in heat & humidity'
            },
            {
                name: 'Okra',
                icon: '🥬',
                season: 'Any',
                tip: 'Loves hot, sunny conditions'
            },
            {
                name: 'Sweet Potato',
                icon: '🍠',
                season: 'Any',
                tip: 'Vigorous grower in warm soil'
            },
            {
                name: 'Eggplant',
                icon: '🍆',
                season: 'Any',
                tip: 'Needs consistent warmth'
            },
            {
                name: 'Papaya',
                icon: '🥭',
                season: 'Any',
                tip: 'Fast fruiting tropical tree'
            },
            {
                name: 'Ginger',
                icon: '🫖',
                season: 'Any',
                tip: 'Grows well in shade'
            },
            {
                name: 'Turmeric',
                icon: '🧡',
                season: 'Any',
                tip: 'Rhizome like ginger'
            },
            {
                name: 'Lemongrass',
                icon: '🌾',
                season: 'Any',
                tip: 'Aromatic herb, repels insects'
            }
        ]
    },
    subtropical: {
        spring: [{
                name: 'Tomato',
                icon: '🍅',
                season: 'Spring',
                tip: 'Plant after last frost'
            },
            {
                name: 'Pepper',
                icon: '🌶',
                season: 'Spring',
                tip: 'Start indoors 6-8 weeks early'
            },
            {
                name: 'Cucumber',
                icon: '🥒',
                season: 'Spring',
                tip: 'Direct sow when soil warms'
            },
            {
                name: 'Corn',
                icon: '🌽',
                season: 'Spring',
                tip: 'Plant in blocks for pollination'
            },
            {
                name: 'Squash',
                icon: '🎃',
                season: 'Spring',
                tip: 'Needs space to spread'
            }
        ],
        fall: [{
                name: 'Kale',
                icon: '🥬',
                season: 'Fall',
                tip: 'Sweetens after light frost'
            },
            {
                name: 'Carrot',
                icon: '🥕',
                season: 'Fall',
                tip: 'Loose soil for straight roots'
            },
            {
                name: 'Spinach',
                icon: '🍃',
                season: 'Fall',
                tip: 'Fast-growing cool crop'
            },
            {
                name: 'Broccoli',
                icon: '🥦',
                season: 'Fall',
                tip: 'Harvest before flowers open'
            },
            {
                name: 'Cauliflower',
                icon: '🥦',
                season: 'Fall',
                tip: 'Needs consistent moisture'
            }
        ]
    },
    temperate: {
        spring: [{
                name: 'Lettuce',
                icon: '🥗',
                season: 'Early Spring',
                tip: 'Succession plant every 2 weeks'
            },
            {
                name: 'Peas',
                icon: '🌱',
                season: 'Early Spring',
                tip: 'Plant as soon as soil can be worked'
            },
            {
                name: 'Radish',
                icon: '🔴',
                season: 'Spring',
                tip: 'Ready in 25-30 days'
            },
            {
                name: 'Potato',
                icon: '🥔',
                season: 'Spring',
                tip: 'Plant seed potatoes'
            },
            {
                name: 'Onion',
                icon: '🧅',
                season: 'Spring',
                tip: 'Start from sets or seeds'
            }
        ],
        summer: [{
                name: 'Zucchini',
                icon: '🥒',
                season: 'Late Spring',
                tip: 'One plant feeds a family'
            },
            {
                name: 'Bean',
                icon: '🌱',
                season: 'After frost',
                tip: 'Bush varieties need no support'
            },
            {
                name: 'Squash',
                icon: '🎃',
                season: 'Summer',
                tip: 'Needs space to spread'
            },
            {
                name: 'Melon',
                icon: '🍈',
                season: 'Summer',
                tip: 'Needs warm soil'
            }
        ],
        fall: [{
                name: 'Garlic',
                icon: '🧄',
                season: 'Fall',
                tip: 'Plant cloves 2 weeks before ground freezes'
            },
            {
                name: 'Onion',
                icon: '🧅',
                season: 'Fall/Spring',
                tip: 'Sets need cool start'
            },
            {
                name: 'Cabbage',
                icon: '🥬',
                season: 'Fall',
                tip: 'Harvest before hard freeze'
            },
            {
                name: 'Turnip',
                icon: '🥔',
                season: 'Fall',
                tip: 'Roots and greens edible'
            }
        ]
    },
    cold: {
        spring: [{
                name: 'Potato',
                icon: '🥔',
                season: 'After frost',
                tip: 'Chit seed potatoes first'
            },
            {
                name: 'Cabbage',
                icon: '🥬',
                season: 'Late Spring',
                tip: 'Start indoors for head start'
            },
            {
                name: 'Turnip',
                icon: '🥔',
                season: 'Spring',
                tip: 'Fast growing root vegetable'
            },
            {
                name: 'Kale',
                icon: '🥬',
                season: 'Spring',
                tip: 'Very cold hardy'
            }
        ],
        summer: [{
                name: 'Swiss Chard',
                icon: '🌈',
                season: 'Early Summer',
                tip: 'Harvest outer leaves continuously'
            },
            {
                name: 'Beet',
                icon: '🔴',
                season: 'Summer',
                tip: 'Both roots and greens edible'
            },
            {
                name: 'Carrot',
                icon: '🥕',
                season: 'Summer',
                tip: 'Sweet in cool weather'
            }
        ]
    }
};

const southernSeasons = {
    'spring': 'fall',
    'summer': 'winter',
    'fall': 'spring',
    'winter': 'summer'
};

function getIcon(type) {
    const icons = {
        upload: '📷',
        analyze: '🔬',
        map: '🗺️',
        location: '📍',
        seeds: '🌾',
        tips: '💡',
        results: '📊',
        search: '🔍',
        water: '💧',
        plant: '🌿',
        palette: '🎨',
        lightning: '⚡',
        lock: '🔐',
        globe: '🌍',
        check: '✓',
        error: '✗',
        warning: '⚠',
        dry: '🔴',
        optimal: '🟢',
        wet: '🔵'
    };
    return icons[type] || '•';
}

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
        if (file && file.type.match('image.*')) displayImage(file);
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
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && plantModal.classList.contains('visible')) closeModal();
    });
    getLocationBtn.addEventListener('click', requestLocation);
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.match('image.*')) {
        showToast(getIcon('error'), 'Please upload an image file');
        return;
    }
    if (file.size > 15 * 1024 * 1024) {
        showToast(getIcon('warning'), 'File too large. Maximum 15MB allowed');
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
            const startX = Math.max(0, centerX - sampleSize / 2);
            const startY = Math.max(0, centerY - sampleSize / 2);
            const sampleWidth = Math.min(sampleSize, canvas.width - startX);
            const sampleHeight = Math.min(sampleSize, canvas.height - startY);
            const imageData = ctx.getImageData(startX, startY, sampleWidth, sampleHeight);
            const pixels = imageData.data;
            let totalBrightness = 0;
            let soilPixelCount = 0;
            for (let i = 0; i < pixels.length; i += 4) {
                const r = pixels[i],
                    g = pixels[i + 1],
                    b = pixels[i + 2],
                    a = pixels[i + 3];
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
                showToast(getIcon('warning'), 'Low soil coverage (' + soilCoverage.toFixed(0) + '%). Please upload a clearer photo');
                resetAnalyzeButton();
                return;
            }
            const avgBrightness = totalBrightness / soilPixelCount;
            let moisturePercent = calculateMoisture(avgBrightness);
            moisturePercent = Math.max(15, Math.min(82, Math.round(moisturePercent)));
            analyzedData = {
                moisture: moisturePercent
            };
            displayResults(moisturePercent);
            showToast(getIcon('check'), 'Analysis complete: ' + moisturePercent + '% soil moisture detected');
        } catch (error) {
            console.error('Analysis error:', error);
            showToast(getIcon('error'), 'Analysis failed. Please try another photo');
        } finally {
            resetAnalyzeButton();
        }
    }, 1000);
}

function calculateMoisture(avgBrightness) {
    if (avgBrightness > 180) return 18 + (avgBrightness - 180) * 0.18;
    else if (avgBrightness > 110) return 32 + (180 - avgBrightness) * 0.32;
    else if (avgBrightness > 50) return 55 + (110 - avgBrightness) * 0.42;
    else return 78;
}

function resetAnalyzeButton() {
    analyzeBtn.innerHTML = '<span>' + getIcon('analyze') + '</span><span>Analyze Moisture</span>';
    analyzeBtn.disabled = false;
}

function displayResults(moisture) {
    resultsPlaceholder.style.display = 'none';
    moistureValue.textContent = moisture + '%';
    let condition, conditionClass, emoji, health;
    if (moisture < 30) {
        condition = 'Very Dry';
        conditionClass = 'dry';
        emoji = getIcon('dry');
        health = Math.round(moisture / 30 * 60) + '/100';
    } else if (moisture < 50) {
        condition = 'Dry';
        conditionClass = 'dry';
        emoji = getIcon('dry');
        health = Math.round(60 + (moisture - 30) / 20 * 20) + '/100';
    } else if (moisture < 65) {
        condition = 'Optimal';
        conditionClass = 'optimal';
        emoji = getIcon('optimal');
        health = Math.round(80 + (moisture - 50) / 15 * 20) + '/100';
    } else {
        condition = 'Wet';
        conditionClass = 'wet';
        emoji = getIcon('wet');
        health = Math.round(100 - (moisture - 65) / 17 * 20) + '/100';
    }
    conditionBadge.textContent = condition;
    conditionBadge.className = 'condition-badge ' + conditionClass;
    moistureRing.className = 'moisture-ring-fill ' + conditionClass;
    const rotation = (moisture / 100) * 360;
    setTimeout(() => {
        moistureRing.style.transform = 'rotate(' + (rotation - 90) + 'deg)';
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
    plantList.innerHTML = plants.map((p, index) => '<div class="plant-item" data-index="' + index + '" data-category="' + category + '" role="listitem" tabindex="0"><span class="plant-icon" aria-hidden="true">' + p.icon + '</span><span class="plant-name">' + p.name + '</span><span class="plant-water">' + p.water + '</span></div>').join('');
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
    waterAmount.textContent = waterMl > 0 ? waterMl + ' ml' : 'None needed';
    if (moisture < 30) waterNote.textContent = '🚨 Critical: Water immediately and thoroughly until drainage appears';
    else if (moisture < 50) waterNote.textContent = '💧 Water needed: Apply slowly and evenly across the surface';
    else if (moisture < 65) waterNote.textContent = getIcon('check') + ' Perfect moisture level: Your plant is happy!';
    else waterNote.textContent = '⏳ Too moist: Wait 3-5 days before next watering';
}

function showToast(icon, message) {
    toastIcon.textContent = icon;
    toastMessage.textContent = message;
    toast.classList.add('visible');
    setTimeout(() => {
        toast.classList.remove('visible');
    }, 4500);
}
async function requestLocation() {
    if (!navigator.geolocation) {
        locationStatus.textContent = getIcon('error') + ' Geolocation not supported';
        return;
    }
    getLocationBtn.disabled = true;
    getLocationBtn.innerHTML = '<span class="loading"></span><span>Locating...</span>';
    locationStatus.textContent = '';
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            });
        });
        userLocation = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
        };
        initMap(userLocation.lat, userLocation.lon);
        fetchClimateData(userLocation.lat, userLocation.lon);
        const climate = detectClimateZone(userLocation.lat);
        const recommendations = getSeasonalSeeds(userLocation.lat, climate);
        locationStatus.innerHTML = getIcon('check') + ' <strong>' + climate.description + '</strong><br>Lat: ' + userLocation.lat.toFixed(2) + '°';
        displaySeasonalSeeds(recommendations, climate);
        showToast(getIcon('check'), 'Location set: ' + climate.description + ' zone');
    } catch (error) {
        console.error('Location error:', error);
        locationStatus.textContent = getIcon('warning') + ' Location denied or unavailable';
        showManualClimateSelector();
    } finally {
        getLocationBtn.disabled = false;
        getLocationBtn.innerHTML = '<span>' + getIcon('location') + '</span><span>Update Location</span>';
    }
}

function initMap(lat, lon) {
    if (mapInstance) {
        mapInstance.remove();
    }
    locationMapDiv.style.display = 'block';
    mapInstance = L.map('locationMap').setView([lat, lon], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(mapInstance);
    L.marker([lat, lon]).addTo(mapInstance).bindPopup(getIcon('location') + ' Your Location').openPopup();
    setTimeout(() => {
        mapInstance.invalidateSize();
    }, 100);
}

async function fetchClimateData(lat, lon) {
    weatherInfoDiv.style.display = 'block';
    weatherInfoDiv.innerHTML = '<span class="loading" style="width:16px;height:16px;border-width:2px;"></span> Fetching climate data...';
    try {
        const url = 'https://climate-api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&monthly=temperature_2m_max_mean,temperature_2m_min_mean,precipitation_sum&timezone=auto';
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('API error: ' + response.status);
        }
        const data = await response.json();
        if (!data || !data.monthly) {
            throw new Error('Invalid response format');
        }
        const month = new Date().getMonth();
        const monthly = data.monthly;
        const tempMax = monthly.temperature_2m_max_mean ? monthly.temperature_2m_max_mean[month] : 22;
        const tempMin = monthly.temperature_2m_min_mean ? monthly.temperature_2m_min_mean[month] : 12;
        const precip = monthly.precipitation_sum ? monthly.precipitation_sum[month] : 50;
        weatherInfoDiv.innerHTML = '<div class="weather-badge">🌡 Avg Temp: ' + tempMin.toFixed(1) + '° - ' + tempMax.toFixed(1) + '°C</div><div class="weather-badge">💧 Avg Rain: ' + precip.toFixed(1) + ' mm</div><div style="font-size:0.8rem; margin-top:8px; opacity:0.8">Based on historical climate normals</div>';
    } catch (error) {
        console.warn('Climate API fallback:', error.message);
        const climate = detectClimateZone(lat);
        weatherInfoDiv.innerHTML = '<div class="weather-badge">🌍 ' + climate.description + '</div><div style="font-size:0.8rem; margin-top:8px; opacity:0.8">Live climate data unavailable - Using zone estimate</div>';
    }
}

function detectClimateZone(lat) {
    const absLat = Math.abs(lat);
    if (absLat <= 23.5) return climateZones.tropical;
    if (absLat <= 35) return climateZones.subtropical;
    if (absLat <= 55) return climateZones.temperate;
    return climateZones.cold;
}

function getSeasonalSeeds(latitude, climateZone) {
    const month = new Date().getMonth();
    const isSouthern = latitude < 0;
    let season;
    if ([2, 3, 4].includes(month)) season = 'spring';
    else if ([5, 6, 7].includes(month)) season = 'summer';
    else if ([8, 9, 10].includes(month)) season = 'fall';
    else season = 'winter';
    if (isSouthern && southernSeasons[season]) season = southernSeasons[season];
    const zoneKey = climateZone === climateZones.tropical ? 'tropical' : climateZone === climateZones.subtropical ? 'subtropical' : climateZone === climateZones.temperate ? 'temperate' : 'cold';
    const zoneData = seasonalSeeds[zoneKey];
    const seasonal = zoneData[season] || [];
    const yearRound = zoneData.allYear || [];
    return [...seasonal, ...yearRound].slice(0, 8);
}

function displaySeasonalSeeds(seeds, climate) {
    climateNote.textContent = '🌡 ' + climate.description + ' • Planting window: ' + getCurrentPlantingWindow();
    seasonalList.innerHTML = seeds.map(plant => '<div class="plant-item" role="listitem"><span class="plant-icon" aria-hidden="true">' + plant.icon + '</span><span class="plant-name">' + plant.name + '</span><span class="plant-water" style="font-size:0.7rem">' + plant.tip + '</span></div>').join('');
    seasonalCard.style.display = 'block';
    seasonalCard.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
    });
}

function getCurrentPlantingWindow() {
    const month = new Date().getMonth();
    const windows = {
        0: "Jan: Start indoors",
        1: "Feb: Prep soil",
        2: "Mar: Early crops",
        3: "Apr: Main planting",
        4: "May: Warm-season",
        5: "Jun: Succession sow",
        6: "Jul: Heat-lovers",
        7: "Aug: Fall prep",
        8: "Sep: Cool crops",
        9: "Oct: Garlic/onions",
        10: "Nov: Protect plants",
        11: "Dec: Plan next year"
    };
    return windows[month] || "Check local frost dates";
}

function showManualClimateSelector() {
    locationStatus.innerHTML = '<select id="manualClimate" style="margin-top:8px; padding:8px; border-radius:8px; background:rgba(255,255,255,0.1); color:white; border:1px solid rgba(255,255,255,0.3);"><option value="">Select your climate zone...</option><option value="tropical">🌴 Tropical</option><option value="subtropical">🌤 Subtropical</option><option value="temperate">🍂 Temperate</option><option value="cold">❄ Cold</option></select>';
    document.getElementById('manualClimate')?.addEventListener('change', (e) => {
        const zone = climateZones[e.target.value];
        if (zone) {
            const seeds = getSeasonalSeeds(0, zone);
            displaySeasonalSeeds(seeds, zone);
            showToast(getIcon('check'), 'Climate set: ' + zone.description);
        }
    });
}

function init() {
    initEventListeners();
    document.querySelectorAll('.particle').forEach(particle => {
        const size = Math.random() * 8 + 4;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = Math.random() * 10 + 15 + 's';
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}