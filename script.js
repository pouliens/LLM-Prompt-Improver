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
    }

    setupEventListeners() {
        // Form change listeners
        this.form.addEventListener('input', () => this.updatePreview());
        this.form.addEventListener('change', () => this.updatePreview());

        // Persona toggle listeners
        this.personaToggle.forEach(radio => {
            radio.addEventListener('change', () => this.togglePersonaSection());
        });

        // Persona description display
        this.personaSelect.addEventListener('change', () => this.updatePersonaDescription());

        // Button listeners
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());

        // Example buttons
        document.querySelectorAll('.load-example-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.loadExample(e.target.dataset.example));
        });
    }

    setupExamples() {
        this.examples = {
            seismic: {
                persona: 'Data Analyst',
                task: 'Analyze seismic sensor data from BGS monitoring network and identify unusual activity patterns or potential earthquake precursors',
                context: 'BGS seismic sensor data from 25 monitoring stations across the UK covering January-December 2025. Includes magnitude readings, frequency analysis, and location coordinates with 1-minute resolution.',
                format: 'detailed analysis with step-by-step methodology',
                artifact: true
            },
            groundwater: {
                persona: 'Trend Analyst',
                task: 'Evaluate groundwater level trends from BGS borehole monitoring network and forecast seasonal variations',
                context: 'BGS groundwater monitoring data from 150 boreholes across England and Wales, collected hourly from 2020-2025. Dataset includes water table depths, aquifer types, and rainfall correlation data.',
                format: 'visualizations with interpretations',
                artifact: true
            },
            temperature: {
                persona: 'Monitoring Specialist',
                task: 'Monitor soil temperature sensor data from BGS network and identify threshold exceedances and anomalous readings',
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

        // Add persona-specific instructions
        const personaInstructions = this.getPersonaInstructions(persona);
        if (personaInstructions) {
            prompt += `\n\n${personaInstructions}`;
        }

        return prompt;
    }

    getPersonaInstructions(persona) {
        const selectedType = document.querySelector('input[name="personaType"]:checked').value;
        
        // For custom personas, don't add predefined instructions
        if (selectedType === 'custom') {
            return '';
        }
        
        const instructions = {
            'Data Analyst': 'Focus on statistical patterns, trends, and anomalies in the sensor data. Provide quantitative insights with confidence levels and highlight significant changes or outliers.',
            'Data Summarizer': 'Create concise, well-structured summaries of key findings. Present information in logical sections with clear headings and bullet points for easy scanning.',
            'Technical Interpreter': 'Translate technical sensor readings into clear, practical language. Explain what the measurements mean in real-world terms and their implications.',
            'Monitoring Specialist': 'Focus on real-time analysis, threshold monitoring, and alert conditions. Identify when values exceed normal ranges and suggest monitoring protocols.',
            'Trend Analyst': 'Analyze temporal patterns, seasonal variations, and long-term trends. Provide forecasting insights and identify emerging patterns in the data.',
            'Report Generator': 'Create comprehensive, professional reports with visualizations. Structure findings with executive summaries, detailed analysis, and actionable recommendations.'
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


    // Performance optimization: debounce preview updates
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