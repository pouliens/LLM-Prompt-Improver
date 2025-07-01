// Environmental Data Prompt Generator JavaScript

class PromptGenerator {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.setupExamples();
        this.updatePreview();
    }

    initializeElements() {
        this.form = document.getElementById('promptForm');
        this.personaSelect = document.getElementById('persona');
        this.taskTextarea = document.getElementById('task');
        this.contextTextarea = document.getElementById('context');
        this.formatSelect = document.getElementById('format');
        this.artifactCheckbox = document.getElementById('artifact');
        this.previewDiv = document.getElementById('promptPreview');
        this.copyBtn = document.getElementById('copyBtn');
        this.personaDescription = document.getElementById('personaDescription');
        this.toast = document.getElementById('toast');
        
        // Custom persona elements
        this.personaToggle = document.querySelectorAll('input[name="personaType"]');
        this.predefinedSection = document.getElementById('predefinedPersonaSection');
        this.customSection = document.getElementById('customPersonaSection');
        this.customDescription = document.getElementById('customPersonaDescription');
        
        // Advanced options elements
        this.advancedToggle = document.getElementById('advancedToggle');
        this.advancedOptions = document.getElementById('advancedOptions');
        this.datastreamsContainer = document.getElementById('datastreams-container');
        this.datastreamsSelected = document.getElementById('datastreams-selected');
        this.datastreamsOptions = document.getElementById('datastreams-options');
        this.boreholesContainer = document.getElementById('boreholes-container');
        this.boreholesSelected = document.getElementById('boreholes-selected');
        this.boreholesOptions = document.getElementById('boreholes-options');
        this.timeInterval = document.getElementById('timeInterval');
        this.numReadings = document.getElementById('numReadings');
        this.startDate = document.getElementById('startDate');
        this.endDate = document.getElementById('endDate');
        
        // Action buttons
        this.loadRandomBtn = document.getElementById('loadRandomBtn');
        this.resetFormBtn = document.getElementById('resetFormBtn');
    }

    setupEventListeners() {
        // Form change listeners
        this.form.addEventListener('input', () => this.updatePreview());
        this.form.addEventListener('change', () => this.updatePreview());

        // Persona toggle listeners
        this.personaToggle.forEach(radio => {
            radio.addEventListener('change', () => this.togglePersonaSection());
        });

        // Advanced options toggle
        this.advancedToggle.addEventListener('change', () => this.toggleAdvancedOptions());

        // Persona description display
        this.personaSelect.addEventListener('change', () => this.updatePersonaDescription());

        // Button listeners
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.loadRandomBtn.addEventListener('click', () => this.loadRandomExample());
        this.resetFormBtn.addEventListener('click', () => this.resetForm());

        // Example buttons
        document.querySelectorAll('.load-example-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.loadExample(e.target.dataset.example));
        });

        // Copy query buttons
        document.querySelectorAll('.copy-query-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.copyQuery(e.target.dataset.query));
        });

        // Datastreams checkbox listeners
        this.setupDatastreamsListeners();
        this.updateDatastreamsDisplay();
        
        // Boreholes checkbox listeners
        this.setupBoreholesListeners();
        this.updateBoreholesDisplay();
    }

    setupDatastreamsListeners() {
        // Listen for checkbox changes
        this.datastreamsOptions.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox' && e.target.name === 'datastreams') {
                this.updateDatastreamsDisplay();
                this.updatePreview();
            }
        });

        // Listen for remove button clicks in selected tags
        this.datastreamsSelected.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove')) {
                const value = e.target.dataset.value;
                const checkbox = this.datastreamsOptions.querySelector(`input[value="${value}"]`);
                if (checkbox) {
                    checkbox.checked = false;
                    this.updateDatastreamsDisplay();
                    this.updatePreview();
                }
            }
        });
    }

    updateDatastreamsDisplay() {
        const checkedBoxes = this.datastreamsOptions.querySelectorAll('input[type="checkbox"]:checked');
        this.datastreamsSelected.innerHTML = '';

        if (checkedBoxes.length === 0) {
            const placeholder = document.createElement('span');
            placeholder.className = 'selected-placeholder';
            placeholder.textContent = 'Click options below to select datastreams...';
            this.datastreamsSelected.appendChild(placeholder);
        } else {
            checkedBoxes.forEach(checkbox => {
                const label = checkbox.parentElement.querySelector('.option-text').textContent;
                const tag = document.createElement('span');
                tag.className = 'selected-tag';
                tag.innerHTML = `
                    <span>${label}</span>
                    <span class="remove" data-value="${checkbox.value}">×</span>
                `;
                this.datastreamsSelected.appendChild(tag);
            });
        }
    }

    setupBoreholesListeners() {
        // Listen for checkbox changes
        this.boreholesOptions.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox' && e.target.name === 'boreholes') {
                this.updateBoreholesDisplay();
                this.updatePreview();
            }
        });

        // Listen for remove button clicks in selected tags
        this.boreholesSelected.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove')) {
                const value = e.target.dataset.value;
                const checkbox = this.boreholesOptions.querySelector(`input[value="${value}"]`);
                if (checkbox) {
                    checkbox.checked = false;
                    this.updateBoreholesDisplay();
                    this.updatePreview();
                }
            }
        });
    }

    updateBoreholesDisplay() {
        const checkedBoxes = this.boreholesOptions.querySelectorAll('input[type="checkbox"]:checked');
        this.boreholesSelected.innerHTML = '';

        if (checkedBoxes.length === 0) {
            const placeholder = document.createElement('span');
            placeholder.className = 'selected-placeholder';
            placeholder.textContent = 'Click options below to select boreholes...';
            this.boreholesSelected.appendChild(placeholder);
        } else {
            checkedBoxes.forEach(checkbox => {
                const label = checkbox.parentElement.querySelector('.option-text').textContent;
                const tag = document.createElement('span');
                tag.className = 'selected-tag';
                tag.innerHTML = `
                    <span>${label}</span>
                    <span class="remove" data-value="${checkbox.value}">×</span>
                `;
                this.boreholesSelected.appendChild(tag);
            });
        }
    }

    setupExamples() {
        this.examples = {
            seismic: {
                persona: 'Data Analyst',
                task: 'Analyse seismic sensor data from BGS monitoring network and identify unusual activity patterns or potential earthquake precursors.',
                context: 'BGS seismic sensor data from 25 monitoring stations across the UK covering January-December 2025. Includes magnitude readings, frequency analysis, and location coordinates with 1-minute resolution.',
                format: 'detailed analysis with step-by-step methodology',
                artifact: true
            },
            groundwater: {
                persona: 'Trend Analyst',
                task: 'Evaluate groundwater level trends from BGS borehole monitoring network and forecast seasonal variations.',
                context: 'BGS groundwater monitoring data from 150 boreholes across England and Wales, collected hourly from 2020-2025. Dataset includes water table depths, aquifer types, and rainfall correlation data.',
                format: 'visualisations with interpretations',
                artifact: true
            },
            temperature: {
                persona: 'Monitoring Specialist',
                task: 'Monitor soil temperature sensor data from BGS network and identify threshold exceedances and anomalous readings.',
                context: 'BGS soil temperature sensors deployed at 50 sites measuring at 10cm, 30cm, and 100cm depths. Real-time data collection from March 2025 with automated quality control flags.',
                format: 'summary report with key findings',
                artifact: false
            }
        };
    }

    togglePersonaSection() {
        const selectedType = document.querySelector('input[name="personaType"]:checked').value;
        
        if (selectedType === 'predefined') {
            this.predefinedSection.classList.add('active');
            this.customSection.classList.remove('active');
            // Reset custom fields
            this.customDescription.value = '';
        } else {
            this.predefinedSection.classList.remove('active');
            this.customSection.classList.add('active');
            // Reset predefined selection
            this.personaSelect.value = '';
            this.personaDescription.classList.remove('show');
        }
        
        this.updatePreview();
    }

    toggleAdvancedOptions() {
        if (this.advancedToggle.checked) {
            this.advancedOptions.classList.add('show');
        } else {
            this.advancedOptions.classList.remove('show');
            // Reset advanced fields
            this.datastreamsOptions.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
            this.updateDatastreamsDisplay();
            this.boreholesOptions.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
            this.updateBoreholesDisplay();
            this.timeInterval.value = '';
            this.numReadings.value = '';
            this.startDate.value = '';
            this.endDate.value = '';
        }
        
        this.updatePreview();
    }

    updatePersonaDescription() {
        const selectedOption = this.personaSelect.selectedOptions[0];
        if (selectedOption && selectedOption.dataset.description) {
            this.personaDescription.textContent = selectedOption.dataset.description;
            this.personaDescription.classList.add('show');
        } else {
            this.personaDescription.classList.remove('show');
        }
    }

    getCurrentPersona() {
        const selectedType = document.querySelector('input[name="personaType"]:checked').value;
        
        if (selectedType === 'predefined') {
            return this.personaSelect.value;
        } else {
            return this.customDescription.value.trim();
        }
    }

    generatePrompt() {
        const persona = this.getCurrentPersona();
        const task = this.taskTextarea.value.trim();
        const context = this.contextTextarea.value.trim();
        const format = this.formatSelect.value;
        const artifact = this.artifactCheckbox.checked;

        if (!persona || !task) {
            return '';
        }

        let prompt = `You are a ${persona}. ${task}`;

        if (context) {
            prompt += `\n\nContext: ${context}`;
        }

        // Add format requirements
        let formatInstructions = [];
        
        if (format) {
            formatInstructions.push(`provide ${format}`);
        }

        if (artifact) {
            formatInstructions.push('create your response as an interactive artifact (code, visualization, or structured output) that can be displayed in an interactive window');
        }

        if (formatInstructions.length > 0) {
            prompt += `\n\nPlease ${formatInstructions.join(' and ')}.`;
        }

        // Add advanced options if enabled
        if (this.advancedToggle.checked) {
            const advancedParams = this.getAdvancedParameters();
            if (advancedParams) {
                prompt += `\n\nData Parameters: ${advancedParams}`;
            }
        }

        // Add persona-specific instructions
        const personaInstructions = this.getPersonaInstructions(persona);
        if (personaInstructions) {
            prompt += `\n\n${personaInstructions}`;
        }

        return prompt;
    }

    getAdvancedParameters() {
        const params = [];
        
        // Get selected datastreams
        const checkedBoxes = this.datastreamsOptions.querySelectorAll('input[type="checkbox"]:checked');
        if (checkedBoxes.length > 0) {
            const selectedDatastreams = Array.from(checkedBoxes).map(checkbox => 
                checkbox.parentElement.querySelector('.option-text').textContent
            );
            params.push(`Focus on datastreams: ${selectedDatastreams.join(', ')}`);
        }
        
        // Get selected boreholes
        const checkedBoreholes = this.boreholesOptions.querySelectorAll('input[type="checkbox"]:checked');
        if (checkedBoreholes.length > 0) {
            const selectedBoreholes = Array.from(checkedBoreholes).map(checkbox => 
                checkbox.parentElement.querySelector('.option-text').textContent
            );
            params.push(`Focus on boreholes: ${selectedBoreholes.join(', ')}`);
        }
        
        // Get time interval
        if (this.timeInterval.value) {
            params.push(`Time interval: ${this.timeInterval.value} minutes`);
        }
        
        // Get number of readings
        if (this.numReadings.value) {
            params.push(`Limit to ${this.numReadings.value} readings`);
        }
        
        // Get start date
        if (this.startDate.value) {
            params.push(`Starting from: ${this.startDate.value}`);
        }
        
        // Get end date
        if (this.endDate.value) {
            params.push(`Ending at: ${this.endDate.value}`);
        }
        
        return params.join('. ');
    }

    getPersonaInstructions(persona) {
        const selectedType = document.querySelector('input[name="personaType"]:checked').value;
        
        // For custom personas, don't add predefined instructions
        if (selectedType === 'custom') {
            return '';
        }
        
        const instructions = {
            'Data Analyst': 'Focus on statistical patterns, trends, and anomalies in the sensor data. Provide quantitative insights with confidence levels and highlight significant changes or outliers.',
            'Data Summariser': 'Create concise, well-structured summaries of key findings. Present information in logical sections with clear headings and bullet points for easy scanning.',
            'Technical Interpreter': 'Translate technical sensor readings into clear, practical language. Explain what the measurements mean in real-world terms and their implications.',
            'Public Communicator': 'Present findings in everyday language that anyone can understand. Avoid technical jargon, use analogies and real-world comparisons, and explain why the data matters to people\'s daily lives.',
            'Monitoring Specialist': 'Focus on real-time analysis, threshold monitoring, and alert conditions. Identify when values exceed normal ranges and suggest monitoring protocols.',
            'Trend Analyst': 'Analyse temporal patterns, seasonal variations, and long-term trends. Provide forecasting insights and identify emerging patterns in the data.',
            'Report Generator': 'Create comprehensive, professional reports with visualisations. Structure findings with executive summaries, detailed analysis, and actionable recommendations.'
        };

        return instructions[persona] || '';
    }

    updatePreview() {
        const prompt = this.generatePrompt();
        
        if (prompt) {
            this.previewDiv.textContent = prompt;
            this.copyBtn.disabled = false;
        } else {
            this.previewDiv.innerHTML = '<p class="placeholder-text">Fill out the form to see your generated prompt here...</p>';
            this.copyBtn.disabled = true;
        }
    }

    async copyToClipboard() {
        const prompt = this.generatePrompt();
        if (!prompt) return;

        try {
            await navigator.clipboard.writeText(prompt);
            this.showToast('Prompt copied to clipboard!', 'success');
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = prompt;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                this.showToast('Prompt copied to clipboard!', 'success');
            } catch (fallbackErr) {
                this.showToast('Failed to copy prompt', 'error');
            }
            document.body.removeChild(textArea);
        }
    }

    async copyQuery(query) {
        if (!query) return;

        try {
            await navigator.clipboard.writeText(query);
            this.showToast('Query copied to clipboard!', 'success');
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = query;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                this.showToast('Query copied to clipboard!', 'success');
            } catch (fallbackErr) {
                this.showToast('Failed to copy query', 'error');
            }
            document.body.removeChild(textArea);
        }
    }


    loadExample(exampleKey) {
        const example = this.examples[exampleKey];
        if (!example) {
            console.error('Example not found:', exampleKey);
            return;
        }

        try {
            // Set to predefined persona mode
            const predefinedRadio = document.querySelector('input[name="personaType"][value="predefined"]');
            if (predefinedRadio) {
                predefinedRadio.checked = true;
                this.togglePersonaSection();
            }

            // Populate form fields and trigger change events
            if (this.personaSelect) {
                this.personaSelect.value = example.persona;
                this.personaSelect.dispatchEvent(new Event('change', { bubbles: true }));
            }
            if (this.taskTextarea) {
                this.taskTextarea.value = example.task;
                this.taskTextarea.dispatchEvent(new Event('input', { bubbles: true }));
            }
            if (this.contextTextarea) {
                this.contextTextarea.value = example.context;
                this.contextTextarea.dispatchEvent(new Event('input', { bubbles: true }));
            }
            if (this.formatSelect) {
                this.formatSelect.value = example.format;
                this.formatSelect.dispatchEvent(new Event('change', { bubbles: true }));
            }
            if (this.artifactCheckbox) {
                this.artifactCheckbox.checked = example.artifact;
                this.artifactCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
            }

            // Update UI
            this.updatePersonaDescription();
            this.updatePreview();
            
            // Scroll to form
            if (this.form) {
                this.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            
            this.showToast(`${exampleKey.charAt(0).toUpperCase() + exampleKey.slice(1)} example loaded!`, 'success');
        } catch (error) {
            console.error('Error loading example:', error);
            this.showToast('Error loading example', 'error');
        }
    }

    loadRandomExample() {
        const exampleKeys = Object.keys(this.examples);
        const randomKey = exampleKeys[Math.floor(Math.random() * exampleKeys.length)];
        this.loadExample(randomKey);
        
        this.showToast(`Random example loaded: ${randomKey.charAt(0).toUpperCase() + randomKey.slice(1)}!`, 'success');
    }

    resetForm() {
        try {
            // Reset to predefined persona mode
            const predefinedRadio = document.querySelector('input[name="personaType"][value="predefined"]');
            if (predefinedRadio) {
                predefinedRadio.checked = true;
                this.togglePersonaSection();
            }

            // Reset all form fields
            if (this.personaSelect) this.personaSelect.value = '';
            if (this.customDescription) this.customDescription.value = '';
            if (this.taskTextarea) this.taskTextarea.value = '';
            if (this.contextTextarea) this.contextTextarea.value = 'BGS sensor data via OGC SensorThings API (sensors.bgs.ac.uk/FROST-Server). Available entities: Observations, Datastreams, Sensors, Things, Locations. Real-time environmental monitoring data.';
            if (this.formatSelect) this.formatSelect.value = '';
            if (this.artifactCheckbox) this.artifactCheckbox.checked = false;
            
            // Reset advanced options
            if (this.advancedToggle) {
                this.advancedToggle.checked = false;
                this.toggleAdvancedOptions();
            }

            // Update UI
            this.updatePersonaDescription();
            this.updatePreview();
            
            this.showToast('Form reset successfully!', 'success');
        } catch (error) {
            console.error('Error resetting form:', error);
            this.showToast('Error resetting form', 'error');
        }
    }

    showToast(message, type = 'success') {
        this.toast.textContent = message;
        this.toast.className = `toast ${type}`;
        this.toast.classList.add('show');
        
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }


    loadFromURL() {
        const params = new URLSearchParams(window.location.search);
        
        // Set persona type
        const personaType = params.get('personaType') || 'predefined';
        document.querySelector(`input[name="personaType"][value="${personaType}"]`).checked = true;
        this.togglePersonaSection();
        
        // Load persona data based on type
        if (personaType === 'predefined' && params.get('persona')) {
            this.personaSelect.value = params.get('persona');
        } else if (personaType === 'custom') {
            if (params.get('customDescription')) this.customDescription.value = params.get('customDescription');
        }
        
        if (params.get('task')) this.taskTextarea.value = params.get('task');
        if (params.get('context')) this.contextTextarea.value = params.get('context');
        if (params.get('format')) this.formatSelect.value = params.get('format');
        if (params.get('artifact')) this.artifactCheckbox.checked = params.get('artifact') === 'true';

        this.updatePersonaDescription();
        this.updatePreview();
    }
}

