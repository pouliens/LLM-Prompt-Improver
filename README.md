# Environmental Data Prompt Generator

A single-page web application that helps users create better prompts for environmental data analysis using AI assistants like Claude, ChatGPT, and others.

https://pouliens.github.io/LLM-Prompt-Improver/

## 🌱 Features

- **Interactive Prompt Builder**: Form-based interface with expert personas, task descriptions, context, and format options
- **7 Environmental Expert Personas**: From Climate Specialists to Policy Advisors
- **Live Preview**: Real-time prompt generation as you type
- **One-Click Copy**: Copy generated prompts to clipboard instantly


## 🛠️ Customisation

### Adding New Personas

Edit the `<select>` options in `index.html`:

```html
<option value="Your New Persona" data-description="Description of expertise">
    Your New Persona
</option>
```

Add corresponding instructions in `script.js`:

```javascript
const instructions = {
    'Your New Persona': 'Specific instructions for this persona...',
    // ... other personas
};
```

### Modifying Examples

Update the `examples` object in `script.js`:

```javascript
this.examples = {
    yourExample: {
        persona: 'Expert Type',
        task: 'Task description',
        context: 'Background context',
        format: 'Output format',
        artifact: true/false
    }
};
```

### Styling Changes

Modify CSS variables in `styles.css`:

```css
:root {
    --primary-green: #2d5a27;
    --secondary-green: #4a7c59;
    /* ... other variables */
}
```

## 🌍 Environmental Expert Personas

1. **Environmental Data Scientist** - Statistical analysis and modeling expert
2. **Climate & Atmospheric Specialist** - Climate data and weather pattern expert
3. **Ecology & Biodiversity Analyst** - Species and ecosystem specialist
4. **Environmental Policy & Sustainability Advisor** - Policy and strategy expert
5. **Public Communicator** - Present findings in everyday language that anyone can understand
6. **Water & Marine Systems Specialist** - Hydrology and aquatic systems expert
7. **Student/Researcher** - Educational guidance and methodology expert
8. **General Public/Citizen** - Accessible explanations for non-experts

## ⌨️ Keyboard Shortcuts

- **Ctrl/Cmd + Enter**: Copy prompt to clipboard
- **Ctrl/Cmd + S**: Download prompt as text file

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Ideas for Contributions

- Additional expert personas
- More example prompts
- Additional export formats
- Multi-language support
