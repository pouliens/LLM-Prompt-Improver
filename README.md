# Environmental Data Prompt Generator

A single-page web application that helps users create better prompts for environmental data analysis using AI assistants like Claude, ChatGPT, and others.

## 🌱 Features

- **Interactive Prompt Builder**: Form-based interface with expert personas, task descriptions, context, and format options
- **7 Environmental Expert Personas**: From Climate Specialists to Policy Advisors
- **Live Preview**: Real-time prompt generation as you type
- **One-Click Copy**: Copy generated prompts to clipboard instantly
- **Download Functionality**: Save prompts as text files
- **Example Prompts**: Pre-built examples for common environmental analysis tasks
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Artifact Support**: Toggle for generating AI artifacts/visualizations
- **Professional UI**: Clean, modern design with environmental color scheme

## 🚀 Quick Start

### Option 1: GitHub Pages (Recommended)

1. **Fork this repository** to your GitHub account
2. **Enable GitHub Pages**:
   - Go to your forked repository settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"
3. **Access your site** at: `https://yourusername.github.io/repository-name`

### Option 2: Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/environmental-prompt-generator.git
   cd environmental-prompt-generator
   ```

2. **Serve locally** (choose one method):
   
   **Using Python**:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   **Using Node.js**:
   ```bash
   npx serve .
   ```
   
   **Using PHP**:
   ```bash
   php -S localhost:8000
   ```

3. **Open in browser**: Navigate to `http://localhost:8000`

## 📁 File Structure

```
environmental-prompt-generator/
├── index.html          # Main application page
├── styles.css          # Styling and responsive design
├── script.js           # JavaScript functionality
├── README.md           # This file
└── assets/             # (Optional) Additional assets
```

## 🛠️ Customization

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
5. **Water & Marine Systems Specialist** - Hydrology and aquatic systems expert
6. **Student/Researcher** - Educational guidance and methodology expert
7. **General Public/Citizen** - Accessible explanations for non-experts

## ⌨️ Keyboard Shortcuts

- **Ctrl/Cmd + Enter**: Copy prompt to clipboard
- **Ctrl/Cmd + S**: Download prompt as text file

## 🔧 Technical Details

### Dependencies
- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Fonts**: Inter (Google Fonts)
- **Icons**: Font Awesome 6.0
- **Browser Support**: All modern browsers (Chrome, Firefox, Safari, Edge)

### Features
- **Responsive Design**: Mobile-first approach with CSS Grid/Flexbox
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Performance**: Debounced updates, efficient DOM manipulation
- **Offline Ready**: Service worker registration included (optional)
- **URL Sharing**: Shareable URLs with pre-filled form data

## 🚀 Deployment Options

### GitHub Pages
Perfect for free hosting with automatic HTTPS and custom domains.

### Netlify
1. Connect your GitHub repository
2. Deploy automatically on push
3. Supports form handling and serverless functions

### Vercel
1. Import GitHub repository
2. Automatic deployments
3. Edge network distribution

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize: `firebase init hosting`
3. Deploy: `firebase deploy`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Ideas for Contributions
- Additional expert personas
- More example prompts
- Improved accessibility
- Additional export formats
- Integration with AI APIs
- Multi-language support

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🐛 Troubleshooting

### Common Issues

**Clipboard not working**:
- Ensure HTTPS connection (required for clipboard API)
- Check browser permissions

**Styles not loading**:
- Verify file paths are correct
- Check browser developer tools for errors

**JavaScript not working**:
- Enable JavaScript in browser
- Check console for error messages

### Browser Compatibility
- **Chrome**: ✅ Full support
- **Firefox**: ✅ Full support  
- **Safari**: ✅ Full support
- **Edge**: ✅ Full support
- **IE**: ❌ Not supported

## 📞 Support

For issues, questions, or suggestions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include browser/OS information for bugs

---

**Built for better environmental data analysis with AI** 🌍🤖