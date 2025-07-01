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
        this.downloadBtn = document.getElementById('downloadBtn');
        this.personaDescription = document.getElementById('personaDescription');
        this.toast = document.getElementById('toast');
        
        // Custom persona elements
        this.personaToggle = document.querySelectorAll('input[name="personaType"]');
        this.predefinedSection = document.getElementById('predefinedPersonaSection');
        this.customSection = document.getElementById('customPersonaSection');
        this.customTitle = document.getElementById('customPersonaTitle');
        this.customExpertise = document.getElementById('customPersonaExpertise');
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
        this.downloadBtn.addEventListener('click', () => this.downloadPrompt());

        // Example buttons
        document.querySelectorAll('.load-example-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.loadExample(e.target.dataset.example));
        });
    }

    setupExamples() {
        this.examples = {
            climate: {
                persona: 'Climate & Atmospheric Specialist',
                task: 'Analyze temperature anomalies in my climate dataset and identify potential extreme weather events or climate change indicators',
                context: 'Dataset contains 30 years of daily temperature readings from 15 weather stations across the Pacific Northwest. Data includes min/max temperatures, precipitation, and humidity measurements from 1994-2024.',
                format: 'detailed analysis with step-by-step methodology',
                artifact: true
            },
            biodiversity: {
                persona: 'Ecology & Biodiversity Analyst',
                task: 'Evaluate species richness patterns and identify priority areas for conservation based on biodiversity metrics',
                context: 'Field survey data from 50 forest plots covering 500 square kilometers. Includes species counts, abundance data, habitat characteristics, and GPS coordinates collected over 3 field seasons.',
                format: 'visualizations with interpretations',
                artifact: true
            },
            water: {
                persona: 'Water & Marine Systems Specialist',
                task: 'Assess water quality trends and recommend pollution remediation strategies for urban watersheds',
                context: 'Monthly water quality measurements from 12 monitoring stations along 3 rivers over 5 years. Parameters include pH, dissolved oxygen, nitrates, phosphates, turbidity, and heavy metals.',
                format: 'policy recommendations',
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
            this.customTitle.value = '';
            this.customExpertise.value = '';
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
            return this.customTitle.value.trim();
        }
    }

    getCurrentPersonaExpertise() {
        const selectedType = document.querySelector('input[name="personaType"]:checked').value;
        
        if (selectedType === 'custom') {
            return this.customExpertise.value.trim();
        }
        
        return '';
    }

    generatePrompt() {
        const persona = this.getCurrentPersona();
        const personaExpertise = this.getCurrentPersonaExpertise();
        const task = this.taskTextarea.value.trim();
        const context = this.contextTextarea.value.trim();
        const format = this.formatSelect.value;
        const artifact = this.artifactCheckbox.checked;

        if (!persona || !task) {
            return '';
        }

        let prompt = `You are a ${persona}`;
        
        // Add custom expertise if provided
        if (personaExpertise) {
            prompt += ` with the following expertise: ${personaExpertise}`;
        }
        
        prompt += `. ${task}`;

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
            'Environmental Data Scientist': 'Use appropriate statistical methods, provide confidence intervals where relevant, and explain the significance of your findings. Include data quality assessments and limitations.',
            'Climate & Atmospheric Specialist': 'Consider climate variability, reference relevant climate indices, and discuss implications for future climate projections. Include seasonal and long-term trend analysis.',
            'Ecology & Biodiversity Analyst': 'Apply ecological theory, consider species interactions and habitat requirements, and reference conservation biology principles. Include diversity indices and ecological significance.',
            'Environmental Policy & Sustainability Advisor': 'Translate technical findings into policy-relevant language, consider economic and social implications, and provide actionable recommendations for stakeholders.',
            'Water & Marine Systems Specialist': 'Consider hydrological processes, water chemistry principles, and ecosystem impacts. Reference water quality standards and regulatory frameworks.',
            'Student/Researcher': 'Provide educational context, explain methodologies clearly, suggest further reading, and highlight learning opportunities in your analysis.',
            'General Public/Citizen': 'Use accessible language, avoid excessive jargon, provide context for technical terms, and explain the practical implications for communities and daily life.'
        };

        return instructions[persona] || '';
    }

    updatePreview() {
        const prompt = this.generatePrompt();
        
        if (prompt) {
            this.previewDiv.textContent = prompt;
            this.copyBtn.disabled = false;
            this.downloadBtn.disabled = false;
        } else {
            this.previewDiv.innerHTML = '<p class="placeholder-text">Fill out the form to see your generated prompt here...</p>';
            this.copyBtn.disabled = true;
            this.downloadBtn.disabled = true;
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

    downloadPrompt() {
        const prompt = this.generatePrompt();
        if (!prompt) return;

        const persona = this.personaSelect.value.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `environmental_prompt_${persona}_${timestamp}.txt`;

        const blob = new Blob([prompt], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast('Prompt downloaded!', 'success');
    }

    loadExample(exampleKey) {
        const example = this.examples[exampleKey];
        if (!example) return;

        // Set to predefined persona mode
        document.querySelector('input[name="personaType"][value="predefined"]').checked = true;
        this.togglePersonaSection();

        this.personaSelect.value = example.persona;
        this.taskTextarea.value = example.task;
        this.contextTextarea.value = example.context;
        this.formatSelect.value = example.format;
        this.artifactCheckbox.checked = example.artifact;

        this.updatePersonaDescription();
        this.updatePreview();
        
        // Scroll to form
        this.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        this.showToast(`${exampleKey.charAt(0).toUpperCase() + exampleKey.slice(1)} example loaded!`, 'success');
    }

    showToast(message, type = 'success') {
        this.toast.textContent = message;
        this.toast.className = `toast ${type}`;
        this.toast.classList.add('show');
        
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }

    // URL sharing functionality (bonus feature)
    getShareableURL() {
        const params = new URLSearchParams();
        const personaType = document.querySelector('input[name="personaType"]:checked').value;
        
        params.set('personaType', personaType);
        
        if (personaType === 'predefined' && this.personaSelect.value) {
            params.set('persona', this.personaSelect.value);
        } else if (personaType === 'custom') {
            if (this.customTitle.value) params.set('customTitle', this.customTitle.value);
            if (this.customExpertise.value) params.set('customExpertise', this.customExpertise.value);
        }
        
        if (this.taskTextarea.value) params.set('task', this.taskTextarea.value);
        if (this.contextTextarea.value) params.set('context', this.contextTextarea.value);
        if (this.formatSelect.value) params.set('format', this.formatSelect.value);
        if (this.artifactCheckbox.checked) params.set('artifact', 'true');

        return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
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
            if (params.get('customTitle')) this.customTitle.value = params.get('customTitle');
            if (params.get('customExpertise')) this.customExpertise.value = params.get('customExpertise');
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
        this.generator.customTitle.addEventListener('input', () => this.validatePersona());
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
            this.clearFieldError(this.generator.customTitle);
            return true;
        } else {
            const customTitle = this.generator.customTitle;
            if (!customTitle.value.trim()) {
                this.setFieldError(customTitle, 'Please enter a persona title');
                return false;
            }
            this.clearFieldError(customTitle);
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
        
        // Ctrl/Cmd + S to download
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            if (!generator.downloadBtn.disabled) {
                generator.downloadPrompt();
            }
        }
    });

    // Add share functionality if Web Share API is supported
    if (navigator.share) {
        const shareBtn = document.createElement('button');
        shareBtn.innerHTML = '<i class="fas fa-share"></i> Share';
        shareBtn.className = 'copy-btn';
        shareBtn.addEventListener('click', async () => {
            const prompt = generator.generatePrompt();
            if (prompt) {
                try {
                    await navigator.share({
                        title: 'Environmental Data Prompt',
                        text: prompt,
                        url: generator.getShareableURL()
                    });
                } catch (err) {
                    // Fallback to copying URL
                    navigator.clipboard.writeText(generator.getShareableURL());
                    generator.showToast('Shareable URL copied to clipboard!', 'success');
                }
            }
        });
        
        const previewActions = document.querySelector('.preview-actions');
        previewActions.appendChild(shareBtn);
    }

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