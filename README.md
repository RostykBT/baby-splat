# 🎯 Baby Splat

> A **very simple** Babylon.js Gaussian Splatting renderer that just works! ✨

## 🚀 Quick Start

Getting up and running is stupidly easy:

1. **Drop your file** 📁  
   Simply put your `input.splat` into the `public/` folder

2. **Install dependencies** 📦

   ```bash
   yarn install
   # or
   npm install
   ```

3. **Fire it up** 🔥

   ```bash
   yarn dev
   # or
   npm run dev
   ```

4. **Open and enjoy** 🎉  
   Head over to [http://localhost:3000](http://localhost:3000) in your browser

See? **As simple as it is!**

> 💡 **Pro tip:** You might need to edit the rotation of the splat though 😉

---

## 📋 For the Boring People

_Because some folks need the full technical breakdown..._

### 🛠️ Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **3D Engine:** Babylon.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Package Manager:** npm/yarn

### 📋 Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**
- A modern browser with WebGL support
- Your favorite `.splat` file

### 📁 Project Structure

```
baby-splat/
├── public/
│   └── input.splat          # Your Gaussian splat file goes here
├── src/
│   ├── app/
│   │   ├── page.tsx         # Main landing page
│   │   └── gaussian/        # Gaussian splatting demo
│   └── components/
│       └── GaussianSplattingScene.tsx
├── package.json
└── README.md
```

### 🎛️ Configuration

The Gaussian splat renderer loads from `public/input.splat` by default. If you need to:

- **Change the file path:** Edit the file reference in `GaussianSplattingScene.tsx`
- **Adjust rotation/position:** Modify the transform properties in the scene component
- **Tweak performance:** Adjust the rendering settings in Babylon.js configuration

### 🐛 Troubleshooting

**Scene not loading?**

- Check browser console for errors
- Ensure your `.splat` file is valid
- Verify WebGL is enabled in your browser

**Performance issues?**

- Try a smaller `.splat` file
- Close other browser tabs
- Check your GPU drivers are up to date

### 🤝 Contributing

Found a bug? Want to add features? PRs welcome! Just keep it simple and fun.

### 📄 License

do whatever you want with this code! 🎉