// Enhanced form validation
class FormValidator {
    constructor(generator) {
        this.generator = generator;
        this.setupValidation();
    }

    setupValidation() {
        // Real-time validation
        this.generator.personaSelect.addEventListener('change', () => this.validatePersona());
        this.generator.customDescription.addEventListener('input', () => this.validatePersona());
        this.generator.taskTextarea.addEventListener('input', () => this.validateTask());
        this.generator.personaToggle.forEach(radio => {
            radio.addEventListener('change', () => this.validatePersona());
        });
    }

    validatePersona() {
        const selectedType = document.querySelector('input[name="personaType"]:checked').value;
        
        if (selectedType === 'predefined') {
            const persona = this.generator.personaSelect;
            if (!persona.value) {
                this.setFieldError(persona, 'Please select an expert persona');
                return false;
            }
            this.clearFieldError(persona);
            this.clearFieldError(this.generator.customDescription);
            return true;
        } else {
            const customDescription = this.generator.customDescription;
            if (!customDescription.value.trim()) {
                this.setFieldError(customDescription, 'Please enter a persona description');
                return false;
            }
            this.clearFieldError(customDescription);
            this.clearFieldError(this.generator.personaSelect);
            return true;
        }
    }

    validateTask() {
        const task = this.generator.taskTextarea;
        if (!task.value.trim()) {
            this.setFieldError(task, 'Please describe your task');
            return false;
        }
        if (task.value.trim().length < 10) {
            this.setFieldError(task, 'Please provide a more detailed task description');
            return false;
        }
        this.clearFieldError(task);
        return true;
    }

    setFieldError(field, message) {
        field.style.borderColor = '#e74c3c';
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '4px';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    validateForm() {
        const personaValid = this.validatePersona();
        const taskValid = this.validateTask();
        return personaValid && taskValid;
    }
}


// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const generator = new PromptGenerator();
    const validator = new FormValidator(generator);
    
    
    // Load from URL parameters if present
    generator.loadFromURL();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to copy
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            if (!generator.copyBtn.disabled) {
                generator.copyToClipboard();
            }
        }
        
    });


    // Performance optimisation: debounce preview updates
    let updateTimeout;
    const originalUpdatePreview = generator.updatePreview.bind(generator);
    generator.updatePreview = () => {
        clearTimeout(updateTimeout);
        updateTimeout = setTimeout(originalUpdatePreview, 150);
    };
});

// Service worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}