<p align="center" style="display: flex; align-items: center; justify-content: center; gap: 20px; font-size: 2em;">
  <img src="https://cdn-uploads.huggingface.co/production/uploads/6797cadeb825d5b94ea8bacb/ZZWmmroc9BCvlhmxPSciH.png" alt="DeepSeek Logo" height="100">
  <img src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/ollama.png" alt="Ollama Logo" height="100">
</p>

# DeepUI

DeepUI is a modern user interface designed for Deepseek R1, optimized for Ollama and tailored for local AI interactions. Built with Next.js, it offers a privacy-focused, offline-capable interface with system monitoring capabilities.

## Features ✨

- **Local First**: Operates entirely offline with no data storage.
- **Performance Metrics**: Real-time CPU/RAM monitoring.
- **Responsive Design**: Mobile-friendly with QR code sharing.
- **Theme Support**: Built-in dark/light mode toggle.
- **Code Display**: Syntax highlighting for code blocks.
- **Privacy Focused**: Zero data collection or tracking.

## Prerequisites 📋

- Node.js v18+
- Ollama installed: [installation guide](#)
- Deepseek R1 model: `ollama run deepseek-r1`

## Installation 🛠️

```bash
# Clone repository
git clone https://github.com/yourusername/deepui.git

# Install dependencies
npm install

# Start development server
npm run dev
```

> Note: Production build is currently being improved. Use dev mode for now.

## Usage 🚀

1. **Ensure Ollama is running**: `ollama serve`
2. **Access the UI**: Navigate to [http://localhost:3000](http://localhost:3000)

### Mobile Access:

- Scan the QR code from the desktop interface.
- Ensure devices are connected via the same local network.

### Theme Toggle:

- Use the sun/moon icon to switch between dark and light modes.

### System Monitoring:

- View real-time CPU and RAM usage in the status bar.

## Future Enhancements 💡

- Chat history persistence (optional)
- Multi-model support
- File attachment capabilities
- Keyboard shortcuts
- Export chat functionality
- Advanced prompt templates
- Local document Q&A integration

## Contributing 🤝

Contributions are welcome! Please open an issue first to discuss proposed changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
